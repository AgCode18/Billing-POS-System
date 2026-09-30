"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Lock,
    Mail,
    LogIn,
    Eye,
    EyeOff,
    Store,
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!form.password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const API_URL =
                process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:5000/api";

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: form.email.trim(),
                        password: form.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Invalid email or password."
                );
            }

            /*
             * Agar backend token response body me bhejta hai
             * to localStorage me store karenge.
             *
             * Agar backend httpOnly cookie use karta hai,
             * token store karne ki zarurat nahi hai.
             */

            if (data?.token) {
                localStorage.setItem(
                    "billing_token",
                    data.token
                );
            }

            if (data?.accessToken) {
                localStorage.setItem(
                    "billing_token",
                    data.accessToken
                );
            }

            if (data?.user) {
                localStorage.setItem(
                    "billing_user",
                    JSON.stringify(data.user)
                );
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error("Login failed:", error);

            setError(
                error.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
                        <Store size={26} />
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-gray-900">
                        Billing POS
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Sign in to manage your billing system.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Welcome back
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Enter your credentials to continue.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        handleChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="admin@example.com"
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={form.password}
                                    onChange={(e) =>
                                        handleChange(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            <LogIn size={18} />

                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Billing POS System
                </p>
            </div>
        </div>
    );
}