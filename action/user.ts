import { NewUserSchema } from "@/app/(protected)/dashboard/settigns/schema/new-user-schema";
import { dbConnect } from "@/lib/db";
import User from "@/model/user";
import { z } from "zod";

export const getUsers = async () => {
  await dbConnect();
  try {
    const users = await User.find();

    return { data: users };
  } catch (err) {
    console.error(err);
    return { error: "Server Error" };
  }
};

export const registerUser = async (data: any) => {
  const { email, fname, lname, password, role } =  data;

  try {
    const res = await fetch("/api/user/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        role,
        name: {
          firstName: fname,
          lastName: lname,
        },
      }),
    });

    if (!res.ok) return { error: "Something went wrong" };

    const newUserData = await res.json();
    return { success: "User register done!" };
  } catch (err) {
    console.error(err);

    return { error: "Server error" };
  }
};
