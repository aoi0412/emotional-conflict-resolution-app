import * as faceapi from "face-api.js";
import path from "path";
// face-api.jsを使う
export const loadModels = async () => {
  const filePath = path.join(__dirname, "/models");
  await Promise.all([
    faceapi.nets.tinyFaceDetector.load(filePath),
    faceapi.nets.faceExpressionNet.load(filePath),
  ]);
};

export const faceDetectHandler = async (video: HTMLVideoElement) => {
  await loadModels();
  const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();
  console.log(detections[0].expressions.angry);
  return detections;
};
