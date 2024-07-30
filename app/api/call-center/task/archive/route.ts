import { dbConnect } from "@/lib/db";
import archiveTask from "@/model/archive-task";

export const DELETE = async (req: Request) => {
  const { _id } = await req.json();

  await dbConnect();

  try {
    const res = await archiveTask.deleteOne({ _id });
    return Response.json({ success: true }, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
