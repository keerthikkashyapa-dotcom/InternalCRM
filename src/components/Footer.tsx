"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";
    
    return (
        <footer className="py-12 px-6 border-t border-[#0F172A]/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-sm">
                <div className="flex flex-col items-center md:items-start">
                    <Link href="/" className="flex items-center space-x-3 mb-2 hover:opacity-80 transition-opacity group">
                        <div className="relative">
                            <Image src="/Logo.png" alt="Logo" width={40} height={40} className="rounded-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 rounded-xl bg-primary/10 blur-md -z-10"></div>
                        </div>
                        <span className="font-black text-lg text-[#0F172A] tracking-tight">
                            {isLandingPage ? "Hem & Harmony" : "Manage Your Business Here"}
                        </span>
                    </Link>
                    <p className="text-[#0F172A]/50">© 2026 Internal CRM. All rights reserved.</p>
                </div>

                <div className="flex items-center space-x-8">
                    <a href="#support" className="text-[#0F172A]/60 hover:text-primary transition-colors cursor-pointer">Privacy</a>
                    <a href="#support" className="text-[#0F172A]/60 hover:text-primary transition-colors cursor-pointer">Terms</a>
                    <a href="#support" className="text-[#0F172A]/60 hover:text-primary transition-colors cursor-pointer">Contact</a>
                </div>
            </div>
        </footer>
    );
}
