"use client";

import useAudioVideo from "@/hooks/useAudioVideo";
import useToken from "@/hooks/useToken";
import RoomNameInput from "../util/RoomNameInput";

const Test = () => {
  const { token } = useToken();
  const { localVideo } = useAudioVideo(token);
  return (
    <div>
      <RoomNameInput token={token} />
      <video ref={localVideo} autoPlay playsInline muted />
    </div>
  );
};

export default Test;
