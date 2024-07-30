import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profile: string;
      accessToken: string;
      email: string;
      role: string;
      name: {
        first_name: string;
        last_name: string;
      };
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    id: string;

    profile: string;
    accessToken: string;
    email: string;
    role: string;
    name: {
      first_name: string;
      last_name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    profile: string;
    accessToken: string;
    email: string;
    role: string;
    name: {
      first_name: string;
      last_name: string;
    };
  }
}
