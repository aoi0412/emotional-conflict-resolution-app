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
  // const setUserVideo = useSetRecoilState(userVideoAtom);
  const [tmpRecordedAudio, setTmpRecordedAudio] = useState<Blob | null>(null);
  useEffect(() => {
    const initialize = async () => {
      if (
        token == null ||
        localVideo.current == null ||
        localAudio.current == null
      )
        return;

      const stream =
        await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
      stream.video.attach(localVideo.current);
      stream.audio.attach(localAudio.current);

      await localVideo.current.play();
      setMediaStream(stream);
    };

    initialize();
  }, [token, localVideo, localAudio]);

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
        recordedChunks.current = []; // チャンクをリセット
      };
    }
  };

  return { localVideo, localAudio };
};

export default useAudioVideo;
