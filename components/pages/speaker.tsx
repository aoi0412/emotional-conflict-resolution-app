"use client";

import useToken from "@/hooks/useToken";
import RoomNameInput from "../util/RoomNameInput";
import EmotionButton from "../util/EmotionButton";
import { useEffect } from "react";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { memberTypeAtom, opponentNameAtom, userNameAtom } from "@/recoil";

import Image from "next/image";

const speaker = () => {
  useToken();
  const setMemberType = useSetRecoilState(memberTypeAtom);
  const userName = useRecoilValue(userNameAtom);
  useEffect(() => {
    setMemberType("speaker");
  }, []);
  const opponentName = useRecoilValue(opponentNameAtom);

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
          {opponentName && (
            <div>
              <Image
                src="/images/user.png"
                width={300}
                height={300}
                alt="user"
              />
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
        <RoomNameInput />
      </div>
      <EmotionButton />
    </div>
  );
};

export default speaker;
