"use client";

import { getRoom } from "@/db/getRoom";
import { listenAddRecord } from "@/db/listenAddRecord";
import { listenAddRoom } from "@/db/listenAddRoom";
import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { DocumentData, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { RecordData } from "@/types/firestore";

extend(relativeTime);
dayjs.locale("ja");

const observer = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomList, setRoomList] = useState<
    {
      roomId: string;
      speaker: string;
      createdAt: Timestamp;
    }[]
  >([]);
  const [recordList, setRecordList] = useState<RecordData[]>([]);
  useEffect(() => {
    getRoom().then((tmpRoomList) => {
      setRoomList([...tmpRoomList]);
      listenAddRoom((querySnapshot) => {
        const tmpChanges = querySnapshot.docChanges();
        if (tmpChanges.length >= 4) return;
        tmpChanges.forEach((change) => {
          if (change.type === "modified") {
            const data = change.doc.data();
            let roomId = data.roomId;
            if (roomId === "") {
              roomId = change.doc.id;
            }
            let tmpRoomList = [
              ...roomList,
              {
                roomId: roomId,
                speaker: data.speaker,
                createdAt: data.createdAt,
              },
            ];
            setRoomList(tmpRoomList);
          }
        });
      });
    });
  }, []);
  useEffect(() => {
    if (selectedRoomId)
      listenAddRecord(selectedRoomId, (recordData) => {
        let tmpRecordList = [...recordList];
        tmpRecordList.push(recordData);
      });
  }, [selectedRoomId]);
  return (
    <div>
      {selectedRoomId ? (
        <div>
          <div>
            {recordList.map((record) => (
              <div key={record.time}>
                speaker:{record.speakerEmotion}
                listener:{record.listenerEmotion}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setSelectedRoomId(null);
            }}
          >
            キャンセル
          </button>
        </div>
      ) : (
        roomList.map((room, index) => (
          <div key={room.roomId + index}>
            <button
              onClick={() => {
                setSelectedRoomId(room.roomId);
              }}
            >
              {room.speaker}: {dayjs(room.createdAt.toDate()).fromNow()}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default observer;
