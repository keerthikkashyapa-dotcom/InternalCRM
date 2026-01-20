"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Image src="/Logo.png" alt="Logo" width={40} height={40} className="rounded-xl" />
          <span className="text-xl font-extrabold text-[#0F172A] hidden sm:block">Manage Your Business Here</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          <Link href="#support" className="hover:text-primary transition-colors">Support</Link>
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
