import { db } from "@/firebase";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";

export const listenAddRecord = async (
  roomId: string,
  onAdd: (data: DocumentData) => void
) => {
  const q = collection(db, "rooms", roomId, "records");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        onAdd(change.doc);
        console.log("New record: ", change.doc.data());
        console.log(change);
      }
    });
  });
  return unsubscribe;
};
