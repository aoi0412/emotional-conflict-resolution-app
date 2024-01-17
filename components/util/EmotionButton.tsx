import { faceDetectHandler } from "@/functions/faceEmotion";
import useAudioVideo from "@/hooks/useAudioVideo";
import useEmotionDetect from "@/hooks/useEmotionDetect";
import { FC, useEffect, useState } from "react";
import EmotionDisplay from "./EmotionButton/EmotionDisplay";
import { BaseEmotion } from "@/types/emotion";
import { useRecoilValue } from "recoil";
import { currentTimeAtom } from "@/recoil";

const EmotionButton: FC = () => {
  const { localVideo, startVideoRecord, stopVideoRecord, isVideoRecording } =
    useAudioVideo();
  const { startRecord, stopRecord, emotionData, isRecording } =
    useEmotionDetect(localVideo);
  // const [selectedEmotionPref, setSelectedEmotionPref] =
  //   useState<BaseEmotion>("happy");
  const [selectedEmotion, setSelectedEmotion] = useState<BaseEmotion | null>(
    null
  );
  const emotionHandler = (tmpSelectedEmotion: BaseEmotion) => {
    // if (isRecording) {
    //   stopRecord(selectedEmotionPref);
    // }
    // setSelectedEmotionPref(selectedEmotion);
    startRecord(tmpSelectedEmotion);
    setSelectedEmotion(tmpSelectedEmotion);
  };
  const stopButtonHandler = () => {
    if (!selectedEmotion) {
      console.log("selectedEmotion is null");
      return;
    }
    stopRecord(selectedEmotion);
    setSelectedEmotion(null);
  };
  const currentTime = useRecoilValue(currentTimeAtom);
  return (
    <div>
      <video
        style={{
          opacity: 0,
          position: "absolute",
        }}
        ref={localVideo}
        autoPlay
        playsInline
        muted
      />
      <div>
        <p>感情データ</p>
        <EmotionDisplay
          faceEmotion={emotionData && emotionData.faceEmotion}
          voiceEmotion={emotionData && emotionData.voiceEmotion}
        />
      </div>

      {selectedEmotion === null ? (
        <div>
          <button onClick={() => emotionHandler("angry")}>怒り</button>
          <button onClick={() => emotionHandler("happy")}>喜び</button>
          <button onClick={() => emotionHandler("sad")}>悲しみ</button>
        </div>
      ) : (
        <button onClick={stopButtonHandler}>stop</button>
      )}

      {isVideoRecording ? (
        <div>
          <button onClick={() => stopVideoRecord()}>stop</button>
          <p>{currentTime}</p>
        </div>
      ) : (
        <button onClick={() => startVideoRecord()}>start</button>
      )}
    </div>
  );
};

export default EmotionButton;
