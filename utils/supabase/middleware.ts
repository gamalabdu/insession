import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/auth/confirm", "/pricing"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, origin } = request.nextUrl;

  if (user) {
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
    if (pathname === "/dashboard") return response;
    const { data } = await supabase
      .from("profiles")
      .select("is_enabled")
      .eq("id", user.id)
      .single();
    if (!data?.is_enabled) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  if (
    !user &&
    !PUBLIC_ROUTES.includes(pathname)
    // pathname !== '/'
  ) {
    return NextResponse.redirect(`${origin}/`);
  }

  return response;
}
