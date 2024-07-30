import { dbConnect } from "@/lib/db";
import User from "@/model/user";
import bcrypt from "bcryptjs";

export const PUT = async (req: Request) => {
  await dbConnect();

  const { id, password } = await req.json();

  try {
    if (!id)
      return Response.json({ error: "User Id is required!" }, { status: 400 });

    const hashedPass = await bcrypt.hash(password, 5);

    const updateResult = await User.updateOne(
      { _id: id },
      {
        password: hashedPass,
      }
    );

    if (!updateResult)
      return Response.json({ error: "Something wrong" }, { status: 400 });

    return Response.json(
      { message: "success", data: updateResult },
      { status: 200 }
    );
  } catch (er) {
    console.error(er);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
};
