"use client";
import { ReactNode, useEffect, useState } from "react";
import { Column } from "./_components/column";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useUser from "@/hooks/user";
import { getRandomRelaxingQuote } from "@/lib/random-quots";
import { Button } from "@/components/ui/button";
import {
  ArchiveIcon,
  ExternalLink,
  Loader2,
  RefreshCwIcon,
} from "lucide-react";
import http from "@/lib/http";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  title: string;
  contactNo: string;
  note?: string;
  metaData?: {
    notes?: string[];
    companyName?: string;
    service?: string;
    color?: string;
    addedUser?: string;
    time?: string;
  };
}

interface ColumnData {
  id: string;
  color: string;
  title: string;
  taskIds: number[];
}

interface InitialData {
  tasks: Record<string, Task>;
  columns: Record<string, ColumnData>;
  columnOrder: string[];
  user_id: string;
}

interface UserTaskLayoutProps {
  children: ReactNode;
}
const reorderColumnList = (
  sourceCol: ColumnData,
  startIndex: number,
  endIndex: number
): ColumnData => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn: ColumnData = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};
const UserTaskLayout = ({ children }: UserTaskLayoutProps) => {
  const [state, setState] = useState<any>(task);

  const [loadingTask, setLoadingTask] = useState(false);

  const { user } = useUser();
  const isManage = user?.role != "USER";

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops within the same column but in a different position
    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }

    // If the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setState(newState);

    await http
      .put("/call-center/task", {
        user_id: user_id,
        data: newState,
      })
      .then((res) => console.log(res.data));

    // console.log(newState);
  };
  const [quots, setQuots] = useState("");

  const searchParams = useParams();

  const { user_id } = searchParams;

  const fetchTask = async () => {
    setLoadingTask(true);
    const res = await http.get(`/call-center/task?user_id=${user_id}`);

    setState({
      ...res.data,

      columnOrder: [0, 1, 2, 3],
    });

    // console.log(state);
    setLoadingTask(false);
  };

  const [_user, _setUser] = useState<any>();

  const fetchUserData = async () => {
    await http.get(`/call-center/user/${user_id}`).then((res) => {
      _setUser(res.data);
      if (!res.data) {
        notFound();
      }
    });
  };

  const [archiveCalls, setArchiveCalls] = useState([]);
  const [loadingArchive, setLoadigArchive] = useState(false);
  const fetchArchiveCalls = async () => {
    setLoadigArchive(true);
    await http
      .get(`/call-center/task/archive/${user_id}`)
      .then((res) => {
        setArchiveCalls(res.data);
      })
      .finally(() => setLoadigArchive(false));
  };

  useEffect(() => {
    const quots = getRandomRelaxingQuote();
    setQuots(quots);
    fetchTask();
    console.log(state);
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchArchiveCalls();
  }, [state]);

  const handlerRemoveTask = async (idToRemove: string) => {
    // Assuming your data is stored in a variable called "state"
    const newData: any = { ...state }; // Copying the original data

    // Finding the index of the task to remove within the "tasks" array
    const taskIndexToRemove = newData.tasks.findIndex(
      (task: any) => task.id === idToRemove
    );

    if (taskIndexToRemove !== -1) {
      // If the task with the given ID is found
      // Removing the task from the "tasks" array
      newData.tasks.splice(taskIndexToRemove, 1);

      // Removing the task ID from the "taskIds" array in each column
      for (const columnId in newData.columns) {
        newData.columns[columnId].taskIds = newData.columns[
          columnId
        ].taskIds.filter((taskId: any) => taskId !== taskIndexToRemove);
      }

      // Now you can set the state with the new data
      // For example, if you're using React with setState:
      setState(newData);
      await http
        .put("/call-center/task", {
          user_id: user_id,
          data: newData,
        })
        .then((res) => console.log(res.data));
    }
  };

  const getTaskById = (taskId: any) => {
    if (Array.isArray(state.tasks)) {
      return state.tasks.find((task: any) => task.id === taskId) || null;
    } else {
      return null;
    }
  };

  const router = useRouter();

  return (
    <div className="px-[50px]">
      <div className="py-[20px] flex justify-between items-center"></div>
      {isManage && (
        <div className="py-[20px] flex justify-between items-center">
          {_user && (
            <div>
              <span className="font-bold text-[18px]">{`${_user?.name.firstName}'s Task`}</span>
            </div>
          )}
          {!_user && (
            <div>
              <Skeleton className="w-[120px] h-[20px]" />
            </div>
          )}
          <div>
            <Button
              onClick={() =>
                router.push(`/dashboard/call-center/archive/${user_id}`)
              }
              variant="ghost"
            >
              <ArchiveIcon className="mr-[5px]" size={20} /> Archive Calls{" "}
              {`(${archiveCalls.length})`}
            </Button>

            <Button variant="ghost">
              <ExternalLink className="size-[20px] mr-[10px]" /> View Report
            </Button>
          </div>
        </div>
      )}
      {!isManage && (
        <div className="py-[20px] mt-[20px]">
          {user && (
            <div className="flex justify-between">
              <div>
                <h1 className="text-[22px] font-bold">
                  Welcome back,{" "}
                  {`${user?.name.first_name} ${user?.name.last_name.charAt(
                    0
                  )}.`}{" "}
                  👋
                </h1>
                <p className="text-[14px] font-medium text-gray-500">{quots}</p>
              </div>

              <Button
                onClick={() =>
                  router.push(`/dashboard/call-center/archive/${user_id}`)
                }
                variant="ghost"
              >
                <ArchiveIcon className="mr-[5px]" size={20} /> Archive Calls{" "}
                {`(${archiveCalls.length})`}
              </Button>
            </div>
          )}
          {!user && (
            <div className="space-y-[10px]">
              <Skeleton className="w-[300px] h-[20px]" />
              <Skeleton className="w-[400px] h-[20px]" />
            </div>
          )}
        </div>
      )}

      <div className="py-[10px]">
        <Button
          disabled={loadingTask}
          onClick={async () => {
            await fetchTask();
          }}
          size="sm"
          variant="ghost"
          className="flex items-center text-[14px]"
        >
          <RefreshCwIcon
            className={cn(
              "mr-[10px] size-[15px] ",
              loadingTask && "animate-spin"
            )}
          />{" "}
          Refresh
        </Button>
      </div>

        {loadingTask && (
          <div className="flex justify-between w-full space-x-[30px] items-center h-full">
            <div className="flex flex-col">
              <Skeleton className="h-[40px]  w-[300px]" />
              <Skeleton className="h-screen mt-[10px] w-[300px]" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-[40px]  w-[300px]" />
              <Skeleton className="h-screen mt-[10px] w-[300px]" />
            </div>
            <div className="flex flex-col">
              <Skeleton className="h-[40px]  w-[300px]" />
              <Skeleton className="h-screen mt-[10px] w-[300px]" />
            </div>
          </div>
        )}
        <ScrollArea className=" md:w-[95%]">
        <ScrollBar orientation="horizontal" />

        {!loadingTask && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex  justify-between space-x-[20px] w-full ">
              {state.columnOrder.map((columnId: any) => {
                const column = state.columns[columnId];
                const tasks = state.tasks
                  ? column.taskIds.map((taskId: any) => getTaskById(taskId))
                  : [];
                return (
                  <Column
                    removeTask={(id) => handlerRemoveTask(id)}
                    callBack={async () => {
                      await fetchTask();
                    }}
                    state={state}
                    key={column?.id}
                    col={column}
                    tasks={tasks}
                    label={column?.title}
                    color={column?.color}
                  />
                );
              })}
            </div>
          </DragDropContext>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default UserTaskLayout;

const task: InitialData = {
  user_id: "1111",
  tasks: {
    "1": {
      id: 1,
      title: "Mahaweli farm",
      contactNo: "0701611337",
    },
    "2": {
      id: 2,
      title: "prabath harshana",
      contactNo: "0701622930",
      note: "hey there this is",
      metaData: {
        companyName: "Nexsine",
        color: "red-400",
      },
    },
    "3": {
      id: 3,
      title: "pio motors",
      contactNo: "0701622930",
      metaData: {
        companyName: "Nexsine",
      },
    },
    "4": {
      id: 4,
      title: "mobile service",
      contactNo: "0701622930",
      metaData: {
        companyName: "Nexsine",
      },
    },
    "5": {
      id: 5,
      title: "mass luxury",
      contactNo: "0701622930",
      metaData: {
        companyName: "Nexsine",
      },
    },
    "6": {
      id: 6,
      title: "telesonic",
      contactNo: "0701622930",
      metaData: {
        companyName: "Nexsine",
      },
    },
  },
  columns: {
    "colum-1": {
      id: "colum-1",
      color: "primary/20",
      title: "TODO",
      taskIds: [1, 2, 3, 4, 5, 6],
    },
    "colum-2": {
      id: "colum-2",
      color: "red-200",
      title: "No Answer",
      taskIds: [],
    },
    "colum-3": {
      id: "colum-3",
      color: "green-200",
      title: "Positive",
      taskIds: [],
    },
    "colum-4": {
      id: "colum-4",
      color: "red-300",
      title: "Negative",
      taskIds: [],
    },
    "colum-5": {
      id: "colum-5",
      color: "gray-300",
      title: "Have",
      taskIds: [],
    },
  },
  columnOrder: ["colum-1", "colum-2", "colum-3", "colum-4", "colum-5"],
};
