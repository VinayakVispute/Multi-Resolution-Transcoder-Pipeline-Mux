"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  SignedOut,
  SignOutButton,
  UserButton,
  SignedIn,
  SignInButton,
} from "@clerk/nextjs";
import { Bell, MountainIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

const DashboardNavbar = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between">
      <nav className="flex items-center gap-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-bold">Video Processing</span>
        </Link>
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/"
            className={` hover:text-black ${
              pathname === "/" ? "text-blue-600 font-medium" : ""
            }`}
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="/History"
            className={` hover:text-black ${
              pathname === "/History" ? "text-blue-600 font-medium text-xl" : ""
            }`}
            prefetch={false}
          >
            History
          </Link>
          <Link
            href="/Profile"
            className={` hover:text-black ${
              pathname === "/Profile" ? "text-blue-600 font-medium text-xl" : ""
            }`}
            prefetch={false}
          >
            Profile
          </Link>
          <Link
            href="/Dashboard"
            className={` hover:text-black ${
              pathname === "/Dashboard"
                ? "text-blue-600 font-medium text-xl"
                : ""
            }`}
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
                  <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 select-none">
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
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
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
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
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
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
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
  );
};

export default DashboardNavbar;
