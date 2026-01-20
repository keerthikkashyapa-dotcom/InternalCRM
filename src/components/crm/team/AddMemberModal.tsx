"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Mail, Shield, Lock, Loader2, AlertCircle } from "lucide-react";
import { addTeamMember } from "@/app/dashboard/team/actions";

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    managers?: any[];
}

export function AddMemberModal({ isOpen, onClose, onSuccess, managers = [] }: AddMemberModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await addTeamMember(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            if (onSuccess) onSuccess();
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-[60]"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[70] p-6"
                    >
                        <div className="glass bg-white/90 p-8 rounded-[3rem] border border-white/50 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Add Member</h2>
                                    <p className="text-sm font-bold text-[#0F172A]/40 uppercase tracking-widest">Expansion in progress</p>
                                </div>
                                <button onClick={onClose} className="p-3 hover:bg-[#0F172A]/5 rounded-2xl transition-colors">
                                    <X className="w-5 h-5 text-[#0F172A]/40" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Full Name</label>
                                    <input 
                                        name="fullName" 
                                        required 
                                        placeholder="John Doe"
                                        className="w-full bg-white/50 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20" />
                                        <input 
                                            name="email" 
                                            type="email"
                                            required 
                                            placeholder="name@company.com"
                                            className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Role</label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 pointer-events-none" />
                                            <select 
                                                name="role" 
                                                className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                                            >
                                                <option value="team_member">Team Member</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 pointer-events-none" />
                                            <input 
                                                name="password" 
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Reporting To (Manager)</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 pointer-events-none" />
                                        <select 
                                            name="managerId" 
                                            className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                                        >
                                            <option value="none">No Manager</option>
                                            {managers.map(m => (
                                                <option key={m.id} value={m.id}>{m.full_name} ({m.role === 'admin' ? 'Admin' : 'Manager'})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-2xl">
                                        <AlertCircle className="w-4 h-4" />
                                        <p className="text-xs font-bold">{error}</p>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-indigo-500 text-white font-black py-5 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            <span>Add Member</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
