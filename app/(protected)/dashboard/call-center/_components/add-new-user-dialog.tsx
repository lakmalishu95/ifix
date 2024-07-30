"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import http from "@/lib/http";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import user from "@/model/user";
import useUser from "@/hooks/user";

interface AddNewUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  callBack?: () => void;
}

export const AddNewUserDialog = ({
  open,
  setOpen,
  callBack,
}: AddNewUserDialogProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useUser();

  // Get All users
  const fetchUsers = async () => {
    setLoading(true);
    await http
      .get("/user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchEnrolledUsers = async () => {
    await http
      .get("/call-center/user")
      .then((res) => {
        setEnrolledUsers(res.data);
      })
      .catch((err) => console.error(err));
  };

  // Filter out not enrolled users
  const notEnrolledUsers = users.filter(
    (user) =>
      !enrolledUsers.some((enrolledUser) => enrolledUser._id === user._id)
  );

  // Filter users based on search query
  const filteredUsers = notEnrolledUsers.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [addLoading, setAddLoading] = useState(false);

  const handlerAddUser = async (userId: string) => {
    setAddLoading(true);
    await http
      .post("/call-center/user", {
        userId,
        managerId: user.id,
      })
      .then((res) => {
        toast.success("User Add Successful!");
        if (callBack) {
          callBack();
        }
        setOpen(false);
      })
      .catch((error) => console.error(error))
      .finally(() => setAddLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    fetchEnrolledUsers();
  }, []);


  const filteredUser = filteredUsers
    .filter((user) =>
    user?.name.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5); 

  return (
    <>
      {!loading ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>Add user in call center</DialogHeader>
            <div>
              <Input
                placeholder="Search user by email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {filteredUser.map((user, idx) => (
              <div
                key={idx}
                className="border py-[10px] px-[10px] rounded-lg flex justify-between items-center"
              >
                <div>
                  <h1 className="font-bold leading-[17px]">{`${user.name.firstName} ${user.name.lastName}`}</h1>
                  <span className="text-[14px] text-gray-500">
                    {user.email}
                  </span>
                </div>
                <div>
                  <Button
                    onClick={() => handlerAddUser(user._id)}
                    disabled={addLoading}
                    variant="ghost"
                  >
                    <PlusIcon className="mr-[10px]" />{" "}
                    {addLoading ? <Loader2 className="animate-spin" /> : "Add"}
                  </Button>
                </div>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      ) : (
        <>Loading</>
      )}
    </>
  );
};
