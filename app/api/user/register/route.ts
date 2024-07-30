import { dbConnect } from "@/lib/db";
import User from "@/model/user";
import { UserTypes } from "@/types/user";
import bcrypt from "bcryptjs";

// Register New user
export const POST = async (req: Request) => {
  await dbConnect();

  const { email, name, password, profile, role, online, lastseen } =
    await req.json();

  if (!email || !password || !name || !role)
    return Response.json({ error: "All field are required!" }, { status: 400 });

  try {
    // Check Email
    const exEmail = await User.findOne({ email: email });

    if (exEmail)
      return Response.json({ error: "Email is alredy used!" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 5);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      profile,
      role,
      online,
      lastseen,
    });
    const newUser = await user.save();

    return Response.json(
      { message: "Successful!", data: newUser },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
};
