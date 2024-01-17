import { isCorrectUserName } from "@/functions/utils";
import {
  memberTypeAtom,
  opponentNameAtom,
  roomDocIdAtom,
  roomTokenAtom,
  userMediaStreamAtom,
  userNameAtom,
} from "@/recoil";
import {
  LocalP2PRoomMember,
  LocalStream,
  RoomPublication,
  SkyWayContext,
  SkyWayRoom,
} from "@skyway-sdk/room";
import { useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { createRoom } from "@/db/createRoom";
import { joinRoom } from "@/db/joinRoom";
import { listenAddRecord } from "@/db/listenAddRecord";

const useRoom = () => {
  const userMediaStream = useRecoilValue(userMediaStreamAtom);
  const targetElement = useRef<HTMLDivElement>(null);
  const token = useRecoilValue(roomTokenAtom);
  const [roomId, setRoomId] = useRecoilState(roomDocIdAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  const memberType = useRecoilValue(memberTypeAtom);
  const [opponentName, setOpponentName] = useRecoilState(opponentNameAtom);

  const joinInRoom = async (myName: string): Promise<boolean> => {
    if (!myName) {
      alert("名前を入力してください");
      return false;
    } else if (isCorrectUserName(myName) === false) {
      alert("名前に使用できない文字が含まれています。(英語で入力してください)");
      return false;
    }
    if (!token) {
      alert("トークンを取得してください");
      return false;
    }
    if (!userMediaStream?.audio || !userMediaStream?.video) {
      alert("カメラとマイクの使用を許可してください");
      return false;
    }
    let tmp: string | null = null;
    if (memberType === "speaker") {
      const tmpRoomId = await createRoom(myName);
      setRoomId(tmpRoomId);
      tmp = tmpRoomId;
    } else if (memberType === "listener") {
      if (roomId == null) {
        alert("roomId is null");
        return false;
      }
      joinRoom(myName, roomId);
      tmp = roomId;
    } else {
      alert("memberType is null");
      return false;
    }
    setUserName(myName);
    const context = await SkyWayContext.Create(token);
    console.log("context is", context);
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: "p2p",
      name: tmp,
    });
    console.log("room is", room);
    let tmpMyId = await room.join({ name: myName });

    await tmpMyId.publish(userMediaStream.audio);

    room.publications.forEach((publication) => {
      console.log("publication", publication);
      subscribe(publication, tmpMyId);
    });
    room.onStreamPublished.add((e) => {
      console.log("onStreamPublished", e);
      subscribe(e.publication, tmpMyId);
    });
    return true;
  };

  const subscribe = (
    publication: RoomPublication<LocalStream>,
    myId: LocalP2PRoomMember
  ) => {
    if (myId && publication.publisher.id === myId.id) return;
    const subscribeButton = document.createElement("button");
    const audioElement = document.createElement("audio");
    audioElement.autoplay = true;
    audioElement.controls = true;
    subscribeButton.textContent = `マイクをオンにする`;
    if (publication.publisher.name) setOpponentName(publication.publisher.name);
    if (targetElement.current == null) return;
    targetElement.current.appendChild(audioElement);
    targetElement.current.appendChild(subscribeButton);
    subscribeButton.onclick = async () => {
      if (!myId) {
        alert("ルームに参加してください");
        return;
      }
      const { stream } = await myId.subscribe(publication.id);
      if (stream.contentType !== "audio") {
        alert("音声以外のメディアはサポートしていません");
        return;
      }
      userMediaStream?.audio?.attach(audioElement);
    };
  };

  return { joinInRoom, targetElement };
};

export default useRoom;
