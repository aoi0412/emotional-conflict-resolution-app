"use client";

import useAudioVideo from "@/functions/useAudioVideo";
import useToken from "@/functions/useToken";

const Test = () => {
  const { token } = useToken();
  const { localVideo } = useAudioVideo(token);
  return (
    <div>
      <video ref={localVideo} autoPlay playsInline muted />
    </div>
  );
};

export default Test;
