import { FaceEmotion, VoiceEmotion } from "@/types/emotion";
import { FC } from "react";

type Props = {
  faceEmotion: FaceEmotion | undefined;
  voiceEmotion: VoiceEmotion | undefined;
};

const EmotionDisplay: FC<Props> = ({ faceEmotion, voiceEmotion }) => {
  return (
    <div>
      <h2>表情感情</h2>
      <div>
        <p>angry:{faceEmotion && faceEmotion.angry}</p>
        <p>disgusted: {faceEmotion && faceEmotion.disgusted}</p>
        <p>fearful: {faceEmotion && faceEmotion.fearful}</p>
        <p>happy: {faceEmotion && faceEmotion.happy}</p>
        <p>neutral: {faceEmotion && faceEmotion.neutral}</p>
        <p>sad: {faceEmotion && faceEmotion.sad}</p>
        <p>surprised: {faceEmotion && faceEmotion.surprised}</p>
      </div>
      <h2>音声感情</h2>
      <div>
        <p>anger:{voiceEmotion && voiceEmotion.anger}</p>
        <p>calm:{voiceEmotion && voiceEmotion.calm}</p>
        <p>joy:{voiceEmotion && voiceEmotion.joy}</p>
        <p>sorrow:{voiceEmotion && voiceEmotion.sorrow}</p>
        <p>energy:{voiceEmotion && voiceEmotion.energy}</p>
      </div>
    </div>
  );
};

export default EmotionDisplay;
