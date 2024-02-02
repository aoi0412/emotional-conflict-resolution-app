import { FC, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SkyWayContext, SkyWayRoom } from "@skyway-sdk/room";
import useRoom from "@/hooks/useRoom";
import { opponentNameAtom, roomDocIdAtom, userNameAtom } from "@/recoil";
import Image from "next/image";
import { getRoom } from "@/db/getRoom";
import { Timestamp } from "firebase/firestore";
import { listenAddRoom } from "@/db/listenAddRoom";
import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

extend(relativeTime);
dayjs.locale("ja");

const RoomNameInput: FC<{ memberType: "speaker" | "listener" | null }> = ({
  memberType,
}) => {
  const [myName, setMyName] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);
  const { joinInRoom, opponentName, audioElement, videoElement } =
    useRoom(memberType);
  const roomId = useRecoilValue(roomDocIdAtom);
  const [selectedRoomName, setSelectedRoomName] = useState<string>("");
  const [listenerSelectRoomId, setListenerSelectRoomId] =
    useRecoilState(roomDocIdAtom);
  const [roomList, setRoomList] = useState<
    {
      roomId: string;
      speaker: string;
      createdAt: Timestamp;
    }[]
  >([]);
  useEffect(() => {
    if (memberType === "listener") {
      getRoom().then((result) => {
        setRoomList([...result]);
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
    }
  }, []);
  const buttonHandler = () => {
    joinInRoom(myName).then((result) => {
      if (!result) return;
      setIsJoined(true);
    });
  };
  const userName = useRecoilValue(userNameAtom);
  return (
    <div
      style={{
        flexGrow: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          backgroundColor: "#D9D9D9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <h1>{opponentName ? opponentName : "nashi"}</h1>
        {opponentName && (
          <div>
            {videoElement.current ? (
              <video
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "black",
                }}
                ref={videoElement}
              ></video>
            ) : (
              <Image
                src="/images/user.png"
                width={300}
                height={300}
                alt="user"
              />
            )}
            <p
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                margin: 0,
                fontSize: "24px",
              }}
            >
              相手の名前：{opponentName}
            </p>
          </div>
        )}
      </div>
      <div
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isJoined ? (
          <div>
            <p>自分の名前：{userName}</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {memberType === "listener" && (
              <div>
                <button
                  onClick={() => {
                    setIsToggleOpen(!isToggleOpen);
                  }}
                >
                  {listenerSelectRoomId
                    ? selectedRoomName
                    : "ルームを選択してください"}
                </button>
                {isToggleOpen &&
                  roomList.map((room) => (
                    <div key={room.roomId}>
                      <button
                        onClick={() => {
                          setSelectedRoomName(
                            room.speaker +
                              "のルーム" +
                              dayjs(room.createdAt.toDate()).fromNow() +
                              "に作成"
                          );
                          setListenerSelectRoomId(room.roomId);
                          setIsToggleOpen(false);
                        }}
                        style={{
                          backgroundColor:
                            roomId === room.roomId ? "red" : "white",
                        }}
                      >
                        {room.speaker}のルーム:
                        {dayjs(room.createdAt.toDate()).fromNow()}
                        に作成
                      </button>
                    </div>
                  ))}
              </div>
            )}
            <input
              type="text"
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                borderRadius: "12px",
                margin: "0 10px",
                padding: "0 10px",
                height: "40px",
                width: "200px",
                borderColor: "#D9D9D9",
              }}
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              placeholder="名前を入力してください"
            />
            <button
              style={{
                border: "none",
                width: "120px",
                height: "40px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
              onClick={buttonHandler}
            >
              ルームに入室する
            </button>
          </div>
        )}
        <div
          style={{
            height: "60px",
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <audio ref={audioElement} />
        </div>
      </div>
    </div>
  );
};

export default RoomNameInput;
