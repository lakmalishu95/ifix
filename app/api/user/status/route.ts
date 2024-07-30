import { dbConnect } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import user from "@/model/user";
import { NextRequest } from "next/server";

export const POST = async (req: Request) => {
  await dbConnect();
  const { status, user_id } = await req.json();

  if (!user_id) return Response.json({ erro: "Some11" }, { status: 400 });
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // Month is zero-based (0 = January, 1 = February, etc.)
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();

  const date = `${currentYear}-${currentMonth + 1}-${currentDay}`;
  const time = `${currentHour}:${currentMinute}:${currentSecond}`;

  try {
    const res = await user.updateOne(
      { _id: user_id },
      {
        online: status,
        lastseen: `${date} ${time}`,
      }
    );

    if (!res) return Response.json({ erro: "Some" }, { status: 400 });

    return Response.json(res, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  await dbConnect();
  const searchParams = req.nextUrl.searchParams;
  const user_id = searchParams.get("user_id");

  if (!user_id) return Response.json({ erro: "Some11" }, { status: 400 });

  try {
    const data = await user.findOne(
      { _id: user_id },
      { online: 1, lastseen: 1 }
    );

    if (!data) return Response.json({ erro: "Some" }, { status: 400 });

    return Response.json(data, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
};
