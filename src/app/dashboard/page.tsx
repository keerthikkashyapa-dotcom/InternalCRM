"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    Briefcase, 
    CheckSquare, 
    TrendingUp, 
    ArrowUpRight, 
    Activity as ActivityIcon,
    Loader2,
    X,
    DollarSign
} from "lucide-react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { getDashboardStats, getTeamHierarchy } from "./dashboard-actions";
import { HierarchyTree } from "@/components/crm/team/HierarchyTree";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStage, setSelectedStage] = useState<any>(null);

    useEffect(() => {
        Promise.all([
            getDashboardStats(),
            getTeamHierarchy()
        ]).then(([statsData, teamData]) => {
            setStats(statsData);
            setTeam(teamData);
            setLoading(false);
        });
    }, []);

    const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#6366F1', '#EF4444'];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-[#0F172A]/40 font-bold uppercase tracking-widest text-xs">Loading analytics...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <ActivityIcon className="w-12 h-12 text-red-500 opacity-20" />
                <p className="text-[#0F172A]/40 font-bold uppercase tracking-widest text-xs">Failed to load workspace stats.</p>
                <Link href="/dashboard/settings" className="text-primary font-black text-sm uppercase tracking-widest hover:underline">Check Workspace Settings</Link>
            </div>
        );
    }

    const statCards = [
        { 
            label: "Total Customers", 
            value: stats.totalCustomers, 
            icon: Users, 
            color: "text-blue-500", 
            bg: "bg-blue-500/10",
            href: "/dashboard/customers"
        },
        { 
            label: "Active Deals", 
            value: stats.activeDealsCount, 
            amount: `$${(stats.activeDealValue || 0).toLocaleString()}`,
            icon: Briefcase, 
            color: "text-orange-500", 
            bg: "bg-orange-500/10",
            href: "/dashboard/deals"
        },
        { 
            label: "Pending Tasks", 
            value: stats.pendingTasksCount, 
            icon: CheckSquare, 
            color: "text-indigo-500", 
            bg: "bg-indigo-500/10",
            href: "/dashboard/tasks"
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Welcome Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tight mb-2">Workspace Overview</h1>
                    <p className="text-[#0F172A]/40 font-bold uppercase tracking-[0.2em] text-xs ml-1">
                        Real-time business performance analytics
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                    <TrendingUp className="w-4 h-4" />
                    <span>System Live</span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass bg-white/40 p-8 rounded-[2.5rem] border border-primary/5 hover:border-primary/20 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-14 h-14 ${card.bg} rounded-[1.5rem] flex items-center justify-center`}>
                                <card.icon className={`w-7 h-7 ${card.color}`} />
                            </div>
                            <Link 
                                href={card.href}
                                className="p-2 hover:bg-[#0F172A]/5 rounded-xl transition-colors cursor-pointer"
                            >
                                <ArrowUpRight className="w-5 h-5 text-[#0F172A]/20 group-hover:text-primary transition-colors" />
                            </Link>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[#0F172A]/40 font-black uppercase tracking-widest text-[10px]">{card.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-black text-[#0F172A]">{card.value}</h3>
                                {card.amount && <span className="text-sm font-bold text-green-600">{card.amount}</span>}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Pipeline Bar Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-8 glass bg-white/30 rounded-[3rem] p-8 border border-primary/5 h-[450px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div>
                            <h3 className="text-xl font-black text-[#0F172A]">Sales Pipeline</h3>
                            <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">Deals by Stage (Click bars for details)</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={stats.dealsByStage}
                                onClick={(data: any) => {
                                    if (data && data.activePayload) {
                                        setSelectedStage(data.activePayload[0].payload);
                                    }
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0F172A10" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#0F172A40', fontSize: 10, fontWeight: 'bold' }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#0F172A40', fontSize: 10, fontWeight: 'bold' }}
                                    tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                />
                                <Tooltip 
                                    formatter={(value: any) => [`$${value.toLocaleString()}`, "Total Value"]}
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                                        borderRadius: '20px', 
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                    }}
                                    cursor={{ fill: '#0F172A05' }}
                                />
                                <Bar dataKey="amount" radius={[10, 10, 0, 0]} barSize={40} className="cursor-pointer">
                                    {(stats.dealsByStage || []).map((entry: any, index: number) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                            fillOpacity={0.8}
                                            className="hover:fill-opacity-100 transition-all cursor-pointer"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4 glass bg-white/30 rounded-[3rem] p-8 border border-primary/5 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-[#0F172A]/5 rounded-xl flex items-center justify-center">
                            <ActivityIcon className="w-5 h-5 text-[#0F172A]/40" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#0F172A]">Recent Activity</h3>
                            <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">Workspace Logs</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar max-h-[400px]">
                        {stats.recentActivities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-10 opacity-30">
                                <ActivityIcon className="w-10 h-10" />
                                <p className="text-xs font-bold uppercase tracking-widest">No logs yet</p>
                            </div>
                        ) : (
                            stats.recentActivities.map((log: any) => (
                                <div key={log.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-24px] before:w-[2px] before:bg-[#0F172A]/5 last:before:hidden">
                                    <div className="absolute left-[-4px] top-2 w-[10px] h-[10px] rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                    <p className="text-[10px] font-black text-[#0F172A]/20 uppercase tracking-[0.2em] mb-1">
                                        {(() => {
                                            try {
                                                const d = new Date(log.created_at);
                                                return isNaN(d.getTime()) ? 'Recent' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            } catch {
                                                return 'Recent';
                                            }
                                        })()}
                                    </p>
                                    <div className="glass bg-white/40 p-3 rounded-2xl border border-primary/5">
                                        <p className="text-xs font-bold text-[#0F172A]">
                                            <span className="text-primary">{log.user?.full_name || 'System'}</span> {log.action} {log.entity_type}
                                        </p>
                                        <p className="text-[10px] font-bold text-[#0F172A]/40 mt-1 truncate">
                                            {log.details?.title || log.details?.name || (log.entity_id ? log.entity_id.toString().slice(0,8) : 'ID unknown')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Team Hierarchy Visualization */}
            {stats?.role !== 'team_member' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass bg-white/30 rounded-[3rem] p-8 border border-primary/5"
                >
                    <HierarchyTree team={team} />
                </motion.div>
            )}

            {/* Team Productivity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass bg-white/30 rounded-[3rem] p-8 border border-primary/5"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#0F172A]">Team Productivity</h3>
                            <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">Tasks Completed per Member</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {(stats.teamProductivity || []).map((member: any) => (
                            <div key={member.name} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-sm font-bold text-[#0F172A]">{member.name}</span>
                                    <span className="text-xs font-black text-primary uppercase tracking-widest">
                                        {member.completed}/{member.total} Tasks
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-[#0F172A]/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(member.completed / (member.total || 1)) * 100}%` }}
                                        className="h-full bg-primary shadow-[0_0_15px_rgba(255,107,0,0.3)]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Task Priority Distribution (Small Pie Chart) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass bg-white/30 rounded-[3rem] p-8 border border-primary/5 flex flex-col items-center justify-center"
                >
                     <div className="self-start flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#0F172A]">Closure Rate</h3>
                            <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">Efficiency Analytics</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-[#0F172A]">
                                    {(() => {
                                        const completed = stats.teamProductivity?.reduce((acc: any, m: any) => acc + (m.completed || 0), 0) || 0;
                                        const total = stats.teamProductivity?.reduce((acc: any, m: any) => acc + (m.total || 0), 0) || 0;
                                        return total > 0 ? Math.round((completed / total) * 100) : 0;
                                    })()}%
                                </span>
                                <span className="text-[10px] font-bold text-[#0F172A]/40 uppercase tracking-widest">Average</span>
                            </div>
                            <ResponsiveContainer width={240} height={240}>
                                <PieChart>
                                    <Pie
                                        data={stats.dealsByStage || []}
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(stats.dealsByStage || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stage Details Modal */}
            <AnimatePresence>
                {selectedStage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStage(null)}
                            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl glass bg-white/90 rounded-[3rem] p-10 border border-primary/10 shadow-2xl overflow-hidden"
                        >
                            <button 
                                onClick={() => setSelectedStage(null)}
                                className="absolute top-8 right-8 p-2 hover:bg-[#0F172A]/5 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-[#0F172A]/40" />
                            </button>

                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center">
                                    <Briefcase className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#0F172A]">{selectedStage.name} Deals</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">{(selectedStage.value || 0)} Active Items</span>
                                        <div className="w-1 h-1 rounded-full bg-[#0F172A]/10" />
                                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">${(selectedStage.amount || 0).toLocaleString()} Total Value</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                {(!selectedStage.deals || selectedStage.deals.length === 0) ? (
                                    <div className="py-20 text-center opacity-30">
                                        <p className="font-bold uppercase tracking-[0.2em] text-xs">No deals in this stage</p>
                                    </div>
                                ) : (
                                    selectedStage.deals.map((deal: any) => (
                                        <div key={deal.id} className="glass bg-white/50 p-6 rounded-3xl border border-primary/5 hover:border-primary/20 transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-xs font-black text-primary">
                                                    {deal.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-[#0F172A] group-hover:text-primary transition-colors">{deal.name}</h4>
                                                    <p className="text-[10px] font-bold text-[#0F172A]/40 uppercase tracking-widest">
                                                        {deal.customer?.full_name || 'No Customer'} • {deal.customer?.company_name || 'No Company'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 justify-end text-green-600">
                                                    <DollarSign className="w-3 h-3" />
                                                    <span className="font-black text-lg">{deal.value.toLocaleString()}</span>
                                                </div>
                                                <Link 
                                                    href="/dashboard/deals" 
                                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
