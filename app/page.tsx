"use client";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";

const Test = dynamic(() => import("@/components/pages/Test"), { ssr: false });

export default function Home() {
  return (
    <RecoilRoot>
      <div>
        <Test />
      </div>
    </RecoilRoot>
  );
}
