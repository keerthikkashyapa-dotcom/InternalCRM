"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    CheckSquare,
    Settings,
    LogOut,
    ChevronRight,
    Users2
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import { getProfile } from "@/app/dashboard/settings/actions";

export function Sidebar() {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        getProfile()
            .then(p => {
                console.log("Sidebar: Profile loaded", p?.role);
                setRole(p?.role || 'team_member'); // Default to team_member to prevent total link loss if role missing
            })
            .catch(err => {
                console.error("Sidebar profile fetch error:", err);
                setRole('team_member');
            });
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Users, label: "Customers", href: "/dashboard/customers" },
        { icon: Briefcase, label: "Deals", href: "/dashboard/deals" },
        { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
        ...(role === 'admin' || role === 'manager' ? [{ icon: Users2, label: "Team", href: "/dashboard/team" }] : []),
    ];

    return (
        <div className="fixed left-6 top-6 bottom-6 w-64 glass rounded-[2.5rem] flex flex-col p-6 border-primary/10 shadow-2xl overflow-hidden">
            {/* Logo Section */}
            <Link href="/" className="mb-10 px-2 flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <Image src="/Logo.png" alt="Logo" width={40} height={40} className="rounded-xl shadow-lg shadow-primary/20" />
                <span className="font-extrabold text-[#0F172A] tracking-tight text-lg">Manage Your Business Here</span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 5 }}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                        ? "bg-[#0F172A] text-white shadow-xl shadow-[#0F172A]/10"
                                        : "hover:bg-primary/5 text-[#0F172A]/60 hover:text-[#0F172A]"
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div layoutId="active-indicator">
                                        <ChevronRight className="w-4 h-4 text-primary" />
                                    </motion.div>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Section / Bottom Actions */}
            <div className="pt-6 border-t border-[#0F172A]/5 space-y-2">
                <Link href="/dashboard/settings">
                    <div className="flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-[#0F172A]/60 hover:bg-primary/5 hover:text-[#0F172A] transition-all cursor-pointer">
                        <Settings className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wide">Settings</span>
                    </div>
                </Link>
                <form action={logout}>
                    <button
                        type="submit"
                        className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-orange-500 hover:bg-orange-50 transition-all cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wide">Logout</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
