"use client";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";
import { checkIsListenerBlocked } from "@/db/checkIsBlocked";
import { useEffect, useState } from "react";

const Listener = dynamic(() => import("@/components/pages/listener"), {
  ssr: false,
});

export default function Home() {
  const [isBlocked, setIsBlocked] = useState(false);
  useEffect(() => {
    checkIsListenerBlocked()
      .then((isBlocked) => {
        setIsBlocked(isBlocked);
      })
      .catch((err) => {
        setIsBlocked(true);
      });
  }, []);
  return (
    <RecoilRoot>
      {isBlocked ? <div>ブロックされています</div> : <Listener />}
    </RecoilRoot>
  );
}
