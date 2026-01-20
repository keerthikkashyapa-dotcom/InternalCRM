"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-[#0F172A]/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-sm">
                <div className="flex flex-col items-center md:items-start">
                    <Link href="/" className="flex items-center space-x-2 mb-2 hover:opacity-80 transition-opacity">
                        <Image src="/Logo.png" alt="Logo" width={32} height={32} className="rounded-lg" />
                        <span className="font-extrabold text-lg text-[#0F172A]">Manage Your Business Here</span>
                    </Link>
                    <p className="text-[#0F172A]/50">© 2026 Internal CRM. All rights reserved.</p>
                </div>

                <div className="flex items-center space-x-8">
                    <Link href="#" className="text-[#0F172A]/60 hover:text-primary transition-colors">Privacy</Link>
                    <Link href="#" className="text-[#0F172A]/60 hover:text-primary transition-colors">Terms</Link>
                    <Link href="#" className="text-[#0F172A]/60 hover:text-primary transition-colors">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
