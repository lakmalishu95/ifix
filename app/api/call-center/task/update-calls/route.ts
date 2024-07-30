import { dbConnect } from "@/lib/db";
import callCenterTask from "@/model/call-center-task";

export const POST = async (req: Request) => {
  try {
    await dbConnect();

    const { user_id, task_id, data } = await req.json();

    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.metadata;

    // Find the task by ID and exclude the _id field from the result
    const taskData = await callCenterTask.findOne(
      { user_id, "tasks._id": task_id },
      { "tasks.$": 1, _id: 0 }
    );

    // Check if the task exists
    if (!taskData || !taskData.tasks || taskData.tasks.length === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    // Extract the task data from the result
    const task = taskData.tasks[0];

    // Update the task data
    const updatedData = await callCenterTask.updateOne(
      { user_id, "tasks._id": task_id },
      {
        $set: {
          "tasks.$.id": data.id,
          "tasks.$.title": data.title,
          "tasks.$.notes": data.notes,
          "tasks.$.contacts": data.contacts,
          "tasks.$.createdBy": data.createdBy,
          "tasks.$.labels": data.labels,
          "tasks.$.calls": data.calls,
        },
      }
    );

    return Response.json(updatedData, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
