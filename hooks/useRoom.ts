import { isCorrectUserName } from "@/functions/utils";
import { userMediaStreamAtom } from "@/recoil";
import {
  LocalP2PRoomMember,
  LocalStream,
  RoomPublication,
  SkyWayContext,
  SkyWayRoom,
} from "@skyway-sdk/room";
import { useRef } from "react";
import { useRecoilValue } from "recoil";

const useRoom = (token: string | null) => {
  const userMediaStream = useRecoilValue(userMediaStreamAtom);
  const targetElement = useRef<HTMLDivElement>(null);

  const joinInRoom = async (roomName: string, myName: string) => {
    if (!roomName) {
      alert("ルーム名を入力してください");
      return;
    }
    if (!myName) {
      alert("名前を入力してください");
      return;
    } else if (isCorrectUserName(myName) === false) {
      alert("名前に使用できない文字が含まれています。(英語で入力してください)");
      return;
    }
    if (!token) {
      alert("トークンを取得してください");
      return;
    }
    if (!userMediaStream?.audio || !userMediaStream?.video) {
      alert("カメラとマイクの使用を許可してください");
      return;
    }
    const context = await SkyWayContext.Create(token);
    console.log("context is", context);
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: "p2p",
      name: roomName,
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
    subscribeButton.textContent = `${publication.publisher.name}:${publication.contentType}`;
    if (targetElement.current == null) return;
    targetElement.current.appendChild(subscribeButton);
    targetElement.current.appendChild(audioElement);
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
