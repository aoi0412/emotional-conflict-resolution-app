import { db } from "@/firebase";
import {
  DocumentData,
  Timestamp,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const getRoom = async () => {
  const dateFilter = new Date();
  dateFilter.setHours(dateFilter.getHours() - 1);
  console.log(dateFilter.toString());
  const docRef = query(
    collection(db, "rooms"),
    where("createdAt", ">=", Timestamp.fromDate(dateFilter))
  );
  const querySnapshot = await getDocs(docRef);
  let tmpList: {
    roomId: string;
    speaker: string;
    createdAt: Timestamp;
  }[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    let roomId = data.roomId;
    if (roomId === "") {
      roomId = doc.id;
    }
    const tmp: {
      roomId: string;
      speaker: string;
      createdAt: Timestamp;
    } = {
      roomId: roomId,
      speaker: data.speaker,
      createdAt: data.createdAt,
    };
    tmpList.push(tmp);
  });
  return tmpList;
};
