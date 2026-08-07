"use client";

import { loginClient } from "@/lib/auth";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const router = useRouter();

    useEffect(() => {
        const hasSession = document.cookie.includes("devhire_session=1");
        if (hasSession) {
            router.replace("/dashboard");
        }
    }, [router]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("intent") === "signup") {
            setNotice("New account creation is currently disabled. Please sign in with an existing account.");
        }
    }, []);

    const DEMO_EMAIL = "demo@devhire.com";
    const DEMO_PASSWORD = "demo1234";

    function completeLogin(nextEmail: string) {
        setError("");
        setNotice("");
        loginClient(nextEmail);
        router.replace("/dashboard");
    }

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        if (!cleanEmail || !cleanPassword) {
            setError("Please enter both email and password.");
            return;
        }

        completeLogin(cleanEmail);
    }

    function handleDemoLogin() {
        setEmail(DEMO_EMAIL);
        setPassword(DEMO_PASSWORD);
        completeLogin(DEMO_EMAIL);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form onSubmit={handleLogin} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: 'var(--brand-teal)' }}
                    >
                        D
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">DevHire</h1>
                        <p className="text-xs text-gray-500">Recruitment platform</p>
                    </div>
                </div>

                <p className="text-sm text-gray-500">Sign in to search and shortlist GitHub developers.</p>

                {notice && (
                    <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        {notice}
                    </p>
                )}

                <label className="mt-5 block text-xs font-medium uppercase tracking-wide text-gray-600">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-transparent focus:ring-2"
                    style={{ '--tw-ring-color': 'var(--brand-teal)' } as React.CSSProperties}
                    placeholder="recruiter@example.com"
                />

                <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-gray-600">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-transparent focus:ring-2"
                    style={{ '--tw-ring-color': 'var(--brand-teal)' } as React.CSSProperties}
                    placeholder="********"
                />

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    className="mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: 'var(--brand-teal)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--teal-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-teal)')}
                >
                    Sign In
                </button>

                <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    Demo Login
                </button>
                <p className="mt-2 text-center text-xs text-gray-400">
                    Uses {DEMO_EMAIL} / {DEMO_PASSWORD}
                </p>

                <div className="mt-4 text-center text-sm text-gray-600">
                    New here?{" "}
                    <button
                        type="button"
                        className="font-medium underline underline-offset-2"
                        style={{ color: "var(--brand-teal)" }}
                        onClick={() =>
                            setNotice("New account creation is currently disabled. Please contact your admin for access.")
                        }
                    >
                        Sign Up
                    </button>
                </div>

                <div className="mt-2 text-center">
                    <Link href="/" className="text-xs text-gray-500 hover:text-gray-700">
                        Back to home
                    </Link>
                </div>
            </form>
        </div>
    );
}