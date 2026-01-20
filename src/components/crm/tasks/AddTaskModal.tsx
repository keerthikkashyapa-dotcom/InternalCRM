"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Loader2, User } from "lucide-react";
import { createTask, getTeamMembers, TaskPriority } from "@/app/dashboard/tasks/actions";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId?: string;
    dealId?: string;
    onSuccess?: () => void;
}

export function AddTaskModal({ isOpen, onClose, customerId, dealId, onSuccess }: AddTaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            getTeamMembers().then(setTeam);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        if (customerId) formData.append('customer_id', customerId);
        if (dealId) formData.append('deal_id', dealId);

        const result = await createTask(formData);

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
                                    <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">New Task</h2>
                                    <p className="text-sm font-bold text-[#0F172A]/40 uppercase tracking-widest">Assign Follow-up</p>
                                </div>
                                <button onClick={onClose} className="p-3 hover:bg-[#0F172A]/5 rounded-2xl transition-colors">
                                    <X className="w-5 h-5 text-[#0F172A]/40" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Title</label>
                                    <input 
                                        name="title" 
                                        required 
                                        placeholder="What needs to be done?"
                                        className="w-full bg-white/50 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Description</label>
                                    <textarea 
                                        name="description" 
                                        rows={3}
                                        placeholder="Add details..."
                                        className="w-full bg-white/50 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Assign To</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 pointer-events-none" />
                                            <select 
                                                name="assigned_to" 
                                                className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none"
                                            >
                                                {team.map(member => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.full_name || member.email.split('@')[0]} ({member.role === 'admin' ? 'Admin' : member.role === 'manager' ? 'Manager' : 'Team Member'})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Priority</label>
                                        <select 
                                            name="priority" 
                                            defaultValue="Medium"
                                            className="w-full bg-white/50 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest ml-4">Due Date</label>
                                    <input 
                                        name="due_date" 
                                        type="date"
                                        className="w-full bg-white/50 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    />
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
                                    className="w-full bg-orange-500 text-white font-black py-5 rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Create Task</span>
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
