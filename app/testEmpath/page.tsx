"use client";

import { uploadFileToChunkEndpoint } from "@/functions/voiceEmotion2";
import { useEffect, useRef } from "react";

const page = () => {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.addEventListener("change", (e: any) => {
      const file = e.target.files[0];
      console.log(file);

      uploadFileToChunkEndpoint(file);
    });
  }, []);
  return (
    <div>
      <input type="file" id="fileInput" accept="audio/*" ref={input} />
    </div>
  );
};

export default page;
