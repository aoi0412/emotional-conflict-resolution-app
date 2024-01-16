import { faceDetectHandler } from "@/functions/faceEmotion";
import { FC } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const EmotionButton: FC<Props> = ({ videoRef }) => {
  const buttonHandler = () => {
    if (videoRef.current) {
      faceDetectHandler(videoRef.current);
    } else {
      console.log("videoRef is null");
    }
  };
  return (
    <div>
      <button onClick={buttonHandler}>感情認識</button>
    </div>
  );
};

export default EmotionButton;
