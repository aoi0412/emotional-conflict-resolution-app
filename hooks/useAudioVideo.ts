import { loadModels } from "@/functions/faceEmotion";
import { convertAudio } from "@/functions/voiceEmotion";
import { userMediaStreamAtom } from "@/recoil";
import {
  LocalAudioStream,
  LocalVideoStream,
  SkyWayStreamFactory,
} from "@skyway-sdk/room";
import { get } from "http";
import { use, useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

const useAudioVideo = (token: string | null) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const localAudio = useRef<HTMLAudioElement>(null);
  const recordedChunks = useRef<BlobPart[]>([]);
  const [userMediaStream, setMediaStream] = useRecoilState(userMediaStreamAtom);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [tmpRecordedAudio, setTmpRecordedAudio] = useState<Blob | null>(null);
  useEffect(() => {
    const initialize = async () => {
      if (token == null || localVideo.current == null) {
        return;
      }

      const stream =
        await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();

      stream.video.attach(localVideo.current);
      // stream.audio.attach(localAudio.current);
      await localVideo.current.play();
      setMediaStream(stream);
      await loadModels();
    };

    initialize();
  }, [token, localVideo]);

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
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Audio recording error:", error);
    }
  };
  const stopAudioRecord = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();

      // MediaRecorder の録音が停止した後に実行されるイベント
      mediaRecorder.onstop = () => {
        // BlobPart[] 型の recordedChunks から Blob を作成
        const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
        setTmpRecordedAudio(blob); // Blob をステートに保存
        console.log("Audio recording stopped");
        recordedChunks.current = []; // チャンクをリセット
      };
    }
  };

  const downloadAudio = () => {
    if (tmpRecordedAudio) {
      const url = URL.createObjectURL(tmpRecordedAudio);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "audio.webm";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const processAudio = () => {
    if (!tmpRecordedAudio) return;
    convertAudio(tmpRecordedAudio).catch((e) => console.error(e));
  };

  return {
    localVideo,
    localAudio,
    startAudioRecord,
    stopAudioRecord,
    downloadAudio,
    processAudio,
  };
};

export default useAudioVideo;
