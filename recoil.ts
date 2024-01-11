import {
  LocalAudioStream,
  LocalP2PRoomMember,
  LocalVideoStream,
  RemoteAudioStream,
} from "@skyway-sdk/room";
import { atom } from "recoil";

export const userVideoAtom = atom<LocalVideoStream | null>({
  key: "userVideo",
  default: null,
  dangerouslyAllowMutability: true,
});

export const userAudioAtom = atom<LocalAudioStream | null>({
  key: "userAudio",
  default: null,
  dangerouslyAllowMutability: true,
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
