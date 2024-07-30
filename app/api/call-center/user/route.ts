import { dbConnect } from "@/lib/db";
import CallCenter from "@/model/call-center";
import CallCenterTask from "@/model/call-center-task";
import user from "@/model/user";
import User from "@/model/user";
import { AArrowDown } from "lucide-react";

export const GET = async () => {
  await dbConnect();
  try {
    // Fetch data from CallCenter
    const callCenterData = await CallCenter.find({});

    // Extract userIds from callCenterData
    const userIds = callCenterData.map((entry) => entry.userId);

    // Find users whose IDs match those in userIds
    const users = await User.find({ _id: { $in: userIds } });

    // Return the user data
    return Response.json(users);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};



export const POST = async (req: Request) => {
  await dbConnect();
  const { userId, managerId } = await req.json();

  if (!userId || !managerId)
    return Response.json({ error: "All field are required!" }, { status: 400 });

  try {
    const addRes = await CallCenter.create({
      userId,
      managerId,
    });

    if (!addRes)
      return Response.json({ error: "Something Wrong!" }, { status: 400 });

    // Create Task Data
    const taskData = await CallCenterTask.create({
      user_id: userId,
      tasks: [],
      columnOrder: ["0", "1", "2", "3"],
      columns: [
        {
          id: "0",
          title: "Ready",
          taskIds: [],
        },
        {
          id: "1",
          title: "Positive",
          taskIds: [],
        },
        {
          id: "2",
          title: "No Answer",
          taskIds: [],
        },
        {
          id: "3",
          title: "Confirm",
          taskIds: [],
        },
      ],
    });
    return Response.json(
      { success: "User added successful!", data: addRes, taskData },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
