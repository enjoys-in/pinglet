import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const access_token = request.cookies.get('token')?.value;

    const isLoginPage = pathname === '/login';
    const isProtectedPath = pathname.startsWith('/dashboard');

    // Case 1: Logged in user accessing login page — redirect to dashboard
    if (access_token && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Case 2: Not logged in and accessing a protected page — redirect to login
    if (!access_token && isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (access_token && isProtectedPath) {
        return NextResponse.next();
    }


    return NextResponse.next();
}

// Configure the middleware to match specific paths
export const config = {
    matcher: [
        '/dashboard/:path*', '/dashboard',
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|service-worker.js|.js|.css|.mp3|.svg).*)'],
}