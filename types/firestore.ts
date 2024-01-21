import { FieldValue } from "firebase/firestore";
import { BaseEmotion, FaceEmotion, VoiceEmotion } from "./emotion";

export type RoomData = {
  roomId: string;
  speaker: string;
  listener: string;
};

export type InsertRoomData = {
  roomId: string;
  speaker: string;
  listener: string;
  createdAt: FieldValue;
};

export type RecordData = {
  roomId: string;
  speakerEmotion: BaseEmotion;
  listenerEmotion: BaseEmotion | null;
  faceEmotion: FaceEmotion;
  voiceEmotion: VoiceEmotion;
  time: number;
  isDetected: boolean;
};

export type InsertRecordData = {
  recordId: string;
  roomId: string;
  speakerEmotion: BaseEmotion;
  listenerEmotion: BaseEmotion | null;
  faceEmotion: FaceEmotion;
  voiceEmotion: VoiceEmotion;
  time: number;
  isDetected: boolean;
  createdAt: FieldValue;
};
