import { dbConnect } from "@/lib/db";
import callCenterTask from "@/model/call-center-task";
import user from "@/model/user";

interface UserData {
  [userId: string]: {
    name: string;
    profile: string;
  };
}

interface TaskData {
  name: string;
  profile: string;
  _id: string;
  readyCalls: number;
  positiveCalls: number;
  confirmCalls: number;
  noAnswerCalls: number;
}

export const GET = async (): Promise<Response> => {
  try {
    // Connect to the database
    await dbConnect();

    // Retrieve all call center tasks
    const tasks: any[] = await callCenterTask.find({});

    // Fetch user data for all tasks in parallel
    const userIds: string[] = tasks.map((task) => task.user_id);
    const userDataMap: UserData = await fetchUserData(userIds);

    // Calculate task counts concurrently
    const userData: TaskData[] = tasks.map((task) => ({
      name: userDataMap[task.user_id].name,
      profile: userDataMap[task.user_id].profile,
      _id: task.user_id,
      readyCalls: getTaskCountByLabel(task, "Ready"),
      positiveCalls: getTaskCountByLabel(task, "Positive"),
      confirmCalls: getTaskCountByLabel(task, "Confirm"),
      noAnswerCalls: getTaskCountByLabel(task, "No Answer"),
    }));

    // Respond with user task counts
    return Response.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};

async function fetchUserData(userIds: string[]): Promise<UserData> {
  const users: any[] = await user.find({ _id: { $in: userIds } });
  const userDataMap: UserData = {};
  users.forEach((user) => {
    userDataMap[user._id] = { name: user.name, profile: user.profile };
  });
  return userDataMap;
}

function getTaskCountByLabel(task: any, label: string): number {
  // Create a map of label counts for each task
  const labelCounts: { [label: string]: number } = {};
  task.columns.forEach((col: any) => {
    labelCounts[col.title] = col.taskIds.length;
  });
  return labelCounts[label] || 0;
}