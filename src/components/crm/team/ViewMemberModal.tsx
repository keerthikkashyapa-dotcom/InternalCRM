"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Shield, UserCircle, Briefcase, CheckSquare, Calendar, BadgeCheck } from "lucide-react";

interface ViewMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: any;
}

export function ViewMemberModal({ isOpen, onClose, member }: ViewMemberModalProps) {
    if (!member) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white/90 backdrop-blur-xl border-l border-primary/10 shadow-2xl z-[101] p-10 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Member Profile</h2>
                                <p className="text-sm font-bold text-[#0F172A]/40 uppercase tracking-widest">Workspace Personnel</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-[#0F172A]/5 rounded-2xl transition-colors text-[#0F172A]/40"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-8">
                            {/* Profile Header Card */}
                            <div className="p-8 glass bg-indigo-500/5 border-indigo-500/10 rounded-[2.5rem] flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-500/20 mb-4">
                                    {member.full_name?.charAt(0) || "?"}
                                </div>
                                <h3 className="text-2xl font-black text-[#0F172A] mb-1">{member.full_name}</h3>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                    member.role === 'admin' 
                                        ? 'bg-red-500/10 text-red-600' 
                                        : member.role === 'manager'
                                            ? 'bg-orange-500/10 text-orange-600'
                                            : 'bg-green-500/10 text-green-600'
                                }`}>
                                    <Shield className="w-3 h-3" />
                                    {member.role === 'admin' ? 'Admin' : member.role === 'manager' ? 'Manager' : 'Team Member'}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest ml-4">Contact Information</h4>
                                <div className="p-5 rounded-2xl bg-white border border-[#0F172A]/5 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shadow-sm">
                                        <Mail className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Email Address</div>
                                        <div className="font-bold text-[#0F172A]">{member.email}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hierarchy */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest ml-4">Reporting Hierarchy</h4>
                                <div className="p-5 rounded-2xl bg-white border border-[#0F172A]/5 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shadow-sm">
                                        <UserCircle className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Reporting To</div>
                                        <div className="font-bold text-[#0F172A]">
                                            {(() => {
                                                if (member.role === 'admin') return "Workspace Owner";
                                                
                                                const manager = Array.isArray(member.manager) ? member.manager[0] : member.manager;
                                                const hasManager = !!manager?.full_name;

                                                if (member.role === 'manager') {
                                                    return "Admin";
                                                } else {
                                                    return "Manager";
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Overview */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest ml-4">Performance Statistics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center justify-center text-center space-y-2">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <CheckSquare className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Assigned Tasks</div>
                                            <div className="text-xl font-black text-[#0F172A]">{member.tasks?.[0]?.count || 0}</div>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 flex flex-col items-center justify-center text-center space-y-2">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Briefcase className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Active Deals</div>
                                            <div className="text-xl font-black text-[#0F172A]">{member.deals?.[0]?.count || 0}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="pt-6 flex items-center justify-between border-t border-[#0F172A]/5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#0F172A]/20" />
                                    <span className="text-[10px] font-black text-[#0F172A]/20 uppercase tracking-[0.1em]">Joined {new Date(member.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="w-4 h-4 text-indigo-500" />
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Verified Workspace User</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-[#0F172A]/5">
                            <button
                                onClick={onClose}
                                className="w-full py-5 bg-[#0F172A] text-white font-black rounded-2xl shadow-xl shadow-[#0F172A]/20 hover:shadow-[#0F172A]/30 transition-all active:scale-[0.98]"
                            >
                                Close Profile
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
