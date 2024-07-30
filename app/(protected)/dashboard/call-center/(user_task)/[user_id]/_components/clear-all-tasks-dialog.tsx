"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import http from "@/lib/http";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ClearAllTaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  tasksIds: any[];
  colId: string;
  callBack: () => void;
}

export const ClearAllTaskDialog = ({
  open,
  setOpen,
  tasksIds,
  colId,
  callBack,
}: ClearAllTaskDialogProps) => {
  const [loading, setLoadig] = useState(false);

  const { user_id } = useParams();
  const handleDeleteTasks = async () => {
    setLoadig(true);
    await http
      .post("/call-center/task/delete", {
        tasks: tasksIds,
        user_id,
        colId,
      })
      .then(() => {
        toast.success("Tasks Clear Successful!");
        callBack();
        setOpen(false);
      })
      .finally(() => setLoadig(false));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Crear Ready All Tasks</DialogHeader>
        <div>
          <h2 className="text-[18px] font-bold">Are you sure!</h2>
          <p className="font-bold text-gray-600">
            Once you delete it, you cannot recover this data
          </p>
        </div>
        <div className="space-x-[20px]">
          <Button onClick={handleDeleteTasks} variant="destructive">
            {!loading ? "Yes sure" : <Loader2 className="animate-spin" />}
          </Button>
          <Button onClick={() => setOpen(false)} variant="ghost">
            {"I don't want to delete it"}{" "}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
