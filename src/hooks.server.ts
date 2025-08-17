import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get("sb-access-token");

  // If accessing /dashboard and not signed in, redirect to /
  if (event.url.pathname.startsWith("/dashboard") && !accessToken) {
    throw redirect(307, "/");
  }

  // If accessing / and signed in, redirect to /dashboard
  if (event.url.pathname === "/" && accessToken) {
    throw redirect(307, "/dashboard");
  }

  return resolve(event);
};
