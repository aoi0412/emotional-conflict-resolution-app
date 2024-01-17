"use client";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";

const Listener = dynamic(() => import("@/components/pages/listener"), {
  ssr: false,
});

export default function Home() {
  return (
    <RecoilRoot>
      <Listener />
    </RecoilRoot>
  );
}
