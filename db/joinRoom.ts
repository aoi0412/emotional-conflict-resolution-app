import { db } from "@/firebase";
import { InsertRoomData, RoomData } from "@/types/firestore";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export const joinRoom = async (listenerName: string, roomId: string) => {
  const result = await updateDoc(doc(db, "rooms", roomId), {
    listener: listenerName,
  }).catch((e) => {
    console.error(e);
    Promise.reject(e);
  });
  return roomId;
};
