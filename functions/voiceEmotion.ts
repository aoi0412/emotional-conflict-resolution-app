import axios from "axios";

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
  const res = await axios.post(
    "https://api.webempath.net/v2/analyzeWav",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};
