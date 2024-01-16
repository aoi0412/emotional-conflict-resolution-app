import { faceDetectHandler } from "@/functions/faceEmotion";
import { FC, useEffect } from "react";

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
  useEffect(() => {
    setInterval(() => {
      buttonHandler();
    }, 1000);
  }, []);
  return (
    <div>
      <button onClick={buttonHandler}>感情認識</button>
    </div>
  );
};

export default EmotionButton;
