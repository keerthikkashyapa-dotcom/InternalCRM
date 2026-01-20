"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
    Settings, 
    User, 
    Building2, 
    Shield, 
    Bell, 
    Mail, 
    Save, 
    Loader2,
    CheckCircle2,
    AlertCircle,
    Lock
} from "lucide-react";
import { getProfile, updateProfile, updateWorkspace, changePassword } from "./actions";

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'workspace' | 'security' | 'notifications'>('profile');
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingWorkspace, setSavingWorkspace] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [workspaceError, setWorkspaceError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [workspaceSuccess, setWorkspaceSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        setLoading(false);
    };

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileError(null);
        setProfileSuccess(false);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        if (result.error) {
            setProfileError(result.error);
        } else {
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        }
        setSavingProfile(false);
    };

    const handleUpdateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSavingWorkspace(true);
        setWorkspaceError(null);
        setWorkspaceSuccess(false);

        const formData = new FormData(e.currentTarget);
        const result = await updateWorkspace(formData);

        if (result.error) {
            setWorkspaceError(result.error);
        } else {
            setWorkspaceSuccess(true);
            setTimeout(() => setWorkspaceSuccess(false), 3000);
            loadData(); // Refresh to get new workspace name
        }
        setSavingWorkspace(false);
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordError(null);
        setPasswordSuccess(false);

        const formData = new FormData(e.currentTarget);
        const result = await changePassword(formData);

        if (result.error) {
            setPasswordError(result.error);
        } else {
            setPasswordSuccess(true);
            (e.target as HTMLFormElement).reset();
            setTimeout(() => setPasswordSuccess(false), 3000);
        }
        setSavingPassword(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-[#0F172A]/40 font-bold uppercase tracking-widest text-xs">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10">
            {/* Prominent Centered Logo */}
            <div className="flex justify-center mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="group"
                >
                    <div className="relative">
                        <Image 
                            src="/Logo-pages.png" 
                            alt="Manage Your Business Here Logo" 
                            width={160} 
                            height={160} 
                            className="rounded-3xl shadow-2xl shadow-primary/60 group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 rounded-3xl bg-primary/40 blur-3xl -z-10"></div>
                    </div>
                </motion.div>
            </div>
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Settings</h1>
                </div>
                <p className="text-[#0F172A]/40 font-bold uppercase tracking-[0.2em] text-xs ml-1">
                    Personalize your workspace & profile
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-3 space-y-2">
                    {[
                        { icon: User, label: "Profile", id: 'profile' },
                        { icon: Building2, label: "Workspace", id: 'workspace', hidden: profile?.role === 'team_member' },
                        { icon: Shield, label: "Security", id: 'security' },
                        { icon: Bell, label: "Notifications", id: 'notifications' },
                    ].filter(item => !item.hidden).map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                                activeTab === item.id ? 'bg-[#0F172A] text-white shadow-xl' : 'text-[#0F172A]/40 hover:bg-[#0F172A]/5'
                            }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-9 space-y-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div 
                                key="profile"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="glass bg-white/30 rounded-[3rem] p-10 border border-primary/5 space-y-8"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary text-2xl font-black">
                                        {profile?.full_name?.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#0F172A]">My Profile</h3>
                                        <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">Update your identity</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 group-focus-within:text-orange-500 transition-colors" />
                                                <input 
                                                    name="fullName"
                                                    defaultValue={profile?.full_name}
                                                    className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20 transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 opacity-60">
                                            <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Email Address (Read-only)</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20" />
                                                <input 
                                                    disabled
                                                    value={profile?.email}
                                                    className="w-full bg-[#0F172A]/5 border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm font-bold cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        {profileError && (
                                            <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{profileError}</span>
                                            </div>
                                        )}
                                        {profileSuccess && (
                                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Profile updated!</span>
                                            </div>
                                        )}
                                        <button 
                                            disabled={savingProfile}
                                            className="ml-auto bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#0F172A]/20 disabled:opacity-50"
                                        >
                                            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            <span>Save Changes</span>
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'workspace' && (profile?.role === 'admin' || profile?.role === 'manager') && (
                            <motion.div 
                                key="workspace"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="glass bg-white/30 rounded-[3rem] p-10 border border-primary/5 space-y-8"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-orange-500/10 rounded-[1.5rem] flex items-center justify-center text-orange-600">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#0F172A]">Workspace Settings</h3>
                                        <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">Global organizational settings</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateWorkspace} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Company Name</label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 group-focus-within:text-orange-500 transition-colors" />
                                            <input 
                                                name="workspaceName"
                                                defaultValue={profile?.workspace?.name}
                                                className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        {workspaceError && (
                                            <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{workspaceError}</span>
                                            </div>
                                        )}
                                        {workspaceSuccess && (
                                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Workspace updated!</span>
                                            </div>
                                        )}
                                        <button 
                                            disabled={savingWorkspace}
                                            className="ml-auto bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
                                        >
                                            {savingWorkspace ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            <span>Update Workspace</span>
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div 
                                key="security"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="glass bg-white/30 rounded-[3rem] p-10 border border-primary/5 space-y-8"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-red-500/10 rounded-[1.5rem] flex items-center justify-center text-red-600">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#0F172A]">Security</h3>
                                        <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">Update your password</p>
                                    </div>
                                </div>

                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">New Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 group-focus-within:text-red-500 transition-colors" />
                                                <input 
                                                    name="password"
                                                    type="password"
                                                    required
                                                    className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500/20 transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Confirm New Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 group-focus-within:text-red-500 transition-colors" />
                                                <input 
                                                    name="confirmPassword"
                                                    type="password"
                                                    required
                                                    className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500/20 transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        {passwordError && (
                                            <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{passwordError}</span>
                                            </div>
                                        )}
                                        {passwordSuccess && (
                                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Password updated!</span>
                                            </div>
                                        )}
                                        <button 
                                            disabled={savingPassword}
                                            className="ml-auto bg-red-500 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                                        >
                                            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            <span>Update Password</span>
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div 
                                key="notifications"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="glass bg-white/30 rounded-[3rem] p-10 border border-primary/5 space-y-8"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center text-blue-600">
                                        <Bell className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#0F172A]">Notifications</h3>
                                        <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">Stay updated</p>
                                    </div>
                                </div>
                                <div className="p-10 border-2 border-dashed border-primary/10 rounded-[2.5rem] text-center">
                                    <Bell className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                                    <p className="text-sm font-bold text-[#0F172A]/40">Notification preferences coming soon</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Role Display */}
                    <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-orange-500" />
                            <div>
                                <p className="text-[10px] font-black text-orange-500/40 uppercase tracking-widest">Account Authority</p>
                                <p className="text-sm font-bold text-[#0F172A] capitalize">{profile?.role} Access</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-[#0F172A]/20 uppercase tracking-widest">ID: {profile?.id?.slice(0, 8)}...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
