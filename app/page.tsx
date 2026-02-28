import { authCookieName } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(authCookieName)?.value === "1";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "var(--brand-teal)" }}
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "var(--brand-navy)" }}
      />

      <main className="relative w-full max-w-3xl rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-8 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: "var(--teal-light)", color: "var(--teal-dark)" }}
          >
            DevHire Platform
          </p>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-5xl">
            Find and shortlist top GitHub developers, faster.
          </h1>
          <p className="mt-4 text-sm leading-6 text-gray-600 md:text-base">
            Search profiles, review repositories, and keep recruitment decisions organized in one clean workspace.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login?intent=signup"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--brand-teal)" }}
            >
              Get Started
            </Link>
            <Link
              href={hasSession ? "/dashboard" : "/login"}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}