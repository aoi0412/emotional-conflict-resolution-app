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

// export const userAudioAtom = atom<LocalAudioStream | null>({
//   key: "userAudio",
//   default: null,
//   dangerouslyAllowMutability: true,
// });

export const isModelLoadedAtom = atom<boolean>({
  key: "isModelLoaded",
  default: false,
});

// export const memberAudioListAtom = atom<
//   {
//     AudioStream: RemoteAudioStream;
//     buttonElement: HTMLButtonElement;
//   }[]
// >({
//   key: "memberAudioList",
//   default: [],
// });
