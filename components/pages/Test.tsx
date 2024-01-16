"use client";

import useAudioVideo from "@/hooks/useAudioVideo";
import useToken from "@/hooks/useToken";
import RoomNameInput from "../util/RoomNameInput";
import EmotionButton from "../util/EmotionButton";
import { useEffect } from "react";

const Test = () => {
  const { token } = useToken();
  const { localVideo, localAudio } = useAudioVideo(token);
  return (
    <div>
      <RoomNameInput token={token} />
      <video ref={localVideo} autoPlay playsInline muted />
      <EmotionButton videoRef={localVideo} />
    </div>
  );
};

export default Test;
