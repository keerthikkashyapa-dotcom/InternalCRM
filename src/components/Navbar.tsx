"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [envError, setEnvError] = useState<string | null>(null);
  const pathname = usePathname();
  
  const isLandingPage = pathname === "/";

  useEffect(() => {
    // Only create Supabase client on the client side
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    } catch (error) {
      console.error('Supabase client error:', error);
      setEnvError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      {envError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Environment Error:</strong> {envError}
        </div>
      )}
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex-1"></div>
        <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity group mx-auto">
          <div className="relative">
            <Image src="/Logo.png" alt="Logo" width={64} height={64} className="rounded-2xl shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl -z-10"></div>
          </div>
          <span className="text-3xl font-black text-[#0F172A] hidden sm:block tracking-tight">
            {isLandingPage ? "Hem & Harmony" : "Manage Your Business Here"}
          </span>
        </Link>
        <div className="flex-1"></div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          <a href="#support" className="hover:text-primary transition-colors cursor-pointer">Privacy</a>
          <a href="#support" className="hover:text-primary transition-colors cursor-pointer">Terms</a>
          <a href="#support" className="hover:text-primary transition-colors cursor-pointer">Contact</a>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-semibold border-2 border-[#0F172A]/10 rounded-xl hover:bg-[#0F172A]/5 transition-colors"
                >
                  Dashboard
                </motion.button>
              </Link>
              <form action={logout}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                  Logout
                </motion.button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-semibold border-2 border-[#0F172A]/10 rounded-xl hover:bg-[#0F172A]/5 transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
