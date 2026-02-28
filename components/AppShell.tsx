"use client";

import { logoutClient } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/developers", label: "Developers" },
  { href: "/shortlist", label: "Shortlist" },
];

const navIcons: Record<string, React.ReactNode> = {
  "/dashboard": (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  ),
  "/developers": (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  "/shortlist": (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  ),
};

export default function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  // Desktop: expanded/collapsed. Mobile: open/closed overlay.
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      {/* Mobile: slides in as overlay. Desktop: fixed sidebar with collapse. */}
      <aside
        style={{ backgroundColor: "var(--brand-navy)" }}
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          w-60
          md:translate-x-0 md:z-30
          ${sidebarOpen ? "md:w-60" : "md:w-[68px]"}
        `}
      >
        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <div className="flex h-16 items-center gap-3 px-4">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: "var(--brand-teal)" }}
            >
              D
            </div>
            {/* Always show text on mobile drawer; respect sidebarOpen on desktop */}
            <span className="text-lg font-semibold tracking-tight text-white">
              DevHire
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="mx-4 border-t border-white/10" />

        {/* Nav Links */}
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="shrink-0">{navIcons[item.href]}</span>
                {/* Always show label on mobile; respect collapse on desktop */}
                <span className="inline md:hidden">{item.label}</span>
                {sidebarOpen && <span className="hidden md:inline">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) + Logout */}
        <div className="space-y-1 border-t border-white/10 p-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white md:flex"
          >
            <svg
              className={`h-[18px] w-[18px] shrink-0 transition-transform ${
                sidebarOpen ? "" : "rotate-180"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
            {sidebarOpen && <span>Collapse</span>}
          </button>
          <button
            onClick={() => {
              logoutClient();
              setMobileOpen(false);
              router.replace("/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
          >
            <svg
              className="h-[18px] w-[18px] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            <span className="inline md:hidden">Logout</span>
            {sidebarOpen && <span className="hidden md:inline">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ml-0 ${
          sidebarOpen ? "md:ml-60" : "md:ml-[68px]"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="mr-3 rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h2 className="text-sm font-semibold capitalize text-gray-900 sm:text-base">
            {pathname.split("/").filter(Boolean).pop() || "Dashboard"}
          </h2>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: "var(--brand-teal)" }}
          >
            R
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
