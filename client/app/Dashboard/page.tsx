import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { currentUser, User } from "@clerk/nextjs/server";
import { getInitials } from "@/utils";
import {
  SignedOut,
  SignOutButton,
  UserButton,
  SignedIn,
  SignInButton,
} from "@clerk/nextjs";
import { Bell } from "lucide-react";
import UploadVideoArea from "@/components/shared/UploadVideoArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Component() {
  const { imageUrl, firstName, lastName, emailAddresses } =
    (await currentUser()) as User;
  const emailId = emailAddresses[0]?.emailAddress;

  const fullName = `${firstName} ${lastName}`;
  return (
    <div className="flex flex-col h-screen bg-white text-black mb-8">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link
            href="#"
            className="font-bold text-lg text-black"
            prefetch={false}
          >
            Dashboard
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="#"
              className="text-gray-500 hover:text-black"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-black"
              prefetch={false}
            >
              History
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-black"
              prefetch={false}
            >
              Profile
            </Link>
            <Link
              href="#"
              className="text-blue-600 font-medium"
              prefetch={false}
            >
              Dashboard
            </Link>
          </div>
        </nav>
        <div className="flex justify-start items-center gap-x-4">
          <SignedIn>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="border-none">
                  <button className="relative p-1 bg-transparent border-none cursor-pointer focus-visible:border-none">
                    <Bell className="w-6 h-6 text-gray-600 border-none" />
                    <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 select-none	">
                      3
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt="@shadcn"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-medium">New video uploaded</div>
                        <div className="text-xs text-gray-500">
                          John Doe uploaded a new video
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt="@shadcn"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-medium">New comment</div>
                        <div className="text-xs text-gray-500">
                          Jane Smith commented on your video
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt="@shadcn"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-medium">Video processed</div>
                        <div className="text-xs text-gray-500">
                          Your video has been processed
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <UserButton />
            <SignOutButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </header>
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
    </div>
  );
}
