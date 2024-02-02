"use client";

import useToken from "@/hooks/useToken";
import RoomNameInput from "../util/RoomNameInput";
import EmotionButton from "../util/EmotionButton";

const speaker = () => {
  useToken();
  // const setMemberType = useSetRecoilState(memberTypeAtom);
  // useEffect(() => {
  //   setMemberType("speaker");
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        padding: "8px",
      }}
    >
      <RoomNameInput memberType={"speaker"} />
      <EmotionButton memberType={"speaker"} />
    </div>
  );
};

export default speaker;
