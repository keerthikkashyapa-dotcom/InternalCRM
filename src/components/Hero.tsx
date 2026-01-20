"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />
            


            {/* Content Container */}
            <div className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-5xl md:text-7xl font-extrabold text-[#0F172A] leading-tight mb-8"
                    >
                        Fashion Forward,<br />
                        <span className="text-primary">Connections Refined.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="text-lg text-[#0F172A]/70 max-w-2xl mb-12"
                    >
                        Hem & Harmony - Where Fashion Meets Connection. Streamline your boutique operations, 
                        nurture customer relationships, and elevate your fashion business with intelligent management tools.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                        <Link href="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center space-x-2"
                            >
                                <span>Launch Boutique</span>
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>

                        <Link href="#features">
                            <button className="px-8 py-4 text-[#0F172A] font-bold hover:text-primary transition-colors">
                                Discover Fashion Tools
                            </button>
                        </Link>
                    </motion.div>

                    {/* Analytics Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="mt-20 w-full max-w-5xl glass rounded-[2.5rem] h-64 md:h-[400px] relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 top-0 h-12 bg-white/40 flex items-center px-6 space-x-2 border-b border-white/20">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        
                        <div className="p-8 pt-16">
                            {/* Header Stats */}
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-primary">247</div>
                                    <div className="text-xs text-[#0F172A]/60 mt-1">Active Customers</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-primary">$12.4K</div>
                                    <div className="text-xs text-[#0F172A]/60 mt-1">Monthly Revenue</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-primary">89%</div>
                                    <div className="text-xs text-[#0F172A]/60 mt-1">Conversion Rate</div>
                                </div>
                            </div>
                            
                            {/* Graph Visualization */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-[#0F172A]">Sales Performance</h3>
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                                    </div>
                                </div>
                                
                                {/* Bar Chart */}
                                <div className="flex items-end justify-between h-32 pt-4">
                                    {[65, 45, 80, 55, 70, 60, 85, 50, 75, 90, 65, 80].map((height, index) => (
                                        <div key={index} className="flex flex-col items-center flex-1 px-1">
                                            <div 
                                                className="w-full bg-gradient-to-t from-blue-400 to-purple-400 rounded-t-lg transition-all duration-500 ease-out"
                                                style={{ height: `${height}%` }}
                                            ></div>
                                            <div className="text-xs text-[#0F172A]/50 mt-2">{['J','F','M','A','M','J','J','A','S','O','N','D'][index]}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Trend Indicators */}
                                <div className="flex justify-between mt-6 text-xs">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        <span className="text-[#0F172A]/70">Current Month</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                        <span className="text-[#0F172A]/70">Previous Month</span>
                                    </div>
                                    <div className="text-[#0F172A]/70">↑ 12.5% growth</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}