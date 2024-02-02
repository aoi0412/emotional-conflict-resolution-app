import { faceDetectHandler } from "@/functions/faceEmotion";
import useAudioVideo from "@/hooks/useAudioVideo";
import useEmotionDetect from "@/hooks/useEmotionDetect";
import { FC, useEffect, useState } from "react";
import EmotionDisplay from "./EmotionButton/EmotionDisplay";
import { BaseEmotion } from "@/types/emotion";
import { useRecoilValue } from "recoil";
import { currentTimeAtom, opponentNameAtom } from "@/recoil";

const EmotionButton: FC<{
  memberType: "speaker" | "listener" | null;
}> = ({ memberType }) => {
  const { localVideo, startVideoRecord, stopVideoRecord, isVideoRecording } =
    useAudioVideo(memberType);
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
  const opponentName = useRecoilValue(opponentNameAtom);
  const currentTime = useRecoilValue(currentTimeAtom);
  return (
    <div
      style={{
        height: "100%",
        width: "300px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <div>
        <p>感情データ</p>
        <EmotionDisplay
          faceEmotion={emotionData && emotionData.faceEmotion}
          voiceEmotion={emotionData && emotionData.voiceEmotion}
        />
      </div> */}
      {opponentName && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                padding: "0 12px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              発話の感情を選択してから発話を行なってください。
            </p>
            <div
              style={{
                padding: "12px 0",
              }}
            >
              {selectedEmotion === null ? (
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "space-around",
                    display: "flex",
                  }}
                >
                  <button
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                    onClick={() => emotionHandler("angry")}
                  >
                    怒り
                  </button>
                  <button
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                    onClick={() => emotionHandler("happy")}
                  >
                    喜び
                  </button>
                  <button
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                    onClick={() => emotionHandler("sad")}
                  >
                    悲しみ
                  </button>
                </div>
              ) : (
                <button
                  style={{
                    width: "100px",
                    height: "40px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                  onClick={stopButtonHandler}
                >
                  発話終了
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isVideoRecording ? (
              <button
                style={{
                  width: "200px",
                  height: "52px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  border: "none",
                }}
                onClick={() => stopVideoRecord()}
              >
                録画終了(経過時刻：{currentTime}s)
              </button>
            ) : (
              <button
                style={{
                  width: "200px",
                  height: "52px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  border: "none",
                }}
                onClick={() => startVideoRecord()}
              >
                録画開始
              </button>
            )}
          </div>
        </div>
      )}
      <video
        style={{
          opacity: 0,
          position: "absolute",
          height: "100px",
        }}
        ref={localVideo}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default EmotionButton;
