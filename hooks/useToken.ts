"use client";
import { roomTokenAtom } from "@/recoil";
import { SkyWayAuthToken, nowInSec, uuidV4 } from "@skyway-sdk/room";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

const useToken = () => {
  const appId = process.env.NEXT_PUBLIC_SKYWAY_APP_ID;
  const secretKey = process.env.NEXT_PUBLIC_SKYWAY_SECRET_KEY;
  // const [token, setToken] = useState<string | null>(null);
  const setToken = useSetRecoilState(roomTokenAtom);
  useEffect(() => {
    if (!appId || !secretKey) return;
    console.log("iat", nowInSec());
    console.log("exp", nowInSec());
    const tmpToken = new SkyWayAuthToken({
      jti: uuidV4(),
      iat: nowInSec(),
      exp: nowInSec() + 60 * 60,
      scope: {
        app: {
          id: appId,
          turn: true,
          actions: ["read"],
          channels: [
            {
              id: "*",
              name: "*",
              actions: ["write"],
              members: [
                {
                  id: "*",
                  name: "*",
                  actions: ["write"],
                  publication: {
                    actions: ["write"],
                  },
                  subscription: {
                    actions: ["write"],
                  },
                },
              ],
              sfuBots: [
                {
                  actions: ["write"],
                  forwardings: [
                    {
                      actions: ["write"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    }).encode(secretKey);
    setToken(tmpToken);
  }, []);
};

export default useToken;
