import { dbConnect } from "@/lib/db";
import archiveTask from "@/model/archive-task";
import callCenterTask from "@/model/call-center-task";
import { NextResponse } from "next/server";
export const GET = async () => {
  await dbConnect();
  try {
    const [tasks, archiveTasks] = await Promise.all([
      callCenterTask.find({}),
      archiveTask.find({}),
    ]);

    const [readyCalls, positiveCalls, confirmCalls, noAnswerCalls] =
      await Promise.all([
        countTaskIds(tasks, "Ready"),
        countTaskIds(tasks, "Positive"),
        countTaskIds(tasks, "Confirm"),
        countTaskIds(tasks, "No Answer"),
      ]);

    const archiveCalls = archiveTasks.length;
    const totalCalls =
      readyCalls + archiveCalls + positiveCalls + confirmCalls + noAnswerCalls;

    return NextResponse.json(
      {
        readyCalls,
        positiveCalls,
        confirmCalls,
        totalCalls,
        archiveCalls,
        noAnswerCalls,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

async function countTaskIds(data: any, title: any) {
  let count = 0;
  for (let obj of data) {
    const column = obj.columns.find((column: any) => column.title === title);
    if (column) {
      count += column.taskIds.length;
    }
  }
  return count;
}
