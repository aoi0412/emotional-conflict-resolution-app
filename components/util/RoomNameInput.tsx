import { FC, useState } from "react";
import { useSetRecoilState } from "recoil";
import { SkyWayContext, SkyWayRoom } from "@skyway-sdk/room";
import useRoom from "@/hooks/useRoom";

type Props = {
  token: string | null;
};

const RoomNameInput: FC<Props> = ({ token }) => {
  const [roomName, setRoomName] = useState<string>("");
  const [myName, setMyName] = useState<string>("");
  const { joinInRoom, targetElement } = useRoom(token);

  const buttonHandler = () => {
    joinInRoom(roomName, myName);
  };
  return (
    <div>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="ルーム名を入力してください"
      />
      <input
        type="text"
        value={myName}
        onChange={(e) => setMyName(e.target.value)}
        placeholder="名前を入力してください"
      />
      <button onClick={buttonHandler}>button</button>
      <div ref={targetElement}></div>
    </div>
  );
};

export default RoomNameInput;
