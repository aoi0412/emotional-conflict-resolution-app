import { db } from "@/firebase";
import {
  DocumentData,
  QuerySnapshot,
  collection,
  onSnapshot,
} from "firebase/firestore";

export const listenAddRoom = async (
  onAdd: (data: QuerySnapshot<DocumentData, DocumentData>) => void
) => {
  const q = collection(db, "rooms");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    onAdd(querySnapshot);
  });
  return unsubscribe;
};
