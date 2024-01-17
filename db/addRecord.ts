import { db } from "@/firebase";
import { BaseEmotion, FaceEmotion, VoiceEmotion } from "@/types/emotion";
import { InsertRecordData, RecordData } from "@/types/firestore";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export const addRecord = async (props: RecordData) => {
  const insertData: InsertRecordData = {
    recordId: "",
    roomId: props.roomId,
    speaker: props.speaker,
    listener: "",
    speakerEmotion: props.speakerEmotion,
    listenerEmotion: null,
    faceEmotion: props.faceEmotion,
    voiceEmotion: props.voiceEmotion,
    time: props.time,
    createdAt: serverTimestamp(),
  };
  addDoc(collection(db, "rooms", props.roomId, "records"), insertData)
    .then((result) => {
      const tmpDocId = result.id;
      updateDoc(doc(db, "rooms", props.roomId, "records", tmpDocId), {
        recordId: tmpDocId,
      });
    })
    .catch((e) => {
      console.error(e);
      Promise.reject(e);
    });
};
