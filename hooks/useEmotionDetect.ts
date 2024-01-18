import { BaseEmotion, FaceEmotion, VoiceEmotion } from "@/types/emotion";
import * as faceapi from "face-api.js";
import { RefObject, useRef, useState } from "react";
import { faceDetectHandler } from "@/functions/faceEmotion";
import useVoiceEmotion from "./useVoiceEmotion";
import { addRecord } from "@/db/addRecord";
import { useRecoilValue } from "recoil";
import { currentTimeAtom, roomDocIdAtom, userNameAtom } from "@/recoil";

const useEmotionDetect = (video: RefObject<HTMLVideoElement>) => {
  // 画面提示用
  const [emotionData, setEmotionData] = useState<{
    faceEmotion: FaceEmotion;
    voiceEmotion: VoiceEmotion;
  }>();
  const { startAudioRecord, stopAudioRecord, voiceEmotion, tmpVoiceEmotion } =
    useVoiceEmotion();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tmpFaceEmotion = useRef<faceapi.FaceExpressions[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const userName = useRecoilValue(userNameAtom);
  const roomId = useRecoilValue(roomDocIdAtom);
  const currentTime = useRecoilValue(currentTimeAtom);

  const startRecord = (selectedEmotion: BaseEmotion) => {
    if (isRecording) {
      alert("already recording");
      return;
    }
    if (userName == null) {
      alert("userName is null");
      return;
    }
    if (roomId == null) {
      alert("roomId is null");
      return;
    }
    setIsRecording(true);
    let recordCount = 1;
    console.log("startRecord");
    startAudioRecord().then(() => {
      console.log("startsetInterval");
      intervalRef.current = setInterval(() => {
        // 顔の感情を取得
        if (intervalRef.current == null) {
          alert("interval is null");
          return;
        }
        if (video.current == null) {
          clearInterval(intervalRef.current);
          alert("video is null");
          return;
        }
        faceDetectHandler(video.current).then((faceEmotion) => {
          let tmp = tmpFaceEmotion.current;
          if (tmp == null) {
            tmp = [];
          }
          tmpFaceEmotion.current?.push(faceEmotion);
        });
        if (recordCount >= 4) {
          // 録音を停止&感情を取得
          stopAudioRecord();
          console.log("tmpVoiceEmotion is", tmpVoiceEmotion.current);
          console.log("tmpFaceEmotion is", tmpFaceEmotion.current);
          console.log(tmpFaceEmotion.current && tmpVoiceEmotion.current);
          if (tmpFaceEmotion.current && tmpVoiceEmotion.current) {
            const voiceEmotion = tmpVoiceEmotion.current;
            // const faceEmotion = tmpFaceEmotion.current[0];
            // FaceEmotionの平均を取る
            let tmp: FaceEmotion = {
              angry: 0,
              disgusted: 0,
              fearful: 0,
              happy: 0,
              sad: 0,
              surprised: 0,
              neutral: 0,
            };
            tmpFaceEmotion.current.forEach((faceEmotion) => {
              tmp.angry += faceEmotion.angry;
              tmp.disgusted += faceEmotion.disgusted;
              tmp.fearful += faceEmotion.fearful;
              tmp.happy += faceEmotion.happy;
              tmp.sad += faceEmotion.sad;
              tmp.surprised += faceEmotion.surprised;
              tmp.neutral += faceEmotion.neutral;
            });
            tmp.angry /= tmpFaceEmotion.current.length;
            tmp.disgusted /= tmpFaceEmotion.current.length;
            tmp.fearful /= tmpFaceEmotion.current.length;
            tmp.happy /= tmpFaceEmotion.current.length;
            tmp.sad /= tmpFaceEmotion.current.length;
            tmp.surprised /= tmpFaceEmotion.current.length;
            tmp.neutral /= tmpFaceEmotion.current.length;

            //   emotionData.current = { faceEmotion, voiceEmotion };
            setEmotionData((_) => {
              // const tmpFaceEmotion: FaceEmotion = {
              //   angry: faceEmotion.angry,
              //   disgust: faceEmotion.disgusted,
              //   fear: faceEmotion.fearful,
              //   happy: faceEmotion.happy,
              //   sad: faceEmotion.sad,
              //   surprise: faceEmotion.surprised,
              //   neutral: faceEmotion.neutral,
              // };

              addRecord({
                faceEmotion: tmp,
                voiceEmotion: voiceEmotion,
                speakerEmotion: selectedEmotion,
                roomId: roomId,
                listenerEmotion: null,
                time: currentTime,
              }).catch((e) => console.error(e));
              return { faceEmotion: tmp, voiceEmotion };
            });
            console.log(
              `voiceEmotion is ${voiceEmotion}, faceEmotion is ${tmp}`
            );
          }
          tmpFaceEmotion.current = [];
          // firebaseに保存
          // 画面提示
          // 聞き手に提示
          recordCount = 1;
        } else {
          recordCount++;
        }
      }, 1000);
    });
  };
  const stopRecord = (selectedEmotion: BaseEmotion) => {
    if (!isRecording) {
      alert("not recording");
      return;
    }
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      // 録音を停止&感情を取得
      stopAudioRecord();
      console.log("tmpVoiceEmotion is", tmpVoiceEmotion.current);
      console.log("tmpFaceEmotion is", tmpFaceEmotion.current);
      console.log(tmpFaceEmotion.current && tmpVoiceEmotion.current);
      if (tmpFaceEmotion.current && tmpVoiceEmotion.current) {
        const voiceEmotion = tmpVoiceEmotion.current;
        const faceEmotion = tmpFaceEmotion.current[0];
        //   emotionData.current = { faceEmotion, voiceEmotion };
        setEmotionData((_) => {
          const tmpFaceEmotion: FaceEmotion = {
            angry: faceEmotion.angry,
            disgusted: faceEmotion.disgusted,
            fearful: faceEmotion.fearful,
            happy: faceEmotion.happy,
            sad: faceEmotion.sad,
            surprised: faceEmotion.surprised,
            neutral: faceEmotion.neutral,
          };
          if (roomId == null) {
            alert("roomId is null");
            return { faceEmotion: tmpFaceEmotion, voiceEmotion };
          }
          addRecord({
            faceEmotion: tmpFaceEmotion,
            voiceEmotion: voiceEmotion,
            speakerEmotion: selectedEmotion,
            roomId: roomId,
            listenerEmotion: null,
            time: currentTime,
          }).catch((e) => console.error(e));
          return { faceEmotion: tmpFaceEmotion, voiceEmotion };
        });
        console.log(
          `voiceEmotion is ${voiceEmotion}, faceEmotion is ${faceEmotion}`
        );
      }
      tmpFaceEmotion.current = [];
      // 画面提示
      // 聞き手に提示
    } else {
      alert("interval is null");
    }
    intervalRef.current = null;
  };
  return {
    startRecord,
    stopRecord,
    emotionData,
    isRecording,
  };
};

export default useEmotionDetect;
