"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserTypes } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import http from "@/lib/http";
import { toast } from "sonner";
import { useState } from "react";
import { UserDetailsDialog } from "./user-details-dialog";
import useUser from "@/hooks/user";
export const UserComponent = ({
  name,
  email,
  _id,
  role,
  callBack,
  profile,
}: UserTypes) => {
  // const { user } = useUser();

  const isSupperAdmin = role == "SUPERADMIN";

  const { user } = useUser();

  const loginSupperAdmin = user.role === "SUPERADMIN";

  const handlerRoleChanger = async (data: any) => {
    await http
      .put("/user", {
        id: _id,
        role: data,
      })
      .then((res) => {
        toast.success("User Role Update Successfull");
      })
      .catch((er) => {
        toast.error("Something Wrong");
        console.error(er);
      });
  };

  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false);
  return (
    <div className="flex items-center justify-between border py-[10px]  px-[10px] rounded-lg space-x-[10px]">
      <div className="flex items-center space-x-[20px] ">
        <Avatar>
          <AvatarImage src={profile} />
          <AvatarFallback className="uppercase">
            {name.firstName.charAt(0)}
            {name.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            onClick={() => {
              if (!isSupperAdmin) {
                setShowUserDetailsDialog(true);
                return;
              }
              return;
            }}
            className="font-medium leading-[10px] capitalize hover:underline cursor-pointer"
          >
            {name.firstName} {name.lastName}
          </p>
          <span className="text-[14px]">{email}</span>
        </div>
      </div>
      <div>
        {!isSupperAdmin && (
          <Select defaultValue={role} onValueChange={handlerRoleChanger}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="USER" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="MANAGER">MANAGER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
        )}
        {isSupperAdmin && (
          <span className="text-[14px] font-medium to-gray-500">
            SUPPER ADMIN
          </span>
        )}
      </div>

      {showUserDetailsDialog && (
        <UserDetailsDialog
          callBack={callBack ? callBack : () => {}}
          userData={{
            name,
            email,
            _id,
            role,
            profile,
          }}
          open={showUserDetailsDialog}
          setOpen={() => setShowUserDetailsDialog(false)}
        />
      )}
    </div>
  );
};
