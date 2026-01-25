"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Mail, Calendar, LogOut, ShieldCheck, Info, X } from "lucide-react";
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
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Create Supabase client only on the client side
        const supabase = createClient();
        
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
  }, []);

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
    <>
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
            
            <div className="flex items-center gap-3 text-xs text-[#0F172A]/50 font-bold mb-2">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{userProfile.email}</span>
              </div>
            </div>

            {/* Role-specific details */}
            <div className="text-xs space-y-1">
              {userProfile.role === 'admin' && (
                <div className="flex items-center gap-1 text-red-600">
                  <Shield className="w-3 h-3" />
                  <span className="font-bold">Full System Access</span>
                </div>
              )}
              {userProfile.role === 'manager' && (
                <div className="flex items-center gap-1 text-orange-600">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="font-bold">Team & Deals Management</span>
                </div>
              )}
              {userProfile.role === 'team_member' && (
                <div className="flex items-center gap-1 text-green-600">
                  <User className="w-3 h-3" />
                  <span className="font-bold">Tasks & Customer Access</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-[#0F172A]/40">
                <Calendar className="w-3 h-3" />
                <span>Joined {new Date(userProfile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(true)}
              className="p-2 hover:bg-[#0F172A]/5 rounded-xl transition-colors group"
              title="View Details"
            >
              <Info className="w-4 h-4 text-[#0F172A]/40 group-hover:text-[#0F172A] transition-colors" />
            </button>
            
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
        </div>
      </motion.div>

      {/* Detailed User Modal */}
      <AnimatePresence>
        {showDetails && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[200]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[201]"
            >
              <div className="glass bg-white/90 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-primary/5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-[#0F172A]">User Details</h2>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-2 hover:bg-[#0F172A]/5 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-[#0F172A]/40" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {userProfile.full_name?.charAt(0)?.toUpperCase() || userProfile.email?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#0F172A]">
                        {userProfile.full_name || 'User'}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getRoleColor(userProfile.role)}`}>
                        {getRoleIcon(userProfile.role)} {userProfile.role === 'admin' ? 'Administrator' : userProfile.role === 'manager' ? 'Manager' : 'Team Member'}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0F172A]/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-[#0F172A]/60" />
                        <span className="text-sm font-bold text-[#0F172A]/60">Email Address</span>
                      </div>
                      <p className="text-[#0F172A] font-bold">{userProfile.email}</p>
                    </div>

                    <div className="p-4 bg-[#0F172A]/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-[#0F172A]/60" />
                        <span className="text-sm font-bold text-[#0F172A]/60">Member Since</span>
                      </div>
                      <p className="text-[#0F172A] font-bold">
                        {new Date(userProfile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Role Permissions */}
                    <div className="p-4 bg-[#0F172A]/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-[#0F172A]/60" />
                        <span className="text-sm font-bold text-[#0F172A]/60">Permissions</span>
                      </div>
                      <div className="space-y-2">
                        {userProfile.role === 'admin' && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-red-600">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>Full system administration</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-red-600">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>User management</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-red-600">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>All data access</span>
                            </div>
                          </>
                        )}
                        {userProfile.role === 'manager' && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Team management</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Deal oversight</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Reports access</span>
                            </div>
                          </>
                        )}
                        {userProfile.role === 'team_member' && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Task management</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Customer interactions</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Basic reporting</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}