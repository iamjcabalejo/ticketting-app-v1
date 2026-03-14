import { redirect } from "next/navigation";

/**
 * This app does not use login; /login redirects to home so users
 * are never left on a login page (e.g. from cached or external redirects).
 */
export default function LoginPage() {
  redirect("/");
}
