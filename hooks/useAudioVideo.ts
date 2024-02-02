import { loadModels } from "@/functions/faceEmotion";
import { DetectVoiceEmotion } from "@/functions/voiceEmotion";
import { currentTimeAtom, roomTokenAtom, userMediaStreamAtom } from "@/recoil";
import { SkyWayStreamFactory } from "@skyway-sdk/room";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const useAudioVideo = (memberType: "listener" | "speaker" | null) => {
  const token = useRecoilValue(roomTokenAtom);
  const localVideo = useRef<HTMLVideoElement>(null);
  const localAudio = useRef<HTMLAudioElement>(null);
  const recordedChunks = useRef<BlobPart[]>([]);
  const [userMediaStream, setMediaStream] = useRecoilState(userMediaStreamAtom);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  // const memberType = useRecoilValue(memberTypeAtom);
  const [currentTime, setCurrentTime] = useRecoilState(currentTimeAtom);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const initialize = async () => {
      if (token == null || localVideo.current == null) {
        console.log("token or localVideo is null");
        return;
      }
      const stream =
        await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();

      stream.video.attach(localVideo.current);
      await localVideo.current.play();
      setMediaStream(stream);
      if (memberType === "speaker") {
        await loadModels();
      } else if (memberType === "listener") {
        // if (token === null) {
        //   console.log("token is null");
        //   return;
        // }
        // const stream =
        //   await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
        // setMediaStream(stream);
      } else {
        console.log("memberType is null");
        return;
      }
      console.log("create stream");
    };

    initialize();
  }, [token, localVideo]);

  const startVideoRecord = async () => {
    try {
      // マイクからの新しい MediaStream を取得
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      // MediaRecorder をこの MediaStream で初期化
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      recorder.start();
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
      setIsVideoRecording(true);
      console.log("Audio recording started");
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Audio recording error:", error);
    }
  };
  const stopVideoRecord = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsVideoRecording(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // MediaRecorder の録音が停止した後に実行されるイベント
      mediaRecorder.onstop = () => {
        // BlobPart[] 型の recordedChunks から Blob を作成
        const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
        // DetectVoiceEmotion(blob).catch((e) => console.error(e));
        // setTmpRecordedAudio(blob); // Blob をステートに保存
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = "video.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        console.log("Audio recording stopped");
        recordedChunks.current = []; // チャンクをリセット
      };
    }
  };

  return {
    localVideo,
    localAudio,
    startVideoRecord,
    stopVideoRecord,
    isVideoRecording,
  };
};

export default useAudioVideo;
