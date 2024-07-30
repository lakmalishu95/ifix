"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { usePathname, useRouter } from "next/navigation";
import { ProtectedNavbar } from "./navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import useUser from "@/hooks/user";
import http from "@/lib/http";

export const ProtectedHeader = () => {
  const { user } = useUser();
  const [onlineStatus, setOnlineStatus] = useState(true); // Assume online by default

  useEffect(() => {
    const handleVisibilityChange = () => {
      setOnlineStatus(
        document.visibilityState === "visible" && navigator.onLine
      );
    };

    const handleOnlineStatusChange = () => {
      setOnlineStatus(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const chageStatus = async () => {
    await http
      .post("/user/status", {
        status: onlineStatus,
        user_id: user?.id,
      })
      .then((res) => console.log(res.data));
  };

  useEffect(() => {
    document.title = onlineStatus ? "ifix Management System" : "You'r now offline";
    user && chageStatus();
  }, [onlineStatus]);
  return (
    <header className="  fixed top-0 right-0 left-0 w-full py-[14px] border-b border-black/20 items-center bg-[#2B2B2B] text-white z-[20] px-[20px]">
      <MaxWidthWrapper className="flex justify-between items-center">
        <div className="flex items-center space-x-[40px]">
          <ProtectedNavbar />
        </div>
        <div className="flex items-center space-x-[20px]">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.image} />
                <AvatarFallback>NX</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => signOut()}>
                {" "}
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <ModeToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

const menu_items = [
  {
    lable: "Call Center",
    path: "/dashboard/call-center",
    icon: "/static/images/phone-call.png",
  },
];
