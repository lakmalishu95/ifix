"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/user";
import http from "@/lib/http";
import { SelectContent, SelectValue } from "@radix-ui/react-select";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

interface AddNewTaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  colData: any;
  states?: any;
  callBack?: () => void;
}

export const AddNewTaskDialog = ({
  open,
  setOpen,
  colData,
  states,
  callBack,
}: AddNewTaskDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    notes: "",
    contacts: [""],
    metadata: {
      service: "",
      remark: "",
    },
    customer: {
      website: "",
      name: "",
      company: "",
    },
  });

  const handlerAddContactField = () => {
    setData({
      ...data,
      contacts: [...data.contacts, ""],
    });
  };

  const handlerRemoveContactField = (index: number) => {
    setData((prevData) => {
      const updatedContacts = [...prevData.contacts];
      updatedContacts.splice(index, 1);
      return { ...prevData, contacts: updatedContacts };
    });
  };
  const { user } = useUser();

  const handlerContactChanger = (index: number, no: string) => {
    setData((prevData) => {
      const newContact = [...prevData.contacts];
      newContact[index] = no;
      return { ...prevData, contacts: newContact };
    });
  };

  const buttonIsDisbled = !data.contacts[0] || !data.title || loading;

  const [taskData, setTaskData] = useState(states);

  const params = useParams();
  const { user_id } = params;
  const handlerSave = async () => {
    setLoading(true);
    setTaskData({ ...taskData, tasks: [...taskData.tasks, data] });
    await http
      .post("/call-center/task", {
        user_id: user_id,
        data: {
          ...data,
          createdBy: user
            ? `${user?.name?.first_name} ${user?.name?.last_name.charAt(0)}.`
            : "",
        },
        colId: colData._id,
      })
      .then((res) => {
        if (callBack) {
          callBack();
        }
        setOpen(false);
      })
      .catch((er) => console.error(er))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-[20px] lg:max-w-screen-xl min-h-[600px] flex flex-col max-h-screen">
        <DialogHeader>
          <p>
            Add New Task in 
            <b>{colData.title}</b>
          </p>
        </DialogHeader>
        <div className="flex space-x-[40px] justify-between">
          <div className="space-y-[10px] max-w-[560px] w-full">
            <div className="flex flex-col space-y-[20px]">
              <div>
                <label>Title</label>
                <Input
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="font-bold"
                  placeholder="Title"
                />
              </div>
              <div>
                <label>Notes</label>
                <Textarea
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  placeholder="Notes (Option)"
                />
              </div>
              <div>
                <label>Contact Number</label>

                <div className="w-full flex flex-col mt-[10px] space-y-[10px]">
                  {data.contacts.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between space-x-[20px] w-full group"
                    >
                      <div className="hidden group-hover:block">
                        <span
                          onClick={() => handlerRemoveContactField(idx)}
                          className="cursor-pointer hover:font-bold text-gray-500 duration-200"
                        >
                          X
                        </span>
                      </div>
                      <div className="w-full">
                        <Input
                          maxLength={10}
                          value={data.contacts[idx]}
                          onChange={(e) => {
                            handlerContactChanger(idx, e.target.value);
                          }}
                          className="font-bold w-full"
                          placeholder="Number"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    disabled={data.contacts.length > 2}
                    onClick={handlerAddContactField}
                    className="mt-[20px] "
                    variant="ghost"
                  >
                    Add contact number
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[600px]">
            <div className="flex flex-col items-start  w-full max-w-[450px]">
              <span className="font-medium text-gray-500 text-[14px]">
                Meta Data
              </span>
              <div className="border w-full h-full py-[10px] px-[20px] mt-[20px] rounded-lg ">
                <div className="space-y-[10px] mt-[20px]">
                  <div>
                    <label>Service</label>
                    <Input
                      onChange={(e) =>
                        setData({
                          ...data,
                          metadata: {
                            ...data.metadata,
                            service: e.target.value,
                          },
                        })
                      }
                      placeholder="Service"
                    />
                  </div>
                  <div>
                    <label>Remark</label>
                    <Input
                      onChange={(e) =>
                        setData({
                          ...data,
                          metadata: {
                            ...data.metadata,
                            remark: e.target.value,
                          },
                        })
                      }
                      placeholder="Remark"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start  w-full max-w-[450px] mt-[30px]">
              <span className="font-medium text-gray-500 text-[14px]">
                Customer
              </span>
              <div className="border w-full h-full py-[10px] px-[20px] mt-[20px] rounded-lg ">
                <div className="space-y-[10px] mt-[20px]">
                  <div>
                    <label>Customer name</label>
                    <Input
                      onChange={(e) =>
                        setData({
                          ...data,
                          customer: { ...data.customer, name: e.target.value },
                        })
                      }
                      placeholder="John doe"
                    />
                  </div>
                  <div>
                    <label>Company</label>
                    <Input
                      onChange={(e) =>
                        setData({
                          ...data,
                          customer: {
                            ...data.customer,
                            company: e.target.value,
                          },
                        })
                      }
                      placeholder="Nexsine"
                    />
                  </div>
                  <div>
                    <label>Website</label>
                    <Input
                      onChange={(e) =>
                        setData({
                          ...data,
                          customer: {
                            ...data.customer,
                            website: e.target.value,
                          },
                        })
                      }
                      placeholder="www.nexsine.co"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div>
            <Button onClick={handlerSave} disabled={buttonIsDisbled}>
              {loading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
