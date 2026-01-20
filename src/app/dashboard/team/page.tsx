"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    Users2, 
    Shield, 
    Mail, 
    Briefcase, 
    CheckSquare,
    Loader2,
    Search,
    ChevronRight,
    BadgeCheck,
    UserCircle,
    UserPlus,
    AlertCircle
} from "lucide-react";
import { getTeamDetails, assignManager } from "./actions";
import { AddMemberModal } from "@/components/crm/team/AddMemberModal";
import { ViewMemberModal } from "@/components/crm/team/ViewMemberModal";

export default function TeamPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [repairing, setRepairing] = useState(false);

    const loadTeam = () => {
        setLoading(true);
        getTeamDetails().then(data => {
            if (data?.error) {
                setErrorState(data.error);
            } else if (data?.team) {
                setTeam(data.team);
                setErrorState(null);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        loadTeam();
    }, []);

    const handleRepair = async () => {
        setRepairing(true);
        const { repairWorkspace } = await import('./actions');
        const result = await repairWorkspace();
        if (result.success) {
            loadTeam();
        } else {
            alert(result.error);
        }
        setRepairing(false);
    };

    const handleAssignManager = async (memberId: string, managerId: string) => {
        setUpdatingId(memberId);
        const val = managerId === "none" ? null : managerId;
        const result = await assignManager(memberId, val);
        if (result.success) {
            loadTeam();
        }
        setUpdatingId(null);
    };

    const handleViewMember = (member: any) => {
        setSelectedMember(member);
        setIsViewModalOpen(true);
    };

    const managers = team.filter(m => m.role === 'admin' || m.role === 'manager');

    const filteredTeam = team.filter(member => 
        member.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        member.email?.toLowerCase().includes(search.toLowerCase()) ||
        member.role?.toLowerCase().includes(search.toLowerCase())
    );

    if (errorState) {
        const isMissing = errorState === 'PROFILE_MISSING' || errorState === 'WORKSPACE_MISSING';
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <div className={`w-20 h-20 ${isMissing ? 'bg-orange-100' : 'bg-red-100'} rounded-[2rem] flex items-center justify-center mb-6`}>
                    <AlertCircle className={`w-10 h-10 ${isMissing ? 'text-orange-500' : 'text-red-500'}`} />
                </div>
                <h2 className="text-3xl font-black text-[#0F172A] mb-2">
                    {isMissing ? 'Workspace Required' : 'System Error'}
                </h2>
                <p className="text-[#0F172A]/50 max-w-md mb-8 font-medium">
                    {isMissing 
                        ? 'Your account session exists, but your workspace data was not found. This usually happens after a database reset.'
                        : `A technical error occurred: ${errorState}. Please try refreshing the page or contact support if the issue persists.`}
                </p>
                {isMissing ? (
                    <button 
                        onClick={handleRepair}
                        disabled={repairing}
                        className="bg-[#0F172A] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[#0F172A]/20 disabled:opacity-50 flex items-center gap-3"
                    >
                        {repairing ? <Loader2 className="w-5 h-5 animate-spin" /> : <BadgeCheck className="w-5 h-5" />}
                        <span>Initialize My Workspace</span>
                    </button>
                ) : (
                    <button 
                        onClick={loadTeam}
                        className="bg-[#0F172A] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[#0F172A]/20"
                    >
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-[#0F172A]/40 font-bold uppercase tracking-widest text-xs">Loading team directory...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Users2 className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Team Members</h1>
                        </div>
                        <p className="text-[#0F172A]/40 font-bold uppercase tracking-[0.2em] text-xs ml-1">
                            Manage workspace access and performance
                        </p>
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#0F172A]/90 transition-all shadow-xl shadow-[#0F172A]/10 hover:shadow-[#0F172A]/20"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Member</span>
                    </button>
                </div>

                <div className="relative group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/20 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or role..."
                        className="w-full bg-white/50 border border-primary/10 rounded-2xl pl-11 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeam.map((member, index) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass bg-white/40 rounded-[2.5rem] border border-primary/5 hover:border-primary/20 transition-all group overflow-hidden"
                    >
                        <div className="p-8 space-y-6">
                            {/* Avatar & Role */}
                            <div className="flex items-start justify-between">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/20">
                                    {member.full_name?.charAt(0) || "?"}
                                </div>
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

                            {/* Name & Email */}
                            <div>
                                <h3 className="text-xl font-black text-[#0F172A] group-hover:text-indigo-600 transition-colors">
                                    {member.full_name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 opacity-40">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="text-xs font-bold">{member.email}</span>
                                </div>
                                {member.role !== 'admin' && (
                                    <div className="flex items-center gap-2 mt-2">
                                        {(() => {
                                            const manager = Array.isArray(member.manager) ? member.manager[0] : member.manager;
                                            const hasManager = !!manager?.full_name;
                                            
                                            let reportLabel = "";
                                            if (member.role === 'manager') {
                                                reportLabel = "Reports to Admin";
                                            } else {
                                                reportLabel = "Reports to Manager";
                                            }

                                            return (
                                                <>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${hasManager ? 'bg-indigo-500' : 'bg-orange-500'}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${hasManager ? 'text-indigo-500' : 'text-orange-500'}`}>
                                                        {reportLabel}
                                                    </span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Mini Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#0F172A]/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Active Deals</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-600">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <span className="font-black text-[#0F172A]">{member.deals?.[0]?.count || 0}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Assigned Tasks</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-600">
                                            <CheckSquare className="w-4 h-4" />
                                        </div>
                                        <span className="font-black text-[#0F172A]">{member.tasks?.[0]?.count || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Manager Assignment */}
                            <div className="pt-4 border-t border-[#0F172A]/5 space-y-2">
                                <label className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest flex items-center gap-1.5">
                                    <UserCircle className="w-3 h-3" />
                                    Reporting To
                                </label>
                                <div className="relative group/select">
                                    <select
                                        value={member.manager_id || "none"}
                                        onChange={(e) => handleAssignManager(member.id, e.target.value)}
                                        disabled={updatingId === member.id}
                                        className="w-full bg-[#0F172A]/5 border border-transparent rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none disabled:opacity-50 transition-all cursor-pointer hover:bg-[#0F172A]/10"
                                    >
                                        <option value="none">No Manager</option>
                                        {managers.filter(m => m.id !== member.id).map(m => (
                                            <option key={m.id} value={m.id}>{m.full_name} ({m.role === 'admin' ? 'Admin' : 'Manager'})</option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#0F172A]/20 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div 
                            onClick={() => handleViewMember(member)}
                            className="px-8 py-4 bg-[#0F172A]/5 flex items-center justify-between group-hover:bg-indigo-500/10 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4 text-indigo-500" />
                                <span className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest">View Profile</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#0F172A]/20 group-hover:text-indigo-500 transition-all" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredTeam.length === 0 && (
                <div className="py-20 text-center glass rounded-[3rem] border border-primary/5 opacity-30">
                    <Users2 className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest">No team members found</p>
                </div>
            )}

            <AddMemberModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadTeam}
                managers={managers}
            />

            <ViewMemberModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                member={selectedMember}
            />
        </div>
    );
}
