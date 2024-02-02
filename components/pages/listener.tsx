"use client";

import useListenAddRecord from "@/hooks/useListenAddRecord";
import useToken from "@/hooks/useToken";
import { opponentNameAtom, roomDocIdAtom } from "@/recoil";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import RoomNameInput from "../util/RoomNameInput";
import { listenAddRoom } from "@/db/listenAddRoom";
import useAudioVideo from "@/hooks/useAudioVideo";
import { getRoom } from "@/db/getRoom";
import { Timestamp } from "firebase/firestore";
import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import EmotionButton from "../util/EmotionButton";

extend(relativeTime);
dayjs.locale("ja");

const listener = () => {
  useToken();
  // useAudioVideo("listener");
  // const setMemberType = useSetRecoilState(memberTypeAtom);
  // const [roomId, setRoomId] = useRecoilState(roomDocIdAtom);
  // const [roomList, setRoomList] = useState<
  //   {
  //     roomId: string;
  //     speaker: string;
  //     createdAt: Timestamp;
  //   }[]
  // >([]);
  // useEffect(() => {
  //   // setMemberType("listener");
  //   getRoom().then((result) => {
  //     setRoomList([...result]);
  //     listenAddRoom((querySnapshot) => {
  //       const tmpChanges = querySnapshot.docChanges();
  //       if (tmpChanges.length >= 4) return;
  //       tmpChanges.forEach((change) => {
  //         if (change.type === "modified") {
  //           const data = change.doc.data();
  //           let roomId = data.roomId;
  //           if (roomId === "") {
  //             roomId = change.doc.id;
  //           }
  //           let tmpRoomList = [
  //             ...roomList,
  //             {
  //               roomId: roomId,
  //               speaker: data.speaker,
  //               createdAt: data.createdAt,
  //             },
  //           ];
  //           setRoomList(tmpRoomList);
  //         }
  //       });
  //     });
  //   });
  // }, []);
  const { isEmotionButtonDisplay, handleEmotionButton } = useListenAddRecord();
  // const opponentName = useRecoilValue(opponentNameAtom);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        padding: "8px",
      }}
    >
      <RoomNameInput memberType={"listener"} />
      <EmotionButton memberType={"speaker"} />
      {/* {!opponentName &&
        roomList.map((room) => (
          <div key={room.roomId}>
            <button
              onClick={() => setRoomId(room.roomId)}
              style={{
                backgroundColor: roomId === room.roomId ? "red" : "white",
              }}
            >
              {room.speaker}のルーム:
              {dayjs(room.createdAt.toDate()).fromNow()}
              に作成
            </button>
          </div>
        ))} */}

      {/* {isEmotionButtonDisplay && (
        <div>
          <p
            style={{
              margin: 0,
              padding: "0 12px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            相手の発話感情に該当するボタンを選択してください。
          </p>
          <div
            style={{
              width: "300px",
              display: "flex",
              margin: "12px",
              gap: "12px",
            }}
          >
            <button
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
              onClick={() => handleEmotionButton("angry")}
            >
              怒り
            </button>
            <button
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
              onClick={() => handleEmotionButton("happy")}
            >
              喜び
            </button>
            <button
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
              onClick={() => handleEmotionButton("sad")}
            >
              悲しみ
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default listener;
