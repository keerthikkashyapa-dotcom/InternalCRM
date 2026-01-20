"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    Activity, 
    CheckCircle2, 
    FileText, 
    DollarSign, 
    Plus,
    User,
    ArrowRight,
    Loader2
} from "lucide-react";
import { ActivityLog, getActivityTimeline } from "@/app/dashboard/tasks/actions";

interface ActivityTimelineProps {
    customerId: string;
    refreshTrigger?: number;
}

export function ActivityTimeline({ customerId, refreshTrigger }: ActivityTimelineProps) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTimeline();
    }, [customerId, refreshTrigger]);

    const loadTimeline = async () => {
        setLoading(true);
        const data = await getActivityTimeline(customerId);
        setActivities(data);
        setLoading(false);
    };

    const getIcon = (type: string, action: string) => {
        if (action === 'created') return <Plus className="w-4 h-4 text-green-500" />;
        if (action === 'status_change') return <CheckCircle2 className="w-4 h-4 text-orange-500" />;
        
        switch (type) {
            case 'deal': return <DollarSign className="w-4 h-4 text-blue-500" />;
            case 'task': return <CheckCircle2 className="w-4 h-4 text-orange-500" />;
            case 'media': return <FileText className="w-4 h-4 text-purple-500" />;
            default: return <Activity className="w-4 h-4 text-primary" />;
        }
    };

    const formatDetails = (log: ActivityLog) => {
        const { action, entity_type, details } = log;
        const name = details?.title || details?.name || "item";
        
        if (action === 'created') return `Created new ${entity_type}: ${name}`;
        if (action === 'status_change') return `Changed ${entity_type} status to ${details?.new_status || 'updated'}`;
        if (action === 'updated') return `Updated ${entity_type} details`;
        
        return `${action.charAt(0).toUpperCase() + action.slice(1)} ${entity_type}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent" />

            {activities.length === 0 ? (
                <div className="ml-12 text-center py-10 glass rounded-[2rem] border-primary/5">
                    <p className="text-sm font-bold text-[#0F172A]/30">No activity history yet</p>
                </div>
            ) : (
                <div className="space-y-8 relative">
                    {activities.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start space-x-6"
                        >
                            {/* Node */}
                            <div className="relative z-10">
                                <div className="w-12 h-12 glass bg-white rounded-2xl border border-primary/10 flex items-center justify-center shadow-lg shadow-primary/5">
                                    {getIcon(log.entity_type, log.action)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-black text-[#0F172A]/30 uppercase tracking-[0.2em]">
                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <span className="text-[10px] font-bold text-[#0F172A]/20">
                                        {new Date(log.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="glass bg-white/40 p-4 rounded-3xl border border-primary/5 hover:border-primary/10 transition-all">
                                    <p className="text-sm font-bold text-[#0F172A] mb-1">
                                        {formatDetails(log)}
                                    </p>
                                    <div className="flex items-center space-x-2 text-[10px] font-bold text-[#0F172A]/40">
                                        <User className="w-3 h-3" />
                                        <span>{log.user?.full_name || "System"}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
