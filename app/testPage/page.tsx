import dynamic from "next/dynamic";

const Test = dynamic(() => import("@/components/pages/Test"), { ssr: false });

const page = () => {
  return (
    <div>
      <Test />
    </div>
  );
};

export default page;
