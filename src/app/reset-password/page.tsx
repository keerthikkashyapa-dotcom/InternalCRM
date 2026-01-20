"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Lock, Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { updatePassword } from "@/app/auth/actions";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6 pt-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md glass p-10 rounded-[2.5rem] relative overflow-hidden"
                >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full -z-10" />

                    <div className="flex flex-col items-center mb-10 text-center">
                        <Link href="/" className="mb-6 hover:opacity-80 transition-opacity group">
                            <div className="relative">
                                <Image src="/Logo-pages.png" alt="Logo" width={72} height={72} className="rounded-2xl shadow-2xl shadow-primary/40 group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl -z-10"></div>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">
                            New Password
                        </h1>
                        <p className="text-[#0F172A]/50 text-sm px-4">
                            Please enter your new password below
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold text-center">
                            {message}
                        </div>
                    )}

                    <form action={updatePassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0F172A] ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-white/40 border border-[#0F172A]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] placeholder:text-[#0F172A]/30"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-[#0F172A] text-white font-bold rounded-2xl shadow-xl shadow-[#0F172A]/10 hover:shadow-[#0F172A]/20 flex items-center justify-center space-x-2 transition-all"
                        >
                            <span>Update Password</span>
                            <Save className="w-4 h-4" />
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6 pt-32">
                    <div className="w-full max-w-md glass p-10 rounded-[2.5rem]">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-8"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </main>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
