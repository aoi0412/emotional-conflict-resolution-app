"use client";

import useAudioVideo from "@/hooks/useAudioVideo";
import useToken from "@/hooks/useToken";
import RoomNameInput from "../util/RoomNameInput";
import EmotionButton from "../util/EmotionButton";
import { useEffect } from "react";

const Test = () => {
  const { token } = useToken();
  const {
    localVideo,
    startAudioRecord,
    stopAudioRecord,
    downloadAudio,
    processAudio,
  } = useAudioVideo(token);

  return (
    <div>
      <RoomNameInput token={token} />
      <button onClick={startAudioRecord}>start</button>
      <button onClick={stopAudioRecord}>stop</button>
      <button onClick={downloadAudio}>download</button>
      <button onClick={processAudio}>process</button>
      <video ref={localVideo} autoPlay playsInline muted />
      <EmotionButton videoRef={localVideo} />
    </div>
  );
};

export default Test;
