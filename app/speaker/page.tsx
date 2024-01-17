"use client";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { checkIsSpeakerBlocked } from "@/db/checkIsBlocked";

const Speaker = dynamic(() => import("@/components/pages/speaker"), {
  ssr: false,
});

export default function Home() {
  const [isBlocked, setIsBlocked] = useState(false);
  useEffect(() => {
    checkIsSpeakerBlocked()
      .then((isBlocked) => {
        setIsBlocked(isBlocked);
      })
      .catch((err) => {
        setIsBlocked(true);
      });
  }, []);
  return (
    <RecoilRoot>
      {isBlocked ? <div>ブロックされています</div> : <Speaker />}
    </RecoilRoot>
  );
}
