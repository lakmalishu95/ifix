import { dbConnect } from "@/lib/db";
import User from "@/model/user";

export const PUT = async (req: Request) => {
  await dbConnect();

  const { profile, _id } = await req.json();

  try {
    if (!_id) {
      return Response.json({ error: "Something wrong id" }, { status: 400 });
    }

    const update = await User.updateOne(
      { _id: _id },
      {
        profile: profile,
      }
    );

    if (!update) {
      console.log("eee");
      return Response.json({ error: "Something wrong" }, { status: 400 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
