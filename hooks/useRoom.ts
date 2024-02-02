import { isCorrectUserName } from "@/functions/utils";
import {
  opponentNameAtom,
  roomDocIdAtom,
  roomTokenAtom,
  userMediaStreamAtom,
  userNameAtom,
} from "@/recoil";
import {
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

const useRoom = (memberType: "listener" | "speaker" | null) => {
  const userMediaStream = useRecoilValue(userMediaStreamAtom);
  const token = useRecoilValue(roomTokenAtom);
  const [roomId, setRoomId] = useRecoilState(roomDocIdAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  // const memberType = useRecoilValue(memberTypeAtom);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const audioElement = useRef<HTMLAudioElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const [roomData, setRoomData] = useState<P2PRoom | null>(null);
  const [myMemberData, setMyMemberData] = useState<LocalP2PRoomMember | null>(
    null
  );
  useEffect(() => {
    const tmpFunc = () => {
      if (memberType === "speaker") {
        alert("close");
        myMemberData?.leave();
        roomData?.close();
        // メッセージを設定
      } else {
        alert("leave");
        myMemberData?.leave();
      }
    };
    console.log("window");
    return () => {
      tmpFunc();
    };
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

    await tmpMyId.publish(userMediaStream.audio);
    const publication = await tmpMyId.publish(userMediaStream.video);
    const subscribe = async (
      publication: RoomPublication<LocalStream>,
      myId: LocalP2PRoomMember
    ) => {
      console.log("publisherId", publication.publisher.id, "myId", myId.id);
      if (publication.publisher.id === myId.id) return;

      if (audioElement.current == null || videoElement.current == null) {
        alert("audioElement or videoElement is null");
        return;
      }
      audioElement.current.autoplay = true;
      audioElement.current.controls = true;

      videoElement.current.autoplay = true;
      videoElement.current.playsInline = true;
      if (publication.publisher.name)
        setOpponentName(publication.publisher.name);
      else setOpponentName("相手");
      if (!myId) {
        alert("ルームに参加してください");
        return;
      }
      console.log("subscribe", publication.id);
      const { stream, subscription } = await myId.subscribe(publication.id);
      subscription.onConnectionStateChanged.add((e) => {
        console.log("onConnectionStateChanged", e);
      });
      if (stream.contentType !== "audio" && stream.contentType !== "video") {
        alert("音声と映像以外のメディアはサポートしていません");
        return;
      }
      stream.attach(audioElement.current);
      stream.attach(videoElement.current);
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
  return { joinInRoom, opponentName, audioElement, videoElement };
};

export default useRoom;
