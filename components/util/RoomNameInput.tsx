import { FC, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SkyWayContext, SkyWayRoom } from "@skyway-sdk/room";
import useRoom from "@/hooks/useRoom";
import {
  memberTypeAtom,
  opponentNameAtom,
  roomDocIdAtom,
  userNameAtom,
} from "@/recoil";

const RoomNameInput: FC = () => {
  const [myName, setMyName] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const { joinInRoom, targetElement } = useRoom();
  // const memberType = useRecoilValue(memberTypeAtom);
  const roomId = useRecoilValue(roomDocIdAtom);
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
        <div>
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
            ルームを作成
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
        ref={targetElement}
      ></div>
    </div>
  );
};

export default RoomNameInput;
