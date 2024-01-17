import * as faceapi from "face-api.js";
export type VoiceEmotion = {
  error: number;
  calm: number;
  anger: number;
  joy: number;
  sorrow: number;
  energy: number;
};

export type FaceEmotion = {
  angry: number;
  disgust: number;
  fear: number;
  happy: number;
  sad: number;
  surprise: number;
  neutral: number;
};
// export type FaceEmotion = faceapi.FaceExpressions;

// 喜び、悲しみ、怒り、恐れ
export type BaseEmotion = "happy" | "sad" | "angry";
