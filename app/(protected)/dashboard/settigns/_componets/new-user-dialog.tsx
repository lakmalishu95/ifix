"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NewUserSchema } from "../schema/new-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { registerUser } from "@/action/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import http from "@/lib/http";

interface NewUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  callBack?: () => void;
}

export const NewUserDialog = ({
  open,
  setOpen,
  callBack,
}: NewUserDialogProps) => {
  const [password, setPassword] = useState(generatePassword());
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  const [registerTrasition, startRegisterTrasition] = useTransition();

  const form = useForm<z.infer<typeof NewUserSchema>>({
    resolver: zodResolver(NewUserSchema),
    defaultValues: {
      email: "",
      fname: "",
      lname: "",
      password: "",
    },
  });

  const router = useRouter();

  const handlerSubmit = async (values: z.infer<typeof NewUserSchema>) => {
    setLoading(true);

    await http
      .post("/user/register", {
        email: values.email,
        password,
        name: {
          firstName: values.fname,
          lastName: values.lname,
        },
        role,
      })
      .then((res) => {
        toast.success("user add success!");
        if (callBack) {
          callBack();
        }
        setOpen(false);
      })
      .catch((er) => {
        console.error(er);
        toast.error("Something wrong");
      })
      .finally(() => setLoading(false));
  };

  const handlerRoleChanger = (data: any) => setRole(data);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Add new user</DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlerSubmit)}
              className="space-y-[20px]"
            >
              <div>
                <FormLabel>
                  Role{" "}
                  <Popover>
                    <PopoverTrigger>
                      <QuestionMarkIcon className="text-primary cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent>
                      {" "}
                      <div className="flex flex-col">
                        <span className="text-[14px] mt-[10px] text-gray-500">
                          <span className="font-bold">USER</span>: can only
                          perform assigned tasks in the system
                        </span>
                        <span className="text-[14px] mt-[10px] text-gray-500">
                          <span className="font-bold">MANAGER</span>: can do
                          things like assign tasks to USERS in the system
                        </span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormLabel>
                <Select defaultValue="USER" onValueChange={handlerRoleChanger}>
                  <SelectTrigger className="w-full mt-[10px]">
                    <SelectValue placeholder="USER" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="MANAGER">MANAGER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <FormField
                  name="fname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password{" "}
                      <span
                        className="text-primary cursor-pointer"
                        onClick={() => setPassword(generatePassword())}
                      >
                        Generate
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={password} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton loading={loading} className="float-end">
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function generatePassword(length: number = 6): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}
