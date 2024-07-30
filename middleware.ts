import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authRoutes, publicRoutes } from "./routes";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const isAuth = await getToken({ req });

    const { nextUrl } = req;

    const pathname = nextUrl.pathname;

    const isPublicRoute = publicRoutes.includes(pathname);

    const isAuthRoute = authRoutes.includes(pathname);

    if (isAuthRoute) {
      return NextResponse.next();
    }

    if (isPublicRoute) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);
