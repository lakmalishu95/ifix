import { dbConnect } from "@/lib/db";
import CallCenterTask from "@/model/call-center-task";

export const POST = async (req: Request) => {
  const { columns } = await req.json();

  try {
    await dbConnect();

    const res = await CallCenterTask.create({
      columns,
    });

    return Response.json(res, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
