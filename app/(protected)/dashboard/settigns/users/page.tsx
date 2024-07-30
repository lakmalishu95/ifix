import MaxWidthWrapper from "@/components/max-width-wrapper";
import { UsersCard } from "../_componets/users-card";
import http from "@/lib/http";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | Ifix Management System",
};

const UserManagementPage = () => {
  return (
    <MaxWidthWrapper className="h-full flex  justify-center  items-center">
      <main className="mt-[120px] w-full flex justify-center">
        <UsersCard />
      </main>
    </MaxWidthWrapper>
  );
};

export default UserManagementPage;
