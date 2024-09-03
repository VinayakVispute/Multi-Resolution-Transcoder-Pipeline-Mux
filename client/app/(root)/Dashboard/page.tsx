import { currentUser, User } from "@clerk/nextjs/server";
import { getInitials } from "@/utils";
import UploadVideoArea from "@/components/shared/UploadVideoArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Component() {
  const { imageUrl, firstName, lastName, emailAddresses } = (await currentUser()) as User;
  const emailId = emailAddresses[0]?.emailAddress;

  const fullName = `${firstName} ${lastName}`;
  return (
    <main className="flex-1 overflow-y-auto bg-[#e6fcf5]">
      <div className="container mx-auto grid gap-6 p-4 sm:p-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
            <Avatar className="h-16 w-16 border-2 border-[#0ca678]">
              <AvatarImage src={imageUrl} alt={fullName} />
              <AvatarFallback className="bg-[#0ca678] text-white">{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="text-lg font-medium text-[#0ca678]">{fullName}</div>
              <div className="text-sm text-[#12b886]">{emailId}</div>
            </div>
          </div>
          <UploadVideoArea />
        </div>
      </div>
    </main>
  );
}