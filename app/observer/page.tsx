"use client";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";
import { checkIsListenerBlocked } from "@/db/checkIsBlocked";
import { useEffect, useState } from "react";

const Observer = dynamic(() => import("@/components/pages/observer"), {
  ssr: false,
});

export default function Home() {
  return (
    <RecoilRoot>
      <Observer />
    </RecoilRoot>
  );
}
