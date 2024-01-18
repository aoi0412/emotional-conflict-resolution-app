import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const checkIsEmpathEnable = async (): Promise<boolean> => {
  const docData = await getDoc(doc(db, "control", "blockEmpathAPI"));
  if (!docData.exists() || docData.data() === undefined) {
    Promise.reject("doc not found");
    return true;
  }
  return docData.data().isEnable;
};
