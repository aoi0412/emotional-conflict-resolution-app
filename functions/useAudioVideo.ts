import {
  LocalAudioStream,
  LocalVideoStream,
  SkyWayStreamFactory,
} from "@skyway-sdk/room";
import { get } from "http";
import { use, useEffect, useRef, useState } from "react";

const useAudioVideo = (token: string | null) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<{
    audio: LocalAudioStream;
    video: LocalVideoStream;
  } | null>(null);
  useEffect(() => {
    const initialize = async () => {
      if (token == null || localVideo.current == null) return;

      const stream =
        await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
      stream.video.attach(localVideo.current);

      await localVideo.current.play();
      setLocalStream(stream);
    };

    initialize();
  }, [token, localVideo]);
  return { localVideo };
};

export default useAudioVideo;
