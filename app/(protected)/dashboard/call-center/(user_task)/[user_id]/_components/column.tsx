"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/user";
import { cn } from "@/lib/utils";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import {
  Archive,
  DownloadIcon,
  GhostIcon,
  Loader2,
  MoreVertical,
  PhoneCallIcon,
  PhoneIcon,
  PlusIcon,
  SmileIcon,
  Trash2Icon,
  Upload,
  UploadIcon,
  View,
} from "lucide-react";
import { useState } from "react";
import { AddNewTaskDialog } from "./add-new-task-dialog";
import { getRandomRelaxingQuote } from "@/lib/random-quots";
import { ViewTaskDialog } from "./view-task-details-dialog";
import dayjs from "dayjs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnProps {
  label: string;
  color: string;
  tasks: any[];
  col: any;
  state?: any;
  callBack: () => void;
  removeTask: (id: string) => void;
}
import { formatDistanceToNow } from "date-fns";
import { CsvButton } from "./upload-csv";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import http from "@/lib/http";
import { toast } from "sonner";
import { DownloadButton } from "./download-csv";
import { ClearAllTaskDialog } from "./clear-all-tasks-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const Column = ({
  label,
  color,
  tasks,
  col,
  state,
  callBack,
  removeTask,
}: ColumnProps) => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState(""); // State for managing search query

  const [uploading, setUploading] = useState(false);

  const [filterByNoAnswer, setFilterByNoanswer] = useState(false);
  const [filterByCallBack, setFilterByCallBack] = useState(false);
  const [displayedTasks, setDisplayedTasks] = useState(10);
  const filteredTasks = tasks
    .filter((task) => {
      const titleMatch = task?.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const noAnswerMatch =
        !filterByNoAnswer || task?.labels.includes("No Answer");
      const callBackMatch =
        !filterByCallBack || task?.labels.includes("Call Back");
      return titleMatch && noAnswerMatch && callBackMatch;
    })
    .slice(0, displayedTasks);

  const isManage = user?.role != "USER";

  const [showAddNewTaskDialog, setShowAddNewTaskDialog] = useState(false);
  const [showTaskDetailsDialog, setShowTaskDetailsDialog] = useState(false);

  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);

  // const formattedTimeSpan = formatDistanceToNow(date, { addSuffix: true,  });

  const len = tasks.map((ta, idx) => {
    let t = 0;
    t = ta != null ? idx + 1 : t;
    return t;
  });

  const [data, setData] = useState<any>();
  const params = useParams();
  const { user_id } = params;

  const handlerDelete = async (id: string, task_id: string | any) => {
    await http
      .delete("/call-center/task", {
        data: {
          user_id: user_id,
          id: id,
          task_id,
          colId: col._id,
          userName: `${user.name.first_name} ${user.name.last_name}`,
          lastStatus: label,
        },
      })
      .then((res) => {
        toast.success("Taks Deleted");
        callBack();
      })
      .catch((err) => {
        toast.error("Something wrong");
        console.error(err);
      });
  };

  const handlerNoAnswer = async (task_id: string, task: any, label: string) => {
    let updatedLabels;

    // Check if the "No Answer" label is already present
    const hasNoAnswer = task.labels.includes("No Answer");

    if (label === "No Answer") {
      // If the label to be added is "No Answer" and it's not already present, add it
      if (!hasNoAnswer) {
        updatedLabels = [...task.labels, label];
      } else {
        // If the label to be added is "No Answer" and it's already present, do nothing
        return;
      }
    } else {
      // If the label to be added is not "No Answer"
      if (hasNoAnswer) {
        // If "No Answer" is present, remove it and add the new label
        updatedLabels = task.labels.filter((l: any) => l !== "No Answer");
      } else {
        // If "No Answer" is not present, just add the new label
        updatedLabels = [...task.labels, label];
      }
    }

    // Perform the HTTP PUT request to update the task with the updated labels
    await http
      .put("/call-center/task/update-labels", {
        user_id,
        task_id,
        data: {
          ...task,
          labels: updatedLabels,
        },
      })
      .then(() => {
        callBack();
      });
  };

  const handlerCallBack = async (task_id: string, task: any, label: string) => {
    let updatedLabels;

    // Check if the "Call Back" label is already present
    const hasCallBack = task.labels.includes("Call Back");

    if (label === "Call Back") {
      // If the label to be added is "Call Back" and it's not already present, add it
      if (!hasCallBack) {
        updatedLabels = [...task.labels, label];
      } else {
        // If the label to be added is "Call Back" and it's already present, do nothing
        return;
      }
    } else {
      // If the label to be added is not "Call Back"
      if (hasCallBack) {
        // If "Call Back" is present, remove it and add the new label
        updatedLabels = task.labels.filter((l: any) => l !== "Call Back");
      } else {
        // If "Call Back" is not present, just add the new label
        updatedLabels = [...task.labels, label];
      }
    }

    // Perform the HTTP PUT request to update the task with the updated labels
    await http
      .put("/call-center/task/update-labels", {
        user_id,
        task_id,
        data: {
          ...task,
          labels: updatedLabels,
        },
      })
      .then(() => {
        callBack();
      });
  };

  const [showClearAllTaskDialog, setShowClearAllTaskDialog] = useState(false);

  const handlerAddCalls = async (
    task_id: string,
    calls: number,
    tasks: any
  ) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Month is zero-based (0 = January, 1 = February, etc.)
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();

    const date = `${currentYear}-${currentMonth + 1}-${currentDay}`;
    const time = `${currentHour}:${currentMinute}:${currentSecond}`;
    await http
      .post("/call-center/task/update-calls", {
        user_id,
        task_id,
        data: {
          ...tasks,
          calls: [...tasks.calls, `${date} ${time}`],
        },
      })
      .then(() => callBack());
  };

  const handleLoadMore = () => {
    setDisplayedTasks(displayedTasks + 10); // Increase the number of displayed tasks by 10
  };
  return (
    <div className=" border py-[10px] px-[10px] rounded-lg pb-[50px] w-full min-w-[270px] bg-gray-50/40 -blur-lg dark:bg-primary-foreground ">
      {showClearAllTaskDialog && (
        <ClearAllTaskDialog
          callBack={callBack}
          tasksIds={tasks ? tasks.map((task) => task?.id) : []}
          colId={col._id}
          open={showClearAllTaskDialog}
          setOpen={() => setShowClearAllTaskDialog(false)}
        />
      )}

      <div
        className={cn(
          " dark:bg-ry-foreground w-full py-[5px] px-[5px] rounded-lg flex space-x-[10px] justify-between items-center ",
          label == "Ready"
            ? "text-black dark:text-white"
            : label == "Positive"
            ? "text-green-600"
            : label == "Negative"
            ? "text-red-600"
            : label == "No Answer"
            ? "text-orange-600"
            : "text-blue-600"
        )}
      >
        <span className="font-bold text-[14px]">
          {label} {`(${tasks != null && tasks.length})`}
        </span>
        {uploading && (
          <div>
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
      <div className="flex space-x-[10px] items-center justify-between">
        <button
          onClick={() => setShowAddNewTaskDialog(true)}
          className="flex text-[12px] items-center space-x-[5px]"
        >
          <PlusIcon size={14} />
          <span>Add</span>
        </button>
        <CsvButton callBack={callBack} colId={col._id} />
        <DownloadButton
          disable={tasks.length == 0 ? true : false}
          filenamem={`${user_id}-${label}`}
          data={tasks}
        />
        <button
          disabled={tasks.length == 0 ? true : false}
          onClick={() => setShowClearAllTaskDialog(true)}
          className="text-destructive flex items-center space-x-[5px] disabled:opacity-25"
        >
          <Trash2Icon size={14} /> <span className="text-[12px]">Clear</span>
        </button>
      </div>
      {/* Search Input */}

      <div className="px-[10px]">
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-[30px] mt-[10px]  "
          placeholder="Search"
        />
      </div>
      <div className="py-[10px] px-[10px]  flex space-x-[5px] ">
        <Badge
          onClick={() => setFilterByCallBack(!filterByCallBack)}
          className={cn(
            "bg-transparent text-black dark:text-white cursor-pointer",
            filterByCallBack && "bg-primary dark:text-black text-white"
          )}
        >
          Call Back
        </Badge>
        <Badge
          onClick={() => setFilterByNoanswer(!filterByNoAnswer)}
          className={cn(
            "bg-transparent text-black dark:text-white cursor-pointer",
            filterByNoAnswer && "bg-primary dark:text-black text-white"
          )}
        >
          No Answer
        </Badge>
      </div>
      {/* Droppable Area for Tasks */}

      <Droppable droppableId={col.id}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className="mt-[20px] px-[10px] space-y-[10px]"
          >
            {/* Render Tasks */}

              {filteredTasks.map((task, idx) => {
                const isNoAnswer =
                  task.labels && task.labels.includes("No Answer");
                const isCallBack =
                  task.labels && task.labels.includes("Call Back");
                return (
                  <Draggable
                    draggableId={`${task.id}`}
                    index={idx}
                    key={task.id}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <div
                        className={cn(
                          " border z-20 py-[10px] px-[10px] rounded-lg  shadow-md bg-background  group ",
                          label == "Positive"
                            ? "bg-green-400 text-black"
                            : label == "Negative"
                            ? "bg-red-300 text-black"
                            : label == "No Answer"
                            ? "bg-orange-300 text-black"
                            : label == "Confirm"
                            ? "bg-blue-400 text-black"
                            : ""
                        )}
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.dragHandleProps}
                        {...draggableProvided.draggableProps}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-[5px]">
                            {task.metaData?.color && (
                              <div
                                className={cn(
                                  " w-[7px] h-[7px] rounded-full",
                                  `bg-${task.metaData.color}`
                                )}
                              />
                            )}
                            <div>
                              <h5 className="font-medium max-w-[200px] truncate opacity-70 flex items-center space-x-[10px]">
                                <span>{task.title} </span>
                                {task.calls.length != 0 && (
                                  <span className="flex items-center space-x-[5px] ">
                                    <PhoneCallIcon size={12} />
                                    <span>{task.calls.length}</span>
                                  </span>
                                )}
                              </h5>

                              <p className="text-[18px] font-medium  max-w-[250px] truncate">
                                {task.contacts ? task.contacts[0] : ""}
                              </p>
                              <div className="flex space-x-[5px]">
                                {task.labels &&
                                  task.labels.map(
                                    (label: string, idx: number) => (
                                      <div
                                        key={idx}
                                        className={cn(
                                          "w-[10px] h-[10px]  rounded-full",
                                          label == "No Answer"
                                            ? "bg-red-600"
                                            : "bg-gray-500"
                                        )}
                                      />
                                    )
                                  )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreVertical size={20} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="space-y-[5px]">
                                <DropdownMenuLabel>Labels</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className={cn(
                                    "font-bold ",
                                    isNoAnswer && "bg-red-500 text-white"
                                  )}
                                >
                                  <span
                                    onClick={() =>
                                      handlerNoAnswer(
                                        task._id,
                                        task,
                                        !isNoAnswer ? "No Answer" : ""
                                      )
                                    }
                                  >
                                    No Answer
                                  </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className={cn(
                                    "font-medium  ",
                                    isCallBack ? "bg-gray-500 text-white" : ""
                                  )}
                                >
                                  <span
                                    onClick={() =>
                                      handlerCallBack(
                                        task._id,
                                        task,
                                        !isCallBack ? "Call Back" : ""
                                      )
                                    }
                                  >
                                    Call Back
                                  </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <button
                                    onClick={() =>
                                      handlerAddCalls(
                                        task._id,
                                        task.calls,
                                        task
                                      )
                                    }
                                    className="flex items-center space-x-[5px]"
                                  >
                                    <PhoneIcon size={12} />
                                    <span>Add Call</span>
                                  </button>
                                </DropdownMenuItem>
                                <hr className="py-[5px]" />
                                <DropdownMenuItem>
                                  <button
                                    className="flex items-center"
                                    onClick={() =>
                                      handlerDelete(task._id, task.id)
                                    }
                                  >
                                    <Archive className="size-[16px] mr-[5px]" />
                                    Move archive
                                  </button>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <hr className="mt-[10px] border-black" />
                        <div className="flex justify-between mt-[10px]">
                          <span className="text-[10px]">
                            Added by <b>{task.createdBy}</b>
                          </span>
                          <span className="text-[10px]">
                            {task.createdAt &&
                              formatDistanceToNow(task.createdAt, {
                                addSuffix: true,
                              })}
                          </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            {/* Placeholder for Droppable Area */}
            {droppableProvided.placeholder}
            {tasks.length == 0 && (
              <div className="flex justify-center items-center h-full mt-[45px]">
                <div className="flex flex-col items-center text-gray-500">
                  <GhostIcon />
                  <span> {col.title} tasks</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {filteredTasks.length >= 10 && (
        <div className="mt-[20px] flex justify-center w-full">
          <Button
            disabled={filteredTasks.length !== displayedTasks}
            variant="ghost"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
      {showTaskDetailsDialog && (
        <ViewTaskDialog
          deleteTask={(id) => removeTask(id)}
          callBack={callBack}
          taskData={tasks[selectedTaskIdx]}
          open={showTaskDetailsDialog}
          setOpen={() => setShowTaskDetailsDialog(false)}
        />
      )}
      {showAddNewTaskDialog && (
        <AddNewTaskDialog
          callBack={callBack}
          states={state}
          colData={col}
          open={showAddNewTaskDialog}
          setOpen={() => setShowAddNewTaskDialog(false)}
        />
      )}
    </div>
  );
};
