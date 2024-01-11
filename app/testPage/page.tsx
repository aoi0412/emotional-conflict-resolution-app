"use client";
import dynamic from "next/dynamic";
import { RecoilRoot } from "recoil";

const Test = dynamic(() => import("@/components/pages/Test"), { ssr: false });

const page = () => {
  return (
    <RecoilRoot>
      <div>
        <Test />
      </div>
    </RecoilRoot>
  );
};

export default page;
