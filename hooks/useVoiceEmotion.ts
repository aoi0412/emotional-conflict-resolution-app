import { DetectVoiceEmotion } from "@/functions/voiceEmotion";
import { userMediaStreamAtom } from "@/recoil";
import { VoiceEmotion } from "@/types/emotion";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";

const useVoiceEmotion = () => {
  const recordedChunks = useRef<BlobPart[]>([]);
  //   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
  //     null
  //   );
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const tmpVoiceEmotion = useRef<VoiceEmotion | null>(null);
  const [voiceEmotion, setVoiceEmotion] = useState<VoiceEmotion | null>(null);
  const startAudioRecord = async () => {
    try {
      // マイクからの新しい MediaStream を取得
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // MediaRecorder をこの MediaStream で初期化
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      recorder.start();
      console.log("Audio recording started");
      mediaRecorder.current = recorder;
      //   setMediaRecorder(recorder);
    } catch (error) {
      console.error("Audio recording error:", error);
    }
  };
  const stopAudioRecord = () => {
    console.log("stopAudioRecord");
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();

      // MediaRecorder の録音が停止した後に実行されるイベント
      mediaRecorder.current.onstop = async () => {
        // BlobPart[] 型の recordedChunks から Blob を作成
        const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
        console.log("Audio recording stopped");
        const result = await DetectVoiceEmotion(blob)
          .catch((e) => console.error(e))
          .then((result) => {
            return result;
          });
        if (result) {
          console.log("result is", result);
          tmpVoiceEmotion.current = result;
          return result;
        } else {
          console.log("result is null");
          Promise.reject("could not detect voice emotion");
        }

        recordedChunks.current = []; // チャンクをリセット
      };
    }
  };

  const processAudio = async (blob: Blob) => {
    const result = await DetectVoiceEmotion(blob)
      .catch((e) => console.error(e))
      .then((result) => {
        return result;
      });
    if (result) {
      console.log("result is", result);
      return result;
    } else {
      console.log("result is null");
      Promise.reject("could not detect voice emotion");
    }
  };
  return {
    startAudioRecord,
    stopAudioRecord,
    processAudio,
    voiceEmotion,
    tmpVoiceEmotion,
  };
};

export default useVoiceEmotion;
