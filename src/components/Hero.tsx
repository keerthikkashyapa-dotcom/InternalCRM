"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                        Internal CRM & Ops Platform
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold text-[#0F172A] leading-tight mb-8"
                >
                    Internal Operations, <br />
                    <span className="text-primary">Redefined.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-[#0F172A]/70 max-w-2xl mb-12"
                >
                    A powerful, minimalist management tool designed for startup founders and small teams.
                    Centralize your customers, deals, and daily operations in one beautiful glassmorphic hub.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
                >
                    <Link href="/signup">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center space-x-2"
                        >
                            <span>Create Workspace</span>
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>

                    <Link href="#features">
                        <button className="px-8 py-4 text-[#0F172A] font-bold hover:text-primary transition-colors">
                            Explore Features
                        </button>
                    </Link>
                </motion.div>

                {/* Decorative Grid Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-20 w-full max-w-5xl glass rounded-[2.5rem] h-64 md:h-[400px] relative overflow-hidden flex items-center justify-center"
                >
                    <div className="absolute inset-x-0 top-0 h-12 bg-white/40 flex items-center px-6 space-x-2 border-b border-white/20">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex flex-col items-center space-y-4 opacity-30">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20" />
                        <div className="h-4 w-48 rounded bg-[#0F172A]/10" />
                        <div className="h-4 w-32 rounded bg-[#0F172A]/5" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
