import { listenAddRecord } from "@/db/listenAddRecord";
import { updateListenerEmotion } from "@/db/updateListenerEmotion";
import { roomDocIdAtom } from "@/recoil";
import { BaseEmotion } from "@/types/emotion";
import { list } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

type Props = {
  roomId: string;
  recordId: string;
};

const useListenAddRecord = () => {
  const [isEmotionButtonDisplay, setIsEmotionButtonDisplay] =
    useState<boolean>(false);
  // const [recordData, setRecordData] = useState<Props | null>(null);
  const recordData = useRef<Props | null>(null);
  const roomId = useRecoilValue(roomDocIdAtom);
  useEffect(() => {
    console.log("useListenAddRecord");
    if (roomId == null) return;
    listenAddRecord(roomId, (doc) => {
      const data = doc.data();
      let recordId = data.recordId;
      if (recordId === "") {
        recordId = doc.id;
      }
      console.log("recordId", recordId);
      if (isEmotionButtonDisplay) {
        updateListenerEmotion({
          selectedEmotion: null,
          roomId: data.roomId,
          recordId: recordId,
        });
      }
      setIsEmotionButtonDisplay(true);
      const tmpRecordData: Props = {
        roomId: data.roomId,
        recordId: recordId,
      };
      // setRecordData(tmpRecordData);
      recordData.current = tmpRecordData;
    });
  }, [roomId]);

  const handleEmotionButton = (emotionType: BaseEmotion) => {
    if (!recordData) return;
    console.log("recordData", recordData);
    if (!recordData.current) return;
    updateListenerEmotion({
      selectedEmotion: emotionType,
      roomId: recordData.current.roomId,
      recordId: recordData.current.recordId,
    })
      .then(() => {
        setIsEmotionButtonDisplay(false);
      })
      .catch((e) => {
        console.error(e);
        alert("エラーが発生しました。もう一度お試しください。");
      });
  };

  return {
    isEmotionButtonDisplay,
    handleEmotionButton,
  };
};

export default useListenAddRecord;
