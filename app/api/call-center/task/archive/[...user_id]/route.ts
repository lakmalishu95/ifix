import { dbConnect } from "@/lib/db";
import archiveTask from "@/model/archive-task";

export const GET = async (
  req: Request,
  { params }: { params: { user_id: string } }
) => {
  const { user_id } = params;

  await dbConnect();
  try {
    const data = await archiveTask.find({ user_id });
    return Response.json(data, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" });
  }
  return Response.json({ user_id: user_id[0] }, { status: 200 });
};

