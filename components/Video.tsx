import useAudioVideo from "@/functions/useAudioVideo";
import dynamic from "next/dynamic";
import { FC } from "react";

type Props = {
  token: string | null;
};
const Video: FC<Props> = ({ token }) => {
  const { localVideo } = useAudioVideo(token);
  return <video ref={localVideo} autoPlay playsInline muted />;
};

export default Video;
