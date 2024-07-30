"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { UserComponent } from "./user";
import { UserTypes } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { NewUserDialog } from "./new-user-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const UsersCard = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/user", {
      method: "GET",
    });

    const data = await res?.json();
    setUsers(data);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  return (
    <Card className="w-full max-w-[600px]">
      <CardContent>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-[20px] font-medium">Users</h1>
            <Button onClick={() => setShowNewUserDialog(true)}>Add User</Button>
          </div>
          <hr className="pt-[20px]" />
        </CardHeader>
        <div>
          {users.length === 0 && (
            <div className="space-y-[20px]">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          )}
          <ScrollArea className="h-[400px]">
            <div className="space-y-[20px]">
              {users.map((user: UserTypes, idx) => (
                <UserComponent
                  callBack={async () => {
                    fetchUsers();
                  }}
                  {...user}
                  key={idx}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {showNewUserDialog && (
          <NewUserDialog
            callBack={async () => {
              await fetchUsers();
            }}
            open={showNewUserDialog}
            setOpen={setShowNewUserDialog}
          />
        )}
      </CardContent>
    </Card>
  );
};
