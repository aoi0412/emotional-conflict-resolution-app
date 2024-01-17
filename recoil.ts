import {
  LocalAudioStream,
  LocalP2PRoomMember,
  LocalVideoStream,
  RemoteAudioStream,
} from "@skyway-sdk/room";
import { atom } from "recoil";

export const userMediaStreamAtom = atom<{
  audio: LocalAudioStream;
  video: LocalVideoStream;
} | null>({
  key: "userMediaStream",
  default: null,
  dangerouslyAllowMutability: true,
});

export const memberTypeAtom = atom<"speaker" | "listener" | null>({
  key: "memberType",
  default: null,
});

export const currentTimeAtom = atom<number>({
  key: "currentTime",
  default: 0,
});

export const userNameAtom = atom<string | null>({
  key: "userName",
  default: null,
});

export const roomTokenAtom = atom<string | null>({
  key: "roomToken",
  default: null,
});

export const isRecordingAtom = atom<boolean>({
  key: "isRecording",
  default: false,
});

export const roomDocIdAtom = atom<string | null>({
  key: "roomDocId",
  default: null,
});

export const isModelLoadedAtom = atom<boolean>({
  key: "isModelLoaded",
  default: false,
});
