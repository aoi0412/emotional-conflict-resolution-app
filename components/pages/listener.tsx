"use client";

import useListenAddRecord from "@/hooks/useListenAddRecord";
import useToken from "@/hooks/useToken";
import { memberTypeAtom, roomDocIdAtom } from "@/recoil";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import RoomNameInput from "../util/RoomNameInput";
import { listenAddRoom } from "@/db/listenAddRoom";
import useAudioVideo from "@/hooks/useAudioVideo";

const listener = () => {
  useToken();
  useAudioVideo();
  const setMemberType = useSetRecoilState(memberTypeAtom);
  const [roomId, setRoomId] = useRecoilState(roomDocIdAtom);
  const [roomList, setRoomList] = useState<
    {
      roomId: string;
      speaker: string;
    }[]
  >([]);
  useEffect(() => {
    setMemberType("listener");
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
            { roomId: roomId, speaker: data.speaker },
          ];
          setRoomList(tmpRoomList);
        }
      });
    });
  }, []);
  const { isEmotionButtonDisplay, handleEmotionButton } = useListenAddRecord();

  return (
    <div>
      <RoomNameInput />
      {roomList.map((room) => (
        <div key={room.roomId}>
          <button
            onClick={() => setRoomId(room.roomId)}
            style={{
              backgroundColor: roomId === room.roomId ? "red" : "white",
            }}
          >
            {room.speaker}のルーム
          </button>
        </div>
      ))}
      {isEmotionButtonDisplay && (
        <div>
          <button onClick={() => handleEmotionButton("angry")}>怒り</button>
          <button onClick={() => handleEmotionButton("happy")}>喜び</button>
          <button onClick={() => handleEmotionButton("sad")}>悲しみ</button>
        </div>
      )}
    </div>
  );
};

export default listener;
