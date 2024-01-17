"use client";

import useAudioVideo from "@/hooks/useAudioVideo";
import useToken from "@/hooks/useToken";
import RoomNameInput from "../util/RoomNameInput";
import EmotionButton from "../util/EmotionButton";
import { useEffect } from "react";
import { RecordData, RoomData } from "@/types/firestore";
import { createRoom } from "@/db/createRoom";
import { addRecord } from "@/db/addRecord";
import { useSetRecoilState } from "recoil";
import { memberTypeAtom } from "@/recoil";

const speaker = () => {
  useToken();
  const setMemberType = useSetRecoilState(memberTypeAtom);
  useEffect(() => {
    setMemberType("speaker");
  }, []);
  return (
    <div>
      <RoomNameInput />
      <EmotionButton />
    </div>
  );
};

export default speaker;
