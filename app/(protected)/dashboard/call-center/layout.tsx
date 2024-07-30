"use client";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, PhoneCall, PlusSquare } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { SideMenuUserCard } from "./_components/user-card-side-menu";
import { redirect, useParams, useRouter } from "next/navigation";
import useUser from "@/hooks/user";
import { AddNewUserDialog } from "./_components/add-new-user-dialog";
import http from "@/lib/http";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const CallCenterLayout = ({ children }: { children: ReactNode }) => {
  const { user_id } = useParams();

  const { user } = useUser();
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);

  const [userLoading, setUserLoading] = useState(false);

  const isManage = user?.role != "USER";

  const router = useRouter();

  useEffect(() => {
    if (!isManage) {
      router.push(`/dashboard/call-center/${user?.id}`); // Use
    }
  }, [router, isManage, user]);

  const [AddNewUserDialogShow, setAddNewUserDialogShow] = useState(false);

  const fetchEnrolledUsers = async () => {
    setUserLoading(true);
    await http
      .get("/call-center/user")
      .then((res) => setEnrolledUsers(res.data))
      .catch((er) => console.error(er))
      .finally(() => setUserLoading(false));
  };

  useEffect(() => {
    fetchEnrolledUsers();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUser = enrolledUsers.filter((user) =>
    user?.name.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {user ? (
        <div className="mt-[30px] bg-gradient-to-t from-blue-200 to-purple-100 dark:from-blue-950   fixed top-0 left-0 right-0 bottom-0">
          <MaxWidthWrapper>
            <ResizablePanelGroup
              className="mt-[35px] min-h-screen "
              direction="horizontal"
            >
              {isManage && (
                <>
                  <ResizablePanel
                    minSize={5}
                    maxSize={17}
                    defaultSize={17}
                    className=" px-[10px] py-[20px]  sticky top-0 bg-gradient-to-t from-blue-200 to-purple-100 dark:from-blue-950 dark:text-white  flex flex-col justify-between shadow-lg border-r-[2px] border-black/20 dark:border-white/20"
                  >
                    <div>
                      <div className="flex justify-center mt-[20px] ">
                        <Link href="/dashboard">
                          <span className="flex items-center">
                            <ArrowLeft className="size-[20px] mr-[10px]" />
                            Back to dashboard
                          </span>
                        </Link>
                      </div>

                      <hr className="mt-[20px] border-black/20 dark:border-white/10" />
                      <div className="mt-[20px] flex justify-center w-full ">
                        <Link href="/dashboard/call-center">
                          <h1 className="text[20px] font-medium flex items-center space-x-[10px]">
                            <PhoneCall className=" size-[20px]" />{" "}
                            <span>Call center</span>
                          </h1>
                        </Link>
                      </div>
                      <div className=" py-[10px] px-[10px] mt-[20px]   rounded-lg">
                        <div className="mt-[20px] mb-[20px]">
                          Users
                          {` (${enrolledUsers.length})`}
                        </div>

                        <div>
                          <Input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-black/20 dark:border-white/10"
                            placeholder="Search"
                          />

                          <Button
                            onClick={() => setAddNewUserDialogShow(true)}
                            className="w-full mt-[20px] "
                            variant="ghost"
                          >
                            <PlusSquare className="mr-[5px] size-[20px]" /> Add
                            User
                          </Button>

                          <ScrollArea className="h-[320px]">
                            <div className="mt-[20px] w-full space-y-[10px]">
                              {filteredUser.map((user, idx) => (
                                <SideMenuUserCard
                                  profile={user.profile}
                                  key={idx}
                                  id={user._id}
                                  name={user.name}
                                  active={user._id == user_id ? true : false}
                                />
                              ))}
                            </div>
                          </ScrollArea>
                          {userLoading && (
                            <div className="mx-[20px] mr-[20px] pb-[20px]">
                              <div className="space-y-[20px]">
                                <div className="flex items-center space-x-4">
                                  <div className="space-y-2">
                                    <Skeleton className="h-2  w-[150px]" />
                                    <Skeleton className="h-2  w-[100px]" />
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="space-y-2">
                                    <Skeleton className="h-2  w-[150px]" />
                                    <Skeleton className="h-2  w-[100px]" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pb-[70px] px-[20px] text-[12px] opacity-30">
                      Powered by{" "}
                      <Link href="https://nexsine.co" target="_blank">
                        Nexsine
                      </Link>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                </>
              )}
              <ResizablePanel>
                <ScrollArea className="h-screen  rounded-xl  ">
                  <div className="mb-[220px] rounded-lg">{children}</div>
                </ScrollArea>
              </ResizablePanel>
            </ResizablePanelGroup>
          </MaxWidthWrapper>

          {AddNewUserDialogShow && (
            <AddNewUserDialog
              callBack={async () => {
                await fetchEnrolledUsers();
              }}
              open={AddNewUserDialogShow}
              setOpen={() => setAddNewUserDialogShow(false)}
            />
          )}
        </div>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default CallCenterLayout;

const users = [
  {
    name: {
      firstName: "Sasindu",
      lastName: "Kavinda",
    },
    id: "1",
  },
  {
    name: {
      firstName: "Dilini",
      lastName: "Tharaka",
    },
    id: "2",
  },
  {
    name: {
      firstName: "Kasun",
      lastName: "Udayanga",
    },
    id: "3",
  },
];
