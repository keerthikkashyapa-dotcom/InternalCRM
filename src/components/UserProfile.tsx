"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { User, Shield, Mail, Calendar, LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";

interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export function UserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setLoading(false);
          return;
        }

        // Fetch profile data from API route
        const response = await fetch('/api/user-profile');
        const data = await response.json();

        if (response.ok && data) {
          setUserProfile(data);
        } else {
          console.error('Error fetching user profile:', data.error);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-white/50 rounded-2xl border border-primary/10">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-1">
          <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-16 h-2 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-600';
      case 'manager': return 'bg-orange-500/10 text-orange-600';
      case 'team_member': return 'bg-green-500/10 text-green-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'manager': return '💼';
      case 'team_member': return '👥';
      default: return '👤';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass bg-white/50 backdrop-blur-xl rounded-2xl border border-primary/10 shadow-lg"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
            {userProfile.full_name?.charAt(0)?.toUpperCase() || userProfile.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-[#0F172A] truncate">
              {userProfile.full_name || 'User'}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${getRoleColor(userProfile.role)}`}>
              {getRoleIcon(userProfile.role)} {userProfile.role === 'admin' ? 'Admin' : userProfile.role === 'manager' ? 'Manager' : 'Team Member'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-[#0F172A]/50 font-bold">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{userProfile.email}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#0F172A]/20" />
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Joined {new Date(userProfile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <form action={logout}>
          <button
            type="submit"
            className="p-2 hover:bg-[#0F172A]/5 rounded-xl transition-colors group"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-[#0F172A]/40 group-hover:text-[#0F172A] transition-colors" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}