"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import http from "@/lib/http";
import { formatDistanceToNow } from "date-fns";

interface SideMenuUserCardProps {
  active?: boolean;
  profile: string;
  name: {
    firstName: string;
    lastName: string;
  };
  id: string;
}

export const SideMenuUserCard = ({
  active,
  name,
  id,
  profile,
}: SideMenuUserCardProps) => {
  const router = useRouter();
  const [_status, _setStatus] = useState(false);
  const [lastSeen, setLastSeen] = useState("");

  const fetchStatus = async () => {
    await http.get(`/user/status?user_id=${id}`).then((res) => {
      _setStatus(res.data.online);
      const date = new Date(res.data.lastseen);

      setLastSeen(res.data.lastseen);
    });
  };
  useEffect(() => {
    fetchStatus();
  }, []);
  useEffect(() => {
    const fetchDataInterval = setInterval(fetchStatus, 10000); // Fetch data every 5 seconds

    return () => clearInterval(fetchDataInterval); // Cleanup interval on component unmount
  }, []);

  return (
    <Button
      size="sm"
      onClick={() => router.push(`/dashboard/call-center/${id}`)}
      className={cn(
        "p-[20px] min-h-[50px] w-full text-start flex justify-start hover:bg-primary/20",
        active && " bg-primary/20"
      )}
      variant={"ghost"}
    >
      <div className="py-[10px] my-[10px] flex items-center space-x-[10px]">
        <div className="relative">
          <HoverCard>
            <HoverCardTrigger>
              <Avatar>
                <AvatarImage src={profile} />
                <AvatarFallback className="uppercase w-[40px] h-[40px]">
                  {name.firstName.charAt(0)}
                  {name.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto z-50">
              <div className="flex flex-col">
                {_status ? (
                  "Online"
                ) : (
                  <>
                    <span>Last seen</span>
                    <b>{lastSeen}</b>
                  </>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>

          {_status && (
            <div className="w-3 h-3 bg-green-400 rounded-full absolute top-0 " />
          )}
        </div>
        <div>
          <p className=" font-medium capitalize">
            {name.firstName} {name.lastName}
          </p>
        </div>
      </div>
    </Button>
  );
};
