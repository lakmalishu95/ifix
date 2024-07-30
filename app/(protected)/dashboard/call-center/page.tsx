"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useUser from "@/hooks/user";
import { Loader2, PhoneCall } from "lucide-react";
import { Metadata } from "next";
import { AdminCards } from "./_components/admin-card";
import { UserTasksTables } from "./_components/user-table";

const CallCenterPage = () => {
  const { user } = useUser();
  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
  return (
    <>
      {isAdmin ? (
        <main className="pt-[40px] px-[50px]">
          <span className="flex space-x-[10px]">
            <span className="font-bold text-[22px]">Call Center</span>
          </span>
          <AdminCards />
          <div className="mt-[50px]">
            <h3>Overview</h3>
            

            <UserTasksTables />
          </div>
        </main>
      ) : (
        <div className="flex justify-center items-center h-full min-h-screen">
          <h2>Hi Welcome {`${user.name.first_name} ${user.name.last_name}`}</h2>
        </div>
      )}
    </>
  );
};

export default CallCenterPage;
