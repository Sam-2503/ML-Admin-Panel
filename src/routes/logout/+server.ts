import { redirect } from "@sveltejs/kit";

export async function GET({ cookies }) {
  cookies.delete("sb-access-token", { path: "/" });
  throw redirect(303, "/");
}
