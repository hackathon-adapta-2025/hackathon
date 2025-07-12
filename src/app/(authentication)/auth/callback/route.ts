import { createClient } from "@/lib/supabaseServer";
import { upsertUser } from "@/models/User";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  let next = requestUrl.searchParams.get("next") ?? "/app";

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (next) {
    const decodedNext = decodeURIComponent(next);
    if (
      decodedNext.startsWith("/") &&
      !decodedNext.startsWith("//") &&
      !decodedNext.includes("..")
    ) {
      next = decodedNext;
    } else {
      try {
        const nextUrlObject = new URL(decodedNext);
        if (nextUrlObject.origin === siteUrl) {
          next =
            nextUrlObject.pathname + nextUrlObject.search + nextUrlObject.hash;
        } else {
          console.warn(
            `Invalid 'next' parameter origin: ${nextUrlObject.origin}. Defaulting to /app.`
          );
          next = "/app";
        }
      } catch (e) {
        console.warn(
          `Invalid 'next' parameter format: ${decodedNext}. Defaulting to /app.`
        );
        next = "/app";
      }
    }
  }

  let redirectToOnboarding = false;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        "Auth code exchange error:",
        error.message,
        error.status,
        error.cause
      );
      return NextResponse.redirect(
        `${siteUrl}/login?error=auth_code_exchange_failed&message=${encodeURIComponent(
          error.message
        )}`
      );
    }

    if (data?.user) {
      try {
        const { hasCompletedOnboarding } = await upsertUser(data.user);

        if (!hasCompletedOnboarding) {
          redirectToOnboarding = true;
        }
      } catch (err: any) {
        console.error(
          "Error saving user to database after OAuth:",
          err.message
        );
        // Decide if this is critical. For now, we'll proceed with login.
      }
    }
  } else {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "Auth callback: No code and no user session found.",
        userError?.message
      );
      return NextResponse.redirect(
        `${siteUrl}/login?error=no_session_in_callback`
      );
    }

    try {
      const { hasCompletedOnboarding } = await upsertUser(user);

      if (!hasCompletedOnboarding) {
        redirectToOnboarding = true;
      }
    } catch (err: any) {
      console.error(
        "Error saving user to database from existing session:",
        err.message
      );
    }
  }

  const redirect = redirectToOnboarding ? "/onboarding" : next;

  console.log(
    `Auth callback successful. Redirecting to: ${siteUrl}${redirect}`
  );
  return NextResponse.redirect(`${siteUrl}${redirect}`);
}
