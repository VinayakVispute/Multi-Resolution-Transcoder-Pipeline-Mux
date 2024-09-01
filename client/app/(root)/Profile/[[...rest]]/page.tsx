import { UserProfile } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center m-4">
      <UserProfile />
    </div>
  );
};

export default page;
