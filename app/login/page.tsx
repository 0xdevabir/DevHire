"use client";

import { loginClient } from "@/lib/auth";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const hasSession = document.cookie.includes("devhire_session=1");
        if (hasSession) {
            router.replace("/dashboard");
        }
    }, [router]);

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        if (!cleanEmail || !cleanPassword) {
            setError("Please enter both email and password.");
            return;
        }

        loginClient(cleanEmail);
        router.replace("/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <form onSubmit={handleLogin} className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold">Welcome to DevHire</h1>
                <p className="mt-1 text-sm text-slate-600">Sign in to search and shortlist GitHub developers.</p>

                <label className="mt-6 block text-sm font-medium text-slate-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
                    placeholder="recruiter@example.com"
                />

                <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
                    placeholder="********"
                />

                {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

                <button type="submit" className="mt-5 w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800">
                    Sign In
                </button>
            </form>
        </div>
    );
}