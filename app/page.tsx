"use client";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";
import Link from "next/link";

const Test = dynamic(() => import("@/components/pages/speaker"), {
  ssr: false,
});

export default function Home() {
  return (
    <RecoilRoot>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Link href="/speaker">話し手はこちら</Link>
        <Link href="/listener">聞き手はこちら</Link>
      </div>
    </RecoilRoot>
  );
}
