"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Mail, Lock, User, Briefcase, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    const handleContinue = (e: React.FormEvent) => {
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        setFormData({
            fullName: data.get('fullName') as string,
            email: data.get('email') as string,
            password: data.get('password') as string
        });
        setStep(2);
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6 pt-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-xl glass p-10 rounded-[2.5rem] relative overflow-hidden"
                >
                    {/* Subtle Accent Glow */}
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full -z-10" />

                    <div className="flex flex-col items-center mb-10 text-center">
                        <Link href="/" className="mb-6 hover:opacity-80 transition-opacity">
                            <Image src="/Logo.png" alt="Logo" width={64} height={64} className="rounded-2xl shadow-xl shadow-primary/20" />
                        </Link>
                        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">
                            Create Workspace
                        </h1>
                        <p className="text-[#0F172A]/50 text-sm mb-6">
                            Step {step} of 2: {step === 1 ? "Personal Details" : "Organization Info"}
                        </p>
                    </div>

                    <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
                        <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider leading-relaxed">
                            Admin Note: Use this page ONLY to create a new workspace. To add team members to an existing workspace, use the "Team" section in your dashboard.
                        </p>
                    </div>

                    <div className="absolute top-10 right-10 flex space-x-2">
                        <div className={`h-2 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-[#0F172A]/10'}`} />
                        <div className={`h-2 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-[#0F172A]/10'}`} />
                    </div>

                    {message && (
                        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold text-center">
                            {message}
                        </div>
                    )}

                    <form action={signup} className="space-y-6">
                        {step === 1 ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0F172A] ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="fullName"
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-4 bg-white/40 border border-[#0F172A]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0F172A] ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="john@company.com"
                                            className="w-full pl-12 pr-4 py-4 bg-white/40 border border-[#0F172A]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0F172A] ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-4 bg-white/40 border border-[#0F172A]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A]"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="button"
                                    onClick={(e) => {
                                        const form = (e.target as HTMLElement).closest('form');
                                        if (form) handleContinue({ currentTarget: form } as any);
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-[#0F172A] text-white font-bold rounded-2xl shadow-xl shadow-[#0F172A]/10 flex items-center justify-center space-x-2 transition-all"
                                >
                                    <span>Continue to Workspace</span>
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Hidden inputs to preserve Step 1 data */}
                                <input type="hidden" name="fullName" value={formData.fullName} />
                                <input type="hidden" name="email" value={formData.email} />
                                <input type="hidden" name="password" value={formData.password} />

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0F172A] ml-1">Workspace Name</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                        <input
                                            name="workspaceName"
                                            type="text"
                                            required
                                            placeholder="Acme Corp"
                                            className="w-full pl-12 pr-4 py-4 bg-white/40 border border-[#0F172A]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A]"
                                        />
                                    </div>
                                    <p className="text-xs text-[#0F172A]/40 mt-2 flex items-center space-x-1">
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        <span>This will be the name of your organization.</span>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0F172A] ml-1">Your Role</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                                        <select
                                            name="role"
                                            required
                                            defaultValue="admin"
                                            className="w-full pl-12 pr-4 py-4 bg-white/40 border border-[#0F172A]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                            <option value="team_member">Team Member</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="py-4 border-2 border-[#0F172A]/10 text-[#0F172A] font-bold rounded-2xl hover:bg-[#0F172A]/5 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center space-x-2 transition-all"
                                    >
                                        <span>Complete Setup</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </form>

                    <p className="mt-8 text-center text-sm text-[#0F172A]/50">
                        Already have an account? {" "}
                        <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
