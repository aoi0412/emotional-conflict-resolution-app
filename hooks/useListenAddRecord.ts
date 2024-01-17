import { listenAddRecord } from "@/db/listenAddRecord";
import { updateListenerEmotion } from "@/db/updateListenerEmotion";
import { BaseEmotion } from "@/types/emotion";
import { list } from "firebase/storage";
import { useEffect, useState } from "react";

type Props = {
  roomId: string;
  recordId: string;
};

const useListenAddRecord = () => {
  const [isEmotionButtonDisplay, setIsEmotionButtonDisplay] =
    useState<boolean>(false);
  const [recordData, setRecordData] = useState<Props | null>(null);
  useEffect(() => {
    console.log("useListenAddRecord");
    listenAddRecord("testRoomId", (data) => {
      if (isEmotionButtonDisplay) {
        updateListenerEmotion({
          selectedEmotion: null,
          roomId: data.roomId,
          recordId: data.recordId,
        });
      }
      setIsEmotionButtonDisplay(true);
      const tmpRecordData: Props = {
        roomId: data.roomId,
        recordId: data.recordId,
      };
      setRecordData(tmpRecordData);
    });
  }, []);

  const handleEmotionButton = (emotionType: BaseEmotion) => {
    if (!recordData) return;
    updateListenerEmotion({
      selectedEmotion: emotionType,
      roomId: recordData.roomId,
      recordId: recordData.recordId,
    }).then(() => {
      setIsEmotionButtonDisplay(false);
    });
  };

  return {
    isEmotionButtonDisplay,
    handleEmotionButton,
  };
};

export default useListenAddRecord;
