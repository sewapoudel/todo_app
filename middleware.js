// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Allow access to login and register pages for all users
    if (pathname === '/login' || pathname === '/register') {
        return NextResponse.next();
    }

    // Allow access to the home and task page without any authentication
    if (pathname === '/' || pathname === '/task') {
        return NextResponse.next();
    }

    // Redirect to login for all other routes
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
