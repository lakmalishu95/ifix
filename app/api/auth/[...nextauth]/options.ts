import User from "@/model/user";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Username:",
          type: "email",
          placeholder: "email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "password",
        },
      },
      // Authorize
      async authorize(credentials) {
        await dbConnect();
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          const user = await User.findOne({ email: credentials.email });

          if (!user) return null;

          const checkPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!checkPassword) return null;

          const data = {
            id: user._id,
            accessToken: "1234",
            email: user.email,
            profile: user.profile,
            role: user.role,
            name: {
              first_name: user.name.firstName,
              last_name: user.name.lastName,
            },
          };
          return data;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.email = user.email;
        token.role = user.role;
        token.picture = user.profile;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.profile = token.profile;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
};
