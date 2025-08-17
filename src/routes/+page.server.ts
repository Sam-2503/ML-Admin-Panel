import { supabase } from "$lib/supabase";
import { redirect, fail } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (!signInError && data.session) {
      // Set cookie with access token (expires in 7 days)
      cookies.set("sb-access-token", data.session.access_token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      });
      console.log("User signed in successfully:", data.user);
      throw redirect(303, "/dashboard");
    }

    return fail(400, {
      error: signInError?.message || "Login failed",
    });
  },
};
