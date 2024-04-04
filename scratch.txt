
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {

   const res = NextResponse.next()

    const supabase = createMiddlewareClient({ req, res });

    const { data: { session } } = await supabase.auth.getSession();

    const path = req.nextUrl.pathname;

    const isAuthenticated = session;

    if (isAuthenticated && path==="/") {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }


    if (!isAuthenticated && path.startsWith('/dashboard') ) 
      {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    
    return NextResponse.next();

}