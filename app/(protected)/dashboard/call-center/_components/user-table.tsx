"use client";

import { Skeleton } from "@/components/ui/skeleton";
import http from "@/lib/http";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCwIcon } from "lucide-react";

export const UserTasksTables = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    await http
      .get("/call-center/admin/users")
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();
  return (
    <div className="mt-[25px]">
      <Button
        disabled={loading}
        onClick={async () => {
          await fetchData();
        }}
        size="sm"
        variant="ghost"
        className="flex items-center text-[14px]"
      >
        <RefreshCwIcon
          className={cn("mr-[10px] size-[15px] ", loading && "animate-spin")}
        />{" "}
        Refresh
      </Button>
      {loading && (
        <div>
          <Skeleton className="h-[30px]  w-full" />
          <div className="flex flex-col space-y-[10px] mt-[20px]">
            <Skeleton className="h-[20px]  w-full " />
            <Skeleton className="h-[20px]  w-full mt-[5px]" />
            <Skeleton className="h-[20px]  w-full mt-[5px]" />
            <Skeleton className="h-[20px]  w-full mt-[5px]" />
          </div>
        </div>
      )}
      {!loading && (
        <Table>
          <TableCaption>A list of your recent tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Ready Calls</TableHead>
              <TableHead>Positive Calls</TableHead>
              <TableHead>No Answer Calls</TableHead>
              <TableHead>Confirm Calls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user: any, idx) => (
              <TableRow
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/call-center/${user._id}`)
                }
                key={idx}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-[10px]">
                    <Avatar className="w-6 h-6">
                      <AvatarImage className="w-6 h-6" src={user.profile} />
                      <AvatarFallback>
                        {user.name.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="capitalize">
                      {user.name.firstName} {user.name.lastName.charAt(0)}.
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{user.readyCalls}</TableCell>
                <TableCell className="font-medium text-green-600">
                  {user.positiveCalls}
                </TableCell>
                <TableCell className="font-medium text-red-600">
                  {user.noAnswerCalls}
                </TableCell>
                <TableCell className="font-medium dark:text-white text-blue-600">
                  {user.confirmCalls}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
