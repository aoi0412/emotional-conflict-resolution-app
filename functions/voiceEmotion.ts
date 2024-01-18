import axios from "axios";
import { fetchFile } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { VoiceEmotion } from "@/types/emotion";
import { checkIsEmpathEnable } from "@/db/checkIsEmpathEnable";

// bodyはapikeyにAPIキーを入れ，wavに音声ファイルを入れる
// 音声はPCMWAve形式でないといけない
// データサイズを1.9MB以下にする必要がある
// 1.9MBを超えるとエラーが出る
// フォーマットがPCM_FLOAT，PCM_SIGNED，PCM_UNSIGNEDのみ対応
// サンプリング周波数が11025Hzであること．
// 音声データが5秒以下であること．
// チャンネル数が1であること．

export const voiceEmotion = async (wavFile: File) => {
  const formData = new FormData();
  formData.append("apikey", process.env.NEXT_PUBLIC_EMPATH_API_KEY || "");
  formData.append("wav", wavFile);
  let result: VoiceEmotion = {
    error: 0,
    calm: 0,
    anger: 0,
    joy: 0,
    sorrow: 0,
    energy: 0,
  };
  await checkIsEmpathEnable()
    .then(async (isEnable) => {
      console.log("is EmpathAPI enable", isEnable);
      if (isEnable) {
        const res = await axios.post(
          "https://api.webempath.net/v2/analyzeWav",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("res is", res.data);
        result = res.data;
      }
    })
    .catch((e) => {
      console.error(e);
    });

  return result;
};

export async function DetectVoiceEmotion(
  inputBlob: Blob
): Promise<VoiceEmotion> {
  // BlobからArrayBufferを取得
  const arrayBuffer = await inputBlob.arrayBuffer();

  // ArrayBufferをFFmpegが扱える形式に変換
  const uint8Array = new Uint8Array(arrayBuffer);
  const ffmpeg = new FFmpeg();
  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }
  // ファイルをメモリに読み込む
  ffmpeg.writeFile("input.wav", uint8Array);

  // FFmpegを使って変換する
  // -ac 1 はモノラル音声に設定
  // -ar 11025 はサンプリング周波数を11025Hzに設定
  await ffmpeg.exec([
    "-i",
    "input.wav",
    "-ac",
    "1",
    "-ar",
    "11025",
    "output.wav",
  ]);
  console.log("ffmpeg", ffmpeg);
  // 出力ファイルを取得する
  const data = await ffmpeg.readFile("output.wav");

  // FFmpegからの出力データをBlobに変換
  const outputBlob = new Blob([data], { type: "audio/wav" });

  // BlobをFileに変換
  const outputFile = new File([outputBlob], "output.wav", {
    type: "audio/wav",
    lastModified: new Date().getTime(),
  });

  const result = await voiceEmotion(outputFile);
  console.log("result is", result);
  return result;
  // // Blobとして出力ファイルを作成する
  // const blob = new Blob([data], { type: "audio/wav" });

  // // 例えば、Blobを使用してオーディオをダウンロードまたは表示する
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "output.wav";
  // document.body.appendChild(a);
  // a.click();

  // //   後処理
  // URL.revokeObjectURL(url);
  // document.body.removeChild(a);
}
