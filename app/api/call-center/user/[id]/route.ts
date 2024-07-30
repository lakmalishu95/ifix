import { dbConnect } from "@/lib/db";
import callCenter from "@/model/call-center";
import user from "@/model/user";
import { useParams } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();

  const data = await callCenter.findOne({ userId: params.id });

  if (!data) return Response.json(null);

  const userData = await user.findOne({ _id: data.userId }, { password: 0 });

  return Response.json(userData, { status: 200 });

  try {
    return Response.json({ id: params.id }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
