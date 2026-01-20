"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { requestPasswordReset } from "@/app/auth/actions";
import { Navbar } from "@/components/Navbar";

export default function ForgotPasswordPage() {
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
                        <Link href="/" className="mb-6 hover:opacity-80 transition-opacity">
                            <Image src="/Logo.png" alt="Logo" width={64} height={64} className="rounded-2xl shadow-xl shadow-primary/20" />
                        </Link>
                        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">
                            Reset Password
                        </h1>
                        <p className="text-[#0F172A]/50 text-sm px-4">
                            Enter your email address and we'll send you a link to reset your password
                        </p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center ${
                            message.includes('sent') ? 'bg-green-500/10 border border-green-500/20 text-green-600' : 'bg-primary/10 border border-primary/20 text-primary'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form action={requestPasswordReset} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0F172A] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@company.com"
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
                            <span>Send Reset Link</span>
                            <Send className="w-4 h-4" />
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#0F172A]/5 text-center">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-[#0F172A]/50 hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
