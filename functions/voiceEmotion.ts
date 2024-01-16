import axios from "axios";
import { fetchFile } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";

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
  //   const res = await axios.post(
  //     "https://api.webempath.net/v2/analyzeWav",
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //   console.log("res is", res.data);
  // const result = res.data;
  const result = {
    error: 0,
    calm: 14,
    anger: 0,
    joy: 18,
    sorrow: 17,
    energy: 1,
  };
  return result;
};

export async function convertAudio(inputBlob: Blob): Promise<void> {
  // BlobからArrayBufferを取得
  const arrayBuffer = await inputBlob.arrayBuffer();

  // ArrayBufferをFFmpegが扱える形式に変換
  const uint8Array = new Uint8Array(arrayBuffer);
  const ffmpeg = new FFmpeg();
  try {
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

    const result = voiceEmotion(outputFile);
    console.log("result is", result);
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
  } catch (e) {
    console.error(e);
  }
}
