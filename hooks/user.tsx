"use client";
import { useSession } from "next-auth/react";

interface UserTypes {
  id: string;
  image: string;
  accessToken: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "USER" | "SUPERADMIN";
  name: {
    first_name: string;
    last_name: string;
  };
}

export default function useUser() {
  const { data: session } = useSession();

  const user: UserTypes = session?.user as any;
  return { user };
}
