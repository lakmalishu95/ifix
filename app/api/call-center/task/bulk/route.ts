import { dbConnect } from "@/lib/db";
import callCenterTask from "@/model/call-center-task";

export const POST = async (req: Request) => {
  await dbConnect();
  try {
    const { data, user_id, colId } = await req.json();

    const prevTask = await callCenterTask.findOne({ user_id });

    data.map(async (item: any, idx: number) => {
      const newData = {
        id: prevTask.tasks.length + idx, // This line assigns an ID based on the length of previous tasks and the current index
        ...item,
      };

      const task = await callCenterTask.findOne({ user_id });

      const res = await callCenterTask.updateOne(
        { user_id },
        { $push: { tasks: newData } }
      );

      // Here, ensure that the task ID matches the index
      const len = prevTask.tasks.length + idx;
      await callCenterTask.updateOne(
        { user_id, "columns._id": colId },
        { $push: { "columns.$.taskIds": { $each: [len], $position: 0 } } }
      );
    });

    return Response.json({}, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
