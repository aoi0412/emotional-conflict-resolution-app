import { isModelLoadedAtom } from "@/recoil";
import { useRecoilState } from "recoil";
import * as faceapi from "face-api.js";
import path from "path";
import { useEffect } from "react";

const useFaceEmotion = () => {
  useEffect(() => {
    const loadModels = async () => {
      const filePath = path.join(__dirname, "/models");
      console.log("filePath is", filePath);
      await Promise.all([
        faceapi.nets.tinyFaceDetector.load(filePath),
        faceapi.nets.faceExpressionNet.load(filePath),
      ]);
    };
    loadModels();
  }, []);

  const faceDetectHandler = async (video: HTMLVideoElement) => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    console.log(detections);
    return detections;
  };

  return {
    faceDetectHandler,
  };
};

export default useFaceEmotion;
