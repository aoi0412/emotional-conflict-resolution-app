"use client";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";

const Speaker = dynamic(() => import("@/components/pages/speaker"), {
  ssr: false,
});

export default function Home() {
  return (
    <RecoilRoot>
      <Speaker />
    </RecoilRoot>
  );
}
