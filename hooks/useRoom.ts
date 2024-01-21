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
  LocalAudioStream,
  LocalP2PRoomMember,
  LocalStream,
  P2PRoom,
  RoomPublication,
  SkyWayContext,
  SkyWayRoom,
} from "@skyway-sdk/room";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { createRoom } from "@/db/createRoom";
import { joinRoom } from "@/db/joinRoom";
import { listenAddRecord } from "@/db/listenAddRecord";

const useRoom = () => {
  const userMediaStream = useRecoilValue(userMediaStreamAtom);
  const token = useRecoilValue(roomTokenAtom);
  const [roomId, setRoomId] = useRecoilState(roomDocIdAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  const memberType = useRecoilValue(memberTypeAtom);
  const [opponentName, setOpponentName] = useRecoilState(opponentNameAtom);
  const audioElement = useRef<HTMLAudioElement>(null);
  const [roomData, setRoomData] = useState<P2PRoom | null>(null);
  const [myMemberData, setMyMemberData] = useState<LocalP2PRoomMember | null>(
    null
  );
  useEffect(() => {
    window.addEventListener("beforeunload", (event: BeforeUnloadEvent) => {
      if (memberType === "speaker") {
        myMemberData?.leave();
        roomData?.close();
        // メッセージを設定
        const confirmationMessage =
          "本当にこのページを離れますか？※ページを離れると作成した部屋が削除されます";
        return confirmationMessage;
      } else {
        myMemberData?.leave();
      }
    });
  }, []);

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
    setRoomData(room);
    console.log("room is", room);
    let tmpMyId = await room.join({ name: myName });
    setMyMemberData(tmpMyId);

    const publication = await tmpMyId.publish(userMediaStream.audio);
    const subscribe = async (
      publication: RoomPublication<LocalStream>,
      myId: LocalP2PRoomMember
    ) => {
      console.log("publisherId", publication.publisher.id, "myId", myId.id);
      if (publication.publisher.id === myId.id || !audioElement.current) return;
      audioElement.current.autoplay = true;
      audioElement.current.controls = true;
      if (publication.publisher.name)
        setOpponentName(publication.publisher.name);
      if (!myId) {
        alert("ルームに参加してください");
        return;
      }
      console.log("subscribe", publication.id);
      const { stream, subscription } = await myId.subscribe(publication.id);
      subscription.onConnectionStateChanged.add((e) => {
        console.log("onConnectionStateChanged", e);
      });
      if (stream.contentType !== "audio") {
        alert("音声以外のメディアはサポートしていません");
        return;
      }
      stream.attach(audioElement.current);
    };
    room.publications.forEach((publication) => {
      console.log("publication", publication);
      subscribe(publication, tmpMyId);
    });
    room.onStreamPublished.add((e) => {
      subscribe(e.publication, tmpMyId);
    });

    publication.onConnectionStateChanged.add((e) => {
      console.log("onConnectionStateChanged", e);
    });
    return true;
  };
  return { joinInRoom, audioElement };
};

export default useRoom;
