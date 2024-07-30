"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUser from "@/hooks/user";
import http from "@/lib/http";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const ArchiveCalls = () => {
  const { user_id } = useParams();

  const [loading, setLoadig] = useState(false);

  const [archiveCalls, setArchiveCalls] = useState([]);
  const fetchArchiveCalls = async () => {
    setLoadig(true);
    await http
      .get(`/call-center/task/archive/${user_id}`)
      .then((res) => {
        setArchiveCalls(res.data);
      })
      .finally(() => setLoadig(false));
  };

  useEffect(() => {
    fetchArchiveCalls();
  }, []);

  function formatTimestamp(timestamp: string) {
    // Parse the timestamp string into a Date object
    const date = new Date(timestamp);

    // Extract individual components of the date and time
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    // Construct the formatted date and time string
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
  }

  const { user } = useUser();
  const isManage = user.role != "USER";

  const [loadingDelete, setLoadigDelete] = useState(false);

  const handlerDelete = async (id: string) => {
    setLoadigDelete(true);
    await http
      .delete("/call-center/task/archive", {
        data: {
          _id: id,
        },
      })
      .then(() => {
        toast.success("Deleted!");
        fetchArchiveCalls();
      })
      .finally(() => setLoadigDelete(false));
  };
  return (
    <div className="px-[20px] mt-[50px]">
      <Table>
        <TableCaption>A list of your call archive.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Contacts</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Deleted By</TableHead>
            <TableHead>Last Status</TableHead>
            <TableHead>Date</TableHead>
            {isManage && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody className="w-full">
          {loading && (
            <div className="flex mt-[50px]  justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {archiveCalls.map((data: any, idx) => (
            <TableRow className="group" key={idx}>
              <TableCell className="font-medium">{data.id}</TableCell>
              <TableCell className="capitalize">{data.title}</TableCell>
              <TableCell>{data.contacts[0]}</TableCell>
              <TableCell>{data.createdBy}</TableCell>
              <TableCell>{data.deleteUser}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "font-bold",
                    data.lastStatus == "Ready"
                      ? "text-black dark:text-white"
                      : data.lastStatus == "Positive"
                      ? "dark:text-green-500 text-green-600"
                      : data.lastStatus == "Negative"
                      ? "text-red-600"
                      : data.lastStatus == "No Answer"
                      ? "text-orange-600"
                      : "text-blue-600"
                  )}
                >
                  {" "}
                  {data.lastStatus}
                </span>
              </TableCell>
              <TableCell>{formatTimestamp(data.createdAt)}</TableCell>
              {isManage && (
                <TableCell>
                  <Button
                    disabled={loadingDelete}
                    onClick={() => handlerDelete(data._id)}
                    className="group-hover:flex hidden"
                    size="sm"
                    variant="destructive"
                  >
                    {!loadingDelete ? "Delete" : <Loader2 className="animate-spin"/>}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
