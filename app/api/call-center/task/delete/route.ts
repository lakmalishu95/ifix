import { dbConnect } from "@/lib/db";
import CallCenterTask from "@/model/call-center-task";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  await dbConnect();

  const { user_id, tasks, colId } = await req.json();
  try {
    const deletionResult = await CallCenterTask.updateOne(
      { user_id },
      { $pull: { tasks: { id: { $in: tasks } } } }
    );

    const clearTaskIds = await CallCenterTask.updateOne(
      { user_id, "columns._id": colId },
      { $set: { "columns.$.taskIds": [] } }
    );

    if (!deletionResult) {
      return Response.json(
        { message: "No tasks were deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: `Tasks deleted successfully` },
      { status: 200 }
    );
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
