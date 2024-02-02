"use client";

import { uploadFileToChunkEndpoint } from "@/functions/voiceEmotion2";
import { useEffect, useRef } from "react";

const page = () => {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const getEmotion = async () => {
      input.current?.addEventListener("change", async (e: any) => {
        const file = e.target.files[0];
        console.log(file);

        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/testEmpath/api", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            console.log("File uploaded successfully!");
            console.log("Response from server:");
            console.log(data.talkUnits);
          } else {
            console.error(
              `Failed to upload the file. StatusCode: ${response.status}`
            );
            console.log("Response from server:", response);
            console.error(await response.text());
          }
        } catch (error: any) {
          console.error("Error uploading file:", error.message);
        }
      });
    };
    getEmotion();
  }, []);
  return (
    <div>
      <input type="file" id="fileInput" accept="audio/*" ref={input} />
    </div>
  );
};

export default page;
