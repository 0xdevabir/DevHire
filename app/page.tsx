import { authCookieName } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(authCookieName)?.value === "1";

  redirect(hasSession ? "/dashboard" : "/login");
}