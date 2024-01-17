import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const checkIsListenerBlocked = async (): Promise<boolean> => {
  const docData = await getDoc(doc(db, "control", "blockWeb"));
  if (!docData.exists() || docData.data() === undefined) {
    Promise.reject("doc not found");
    return true;
  }
  return docData.data().isListenerBlocked;
};

export const checkIsSpeakerBlocked = async (): Promise<boolean> => {
  const docData = await getDoc(doc(db, "control", "blockWeb"));
  if (!docData.exists() || docData.data() === undefined) {
    Promise.reject("doc not found");
    return true;
  }
  return docData.data().isSpeakerBlocked;
};
