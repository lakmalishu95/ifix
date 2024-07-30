"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useUser from "@/hooks/user";
import http from "@/lib/http";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ViewTaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  taskData: any;
  callBack: () => void;
  deleteTask: (idx: string) => void;
}

export const ViewTaskDialog = ({
  deleteTask,
  open,
  setOpen,
  taskData,
  callBack,
}: ViewTaskDialogProps) => {
  const { user } = useUser();
  const isManage = user.role != "USER";

  const params = useParams();
  const { user_id } = params;
  const handlerDelete = async () => {
    await http
      .delete("/call-center/task", {
        data: {
          user_id: user_id,
          id: taskData._id,
        },
      })
      .then((res) => {
        toast.success("Taks Deleted");
        callBack();
        setOpen(false);
      })
      .catch((err) => {
        toast.error("Something wrong");
        console.error(err);
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-[20px] lg:max-w-screen-xl min-h-[600px] flex flex-col max-h-screen overflow-y-scroll">
        <DialogHeader>{taskData?.title} </DialogHeader>
        <div>
          <h1 className="font-bold text-[20px]">{taskData?.title}</h1>
          <p className="max-w-[600px] mt-[10px] font-medium opacity-80">
            {taskData?.notes}
          </p>
          <div className="mt-[20px]">
            <span>Contacts</span>
            <div className="border py-[20px] px-[10px] mt-[10px] rounded-lg space-y-[10px] max-w-[400px]">
              {taskData?.contacts.map((data: any, idx: number) => (
                <div key={idx}>
                  <p className="font-bold">{data}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-[20px]">
            <span>Metadata</span>
            <div className="border py-[20px] px-[10px] mt-[10px] rounded-lg space-y-[10px] max-w-[400px]">
              <div>
                <label className="text-[14px]">Service</label>
                <p className="font-bold">{taskData?.metadata.service}</p>
              </div>
              <div>
                <label className="text-[14px]">Remark</label>
                <p className="font-bold">{taskData?.metadata.remark}</p>
              </div>
            </div>
          </div>
          <div className="mt-[20px]">
            <span>Customer</span>
            <div className="border py-[20px] px-[10px] mt-[10px] rounded-lg space-y-[10px] max-w-[400px]">
              <div>
                <label className="text-[14px]">Name</label>
                <p className="font-bold">{taskData?.customer.name}</p>
              </div>
              <div>
                <label className="text-[14px]">Company</label>
                <p className="font-bold">{taskData?.customer.company}</p>
              </div>
              <div>
                <label className="text-[14px]">Website</label>
                <p className="font-bold">{taskData?.customer.website}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          {isManage && (
            <Button
              onClick={() => {
                deleteTask(taskData?.id as string);
                setOpen(false);
              }}
              variant="destructive"
            >
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 0765649072
