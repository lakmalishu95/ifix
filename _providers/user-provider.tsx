"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  // const { data: session } = useSession();
  return (
    <SessionProvider>
     {children}
    </SessionProvider>
  );
};
