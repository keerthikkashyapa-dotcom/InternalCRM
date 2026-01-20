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

                    {/* Enhanced Analytics Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="mt-20 w-full max-w-6xl glass rounded-[3rem] h-80 md:h-[450px] relative overflow-hidden shadow-2xl shadow-primary/20"
                    >
                        <div className="absolute inset-x-0 top-0 h-12 bg-white/50 flex items-center px-6 space-x-2 border-b border-white/30">
                            <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                        </div>
                        
                        <div className="p-8 pt-16">
                            {/* Enhanced Header Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <motion.div 
                                    className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg rounded-2xl p-5 text-center border border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-3xl font-extrabold text-primary mb-1">342</div>
                                    <div className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Active Clients</div>
                                    <div className="text-xs text-green-600 font-bold mt-1">↗ 18% this month</div>
                                </motion.div>
                                
                                <motion.div 
                                    className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg rounded-2xl p-5 text-center border border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-3xl font-extrabold text-primary mb-1">$18.7K</div>
                                    <div className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Monthly Revenue</div>
                                    <div className="text-xs text-green-600 font-bold mt-1">↗ 24% growth</div>
                                </motion.div>
                                
                                <motion.div 
                                    className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg rounded-2xl p-5 text-center border border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-3xl font-extrabold text-primary mb-1">92%</div>
                                    <div className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Success Rate</div>
                                    <div className="text-xs text-green-600 font-bold mt-1">↗ 5% improvement</div>
                                </motion.div>
                            </div>
                            
                            {/* Enhanced Graph Visualization */}
                            <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">Quarterly Performance</h3>
                                        <p className="text-sm text-[#0F172A]/70">Revenue trends across seasons</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                                            <span className="text-xs font-bold text-[#0F172A]/80">2024</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                                            <span className="text-xs font-bold text-[#0F172A]/80">2023</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Enhanced Interactive Bar Chart */}
                                <div className="flex items-end justify-between h-40 pt-6 relative">
                                    {[75, 55, 90, 65, 80, 70, 95, 60, 85, 98, 72, 88].map((height, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="flex flex-col items-center flex-1 px-0.5 group cursor-pointer"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <motion.div 
                                                className="w-full bg-gradient-to-t from-cyan-400 via-blue-500 to-purple-500 rounded-t-xl shadow-lg relative overflow-hidden"
                                                style={{ height: `${height}%` }}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ duration: 1, delay: index * 0.1, type: "spring", stiffness: 100 }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#0F172A] text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-xl">
                                                    ${Math.round(height * 1.2)}K
                                                </div>
                                            </motion.div>
                                            <div className="text-xs font-bold text-[#0F172A]/70 mt-3 group-hover:text-primary transition-colors duration-300">
                                                {['J','F','M','A','M','J','J','A','S','O','N','D'][index]}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Enhanced Metrics Row */}
                                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
                                            <span className="text-sm font-bold text-[#0F172A]/80">Peak Performance</span>
                                        </div>
                                        <div className="text-lg font-extrabold text-green-600">↑ 32% YoY</div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-[#0F172A]/80">Avg. Monthly</div>
                                            <div className="text-lg font-extrabold text-primary">$15.6K</div>
                                        </div>
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}