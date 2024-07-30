"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import http from "@/lib/http";
import { UserTypes } from "@/types/user";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { PutBlobResult } from "@vercel/blob";

interface UserDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userData: UserTypes;
  callBack: () => void;
}

export const UserDetailsDialog = ({
  open,
  setOpen,
  userData,
  callBack,
}: UserDetailsDialogProps) => {
  const [showResetPassForm, setShowResetPassForm] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handlerResetPassword = async () => {
    setLoading(true);
    await http
      .put("/user/reset-password", {
        id: userData._id,
        password: newPass,
      })
      .then((res) => {
        toast.success("User password Update Success!");
        setShowResetPassForm(false);
      })
      .finally(() => setLoading(false));
  };

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>{`${userData.name.firstName} ${userData.name.lastName}`}</DialogHeader>

        <div className="flex flex-col">
          <h2 className="text-[20px] font-bold capitalize">{`${userData.name.firstName} ${userData.name.lastName}`}</h2>
          <span>{userData.email}</span>

          <div className="py-[10px]">
            <span>Select Avatar</span>
            <form
              className="flex space-x-[10px] items-center"
              onSubmit={async (event) => {
                setLoading(true);
                event.preventDefault();

                if (!inputFileRef.current?.files) {
                  throw new Error("No file selected");
                }

                const file = inputFileRef.current.files[0];

                const response = await fetch(
                  `/api/avatar/upload?filename=${file.name}`,
                  {
                    method: "POST",
                    body: file,
                  }
                );

                const newBlob = (await response.json()) as PutBlobResult;
                await http
                  .put("/user/profile", {
                    profile: newBlob.url,
                    _id: userData._id,
                  })
                  .then(() => {
                    toast.success("Updated!");
                    callBack();
                    setOpen(false);
                  });

                setLoading(false);
              }}
            >
              <Input name="file" ref={inputFileRef} type="file" required />
              <Button type="submit">
                {loading ? <Loader2 className="animate-spin" /> : "Upload"}{" "}
              </Button>
            </form>
          </div>
          <Button
            onClick={() => setShowResetPassForm(!showResetPassForm)}
            className="max-w-[120px] mt-[20px]"
            variant="ghost"
          >
            Reset Password
          </Button>
          {showResetPassForm && (
            <>
              <div className="mt-[20px] flex justify-between space-x-[10px]">
                <Input
                  onChange={(e) => setNewPass(e.target.value)}
                  maxLength={16}
                  placeholder="Add New password"
                />
                <Button
                  onClick={handlerResetPassword}
                  disabled={!newPass || loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Save"}
                </Button>
              </div>
              <span className="text-gray-500 ml-[10px]">
                {newPass && `${newPass.length}/16`}
              </span>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
