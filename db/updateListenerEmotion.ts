import { db } from "@/firebase";
import { BaseEmotion } from "@/types/emotion";
import { doc, updateDoc } from "firebase/firestore";

type Props = {
  selectedEmotion: BaseEmotion | null;
  roomId: string;
  recordId: string;
};

export const updateListenerEmotion = async (props: Props) => {
  updateDoc(doc(db, "rooms", props.roomId, "records", props.recordId), {
    listenerEmotion: props.selectedEmotion,
  }).catch((e) => {
    console.error(e);
    Promise.reject(e);
  });
};
