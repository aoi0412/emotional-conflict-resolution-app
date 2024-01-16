import { userAudioAtom, userVideoAtom } from "@/recoil";
import {
  LocalAudioStream,
  LocalVideoStream,
  SkyWayStreamFactory,
} from "@skyway-sdk/room";
import { get } from "http";
import { use, useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

const useAudioVideo = (token: string | null) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const setUserAudio = useSetRecoilState(userAudioAtom);
  const setUserVideo = useSetRecoilState(userVideoAtom);

  useEffect(() => {
    const initialize = async () => {
      if (token == null || localVideo.current == null) return;

      const stream =
        await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
      stream.video.attach(localVideo.current);

      await localVideo.current.play();
      setUserAudio(stream.audio);
      setUserVideo(stream.video);
    };

    initialize();
  }, [token, localVideo]);
  return { localVideo };
};

export default useAudioVideo;
