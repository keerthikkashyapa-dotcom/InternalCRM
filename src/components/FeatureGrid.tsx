"use client";

import { motion } from "framer-motion";
import { Users, BarChart3, CheckSquare, Cloud } from "lucide-react";

const features = [
    {
        title: "Customer Tracking",
        description: "Keep all your contact data in one place with workspace-level isolation.",
        icon: Users,
    },
    {
        title: "Visual Pipelines",
        description: "Manager your sales cycles with a modern, glassmorphic Kanban board.",
        icon: BarChart3,
    },
    {
        title: "Task Management",
        description: "Assign duties and track completion across your entire team.",
        icon: CheckSquare,
    },
    {
        title: "Media Storage",
        description: "Securely upload and manage documents via our dedicated FastAPI backend.",
        icon: Cloud,
    },
];

export function FeatureGrid() {
    return (
        <section id="features" className="py-20 px-6 bg-white/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-[#0F172A] mb-4">Everything You Need.</h2>
                    <p className="text-[#0F172A]/70">Built for speed, styled for the future.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass p-8 rounded-[2rem] flex flex-col items-start text-left group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                            <p className="text-[#0F172A]/60 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
