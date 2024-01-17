import { db } from "@/firebase";
import { InsertRoomData, RoomData } from "@/types/firestore";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export const createRoom = async (speakerName: string) => {
  const insertData: InsertRoomData = {
    roomId: "",
    speaker: speakerName,
    listener: "",
    createdAt: serverTimestamp(),
  };
  return addDoc(collection(db, "rooms"), insertData).then((result) => {
    const tmpDocId = result.id;
    updateDoc(doc(db, "rooms", tmpDocId), { roomId: tmpDocId });
    return tmpDocId;
  });
};
