import { db } from "@/firebase";
import { RecordData } from "@/types/firestore";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";

export const listenAddRecord = async (
  roomId: string,
  onAdd: (data: RecordData) => void
) => {
  const q = collection(db, "rooms", roomId, "records");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        const tmp: RecordData = {
          roomId: roomId,
          speakerEmotion: data.speakerEmotion,
          listenerEmotion: data.listenerEmotion,
          faceEmotion: data.faceEmotion,
          voiceEmotion: data.voiceEmotion,
          time: data.time,
        };
        onAdd(tmp);
        console.log("New record: ", change.doc.data());
        console.log(change);
      }
    });
  });
  return unsubscribe;
};
