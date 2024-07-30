import { dbConnect } from "@/lib/db";
import callCenterTask from "@/model/call-center-task";
import CallCenterTask from "@/model/call-center-task";
import Task from "@/model/archive-task";
import { NextRequest } from "next/server";
import archiveTask from "@/model/archive-task";

export const POST = async (req: Request) => {
  try {
    await dbConnect();

    const { data, user_id, colId } = await req.json();
    const prevTask = await callCenterTask.findOne({ user_id });

    const newData = {
      id: prevTask.tasks.length,
      ...data,
    };
    const res = await callCenterTask.updateOne(
      { user_id },
      { $push: { tasks: newData } }
    );

    // Update Colunms

    const task = await callCenterTask.findOne({ user_id });

    const len = task.tasks.length;

    const colUpdate = await callCenterTask.updateOne(
      { user_id, "columns._id": colId },
      { $push: { "columns.$.taskIds": { $each: [len - 1], $position: 0 } } }
    );

    return Response.json(res, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const user_id = searchParams.get("user_id");
  try {
    await dbConnect();

    if (!user_id) {
      return Response.json({ error: "User Id is Required!" }, { status: 400 });
    }

    const data = await CallCenterTask.findOne({ user_id });
    return Response.json(data, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};

// Update
export const PUT = async (req: Request) => {
  try {
    await dbConnect();

    const { user_id, data } = await req.json();

    const transformedColumns = Object.values(data.columns).map(
      (column: any) => ({
        ...column,
        taskIds: column.taskIds.map((taskId: any) => parseInt(taskId, 10)), // Assuming taskIds are stored as strings, convert them to numbers
      })
    );

    const newData = {
      ...data,
      columns: transformedColumns,
    };

    await callCenterTask.updateOne({ user_id }, newData);

    return Response.json(newData, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    await dbConnect();
    const { id, user_id, task_id, colId, userName, lastStatus } =
      await req.json();

    // console.log(id, user_id, task_id, colId);

    const removeIds = await callCenterTask.updateOne(
      { user_id, "columns._id": colId },
      {
        $pull: { "columns.$.taskIds": task_id },
        $pullAll: { tasks: [{ _id: id }] },
      }
    );

    const deletedTask = await callCenterTask.findOne(
      { user_id, "tasks._id": id },
      { "tasks.$": 1 } // Projection to include only the matched task
    );

    // add archive task
    await archiveTask.create({
      user_id,
      id: deletedTask.tasks[0].id,
      title: deletedTask.tasks[0].title,
      notes: deletedTask.tasks[0].notes,
      contacts: deletedTask.tasks[0].contacts,
      metadata: deletedTask.tasks[0].metadata,
      customer: deletedTask.tasks[0].customer,
      createdBy: deletedTask.tasks[0].createdBy,
      deleteUser: userName,
      lastStatus,
      labels: deletedTask.tasks[0].labels,
    });

    await callCenterTask.updateOne(
      { user_id },
      { $pull: { tasks: { _id: id } } }
    );
    return Response.json(removeIds, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
