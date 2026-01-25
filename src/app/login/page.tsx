"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { login } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
                    {/* Subtle Accent Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full -z-10" />

                    <div className="flex flex-col items-center mb-10 text-center">
                        <Link href="/" className="mb-6 hover:opacity-80 transition-opacity group">
                            <div className="relative">
                                <Image src="/Logo-pages.png" alt="Logo" width={72} height={72} className="rounded-2xl shadow-2xl shadow-primary/40 group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl -z-10"></div>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-[#0F172A]/50 text-sm">
                            Please enter your credentials to access the CRM
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold text-center">
                            {message}
                        </div>
                    )}

                    <form action={login} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0F172A] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white/40 border border-[#0F172A]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] placeholder:text-[#0F172A]/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-[#0F172A]">Password</label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#0F172A]/5">
                        <div className="text-center space-y-4">
                            <p className="text-sm text-[#0F172A]/50">
                                Don&apos;t have a workspace yet?
                            </p>
                            <Link href="/signup" className="block">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className="w-full py-3 border-2 border-[#0F172A]/10 text-[#0F172A] font-bold rounded-2xl hover:bg-[#0F172A]/5 transition-colors"
                                >
                                    Create New Workspace
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

export default function LoginPage() {
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
            <LoginForm />
        </Suspense>
    );
}
