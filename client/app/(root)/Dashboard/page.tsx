import { currentUser, User } from "@clerk/nextjs/server";
import { getInitials } from "@/utils";

import UploadVideoArea from "@/components/shared/UploadVideoArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Component() {
  const { imageUrl, firstName, lastName, emailAddresses } =
    (await currentUser()) as User;
  const emailId = emailAddresses[0]?.emailAddress;

  const fullName = `${firstName} ${lastName}`;
  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="grid gap-6 p-4 sm:p-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={imageUrl} alt={fullName} />
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="text-lg font-medium text-black">{fullName}</div>
              <div className="text-sm text-gray-500">{emailId}</div>
            </div>
          </div>
          <UploadVideoArea />
        </div>
      </div>
    </main>
  );
}
