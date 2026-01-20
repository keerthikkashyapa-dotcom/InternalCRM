"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    CheckCircle2, 
    Clock, 
    Circle, 
    Edit3, 
    MessageSquare,
    User,
    Calendar,
    Tag,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Task, TaskStatus, updateTaskStatus, getTeamMembers } from "@/app/dashboard/tasks/actions";

interface ViewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onRefresh?: () => void;
}

export function ViewTaskModal({ isOpen, onClose, task, onRefresh }: ViewTaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState("");
    const [team, setTeam] = useState<any[]>([]);
    const [targetStatus, setTargetStatus] = useState<TaskStatus | null>(null);

    useEffect(() => {
        if (isOpen && task) {
            getTeamMembers().then(setTeam);
            setComment("");
            setTargetStatus(null);
        }
    }, [isOpen, task]);

    const handleStatusChange = async (newStatus: TaskStatus) => {
        if (!task) return;
        
        setLoading(true);
        setTargetStatus(newStatus);
        
        // Add comment if provided
        if (comment.trim()) {
            // Here we would typically save the comment to a comments table
            // For now, we'll just log it and include it in the activity
            console.log(`Comment for task ${task.id}: ${comment}`);
        }
        
        const result = await updateTaskStatus(task.id, newStatus);
        
        if (result.success && onRefresh) {
            onRefresh();
        }
        
        setLoading(false);
        setTargetStatus(null);
        onClose();
    };

    if (!task) return null;

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'In Progress': return <Clock className="w-5 h-5 text-blue-500" />;
            case 'Pending': return <Circle className="w-5 h-5 text-[#0F172A]/20" />;
        }
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'In Progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'Pending': return 'bg-orange-500/10 text-orange-600 border-orange-200';
        }
    };

    const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
        switch (currentStatus) {
            case 'Pending': return 'In Progress';
            case 'In Progress': return 'Completed';
            case 'Completed': return 'Pending'; // Allow reopening completed tasks
        }
    };

    const getPreviousStatus = (currentStatus: TaskStatus): TaskStatus | null => {
        switch (currentStatus) {
            case 'Pending': return null;
            case 'In Progress': return 'Pending';
            case 'Completed': return 'In Progress';
        }
    };

    const nextStatus = getNextStatus(task.status);
    const previousStatus = getPreviousStatus(task.status);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-2xl glass bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 border border-primary/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {getStatusIcon(task.status)}
                                        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                                            {task.title}
                                        </h2>
                                    </div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${getStatusColor(task.status)}`}>
                                        <span>{task.status}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-[#0F172A]/5 rounded-xl transition-colors text-[#0F172A]/40"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Task Details */}
                            <div className="space-y-6 mb-8">
                                {task.description && (
                                    <div className="glass bg-white/50 p-6 rounded-2xl border border-primary/5">
                                        <h3 className="text-sm font-black text-[#0F172A]/40 uppercase tracking-widest mb-3">
                                            Description
                                        </h3>
                                        <p className="text-[#0F172A]">{task.description}</p>
                                    </div>
                                )}

                                {/* Task Metadata */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="glass bg-white/50 p-4 rounded-2xl border border-primary/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest">
                                                Assigned To
                                            </span>
                                        </div>
                                        <p className="font-bold text-[#0F172A]">
                                            {task.assignee?.full_name || "Unassigned"}
                                        </p>
                                    </div>

                                    <div className="glass bg-white/50 p-4 rounded-2xl border border-primary/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest">
                                                Priority
                                            </span>
                                        </div>
                                        <p className="font-bold text-[#0F172A] capitalize">{task.priority}</p>
                                    </div>

                                    {task.due_date && (
                                        <div className="glass bg-white/50 p-4 rounded-2xl border border-primary/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest">
                                                    Due Date
                                                </span>
                                            </div>
                                            <p className="font-bold text-[#0F172A]">
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Comments Section */}
                                <div className="glass bg-white/50 p-6 rounded-2xl border border-primary/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                        <h3 className="text-sm font-black text-[#0F172A]/40 uppercase tracking-widest">
                                            Add Comment
                                        </h3>
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment about this task status change..."
                                        className="w-full p-4 bg-white/70 border border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-medium resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-primary/10">
                                {task.status === 'Completed' ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleStatusChange('In Progress')}
                                            disabled={loading}
                                            className="flex-1 py-4 bg-blue-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading && targetStatus === 'In Progress' ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Clock className="w-5 h-5" />
                                                    <span>Reopen as In Progress</span>
                                                </>
                                            )}
                                        </motion.button>
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleStatusChange('Pending')}
                                            disabled={loading}
                                            className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading && targetStatus === 'Pending' ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Circle className="w-5 h-5" />
                                                    <span>Reopen as Pending</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </>
                                ) : nextStatus ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleStatusChange(nextStatus)}
                                        disabled={loading}
                                        className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading && targetStatus === nextStatus ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Edit3 className="w-5 h-5" />
                                                <span>Mark as {nextStatus}</span>
                                            </>
                                        )}
                                    </motion.button>
                                ) : (
                                    <div className="flex-1 py-4 bg-green-500/10 text-green-600 font-bold rounded-2xl border border-green-200 flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Task Completed</span>
                                    </div>
                                )}

                                <button
                                    onClick={onClose}
                                    className="px-6 py-4 border-2 border-[#0F172A]/10 text-[#0F172A] font-bold rounded-2xl hover:bg-[#0F172A]/5 transition-colors"
                                >
                                    Close
                                </button>
                            </div>

                            {loading && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-[3rem] flex items-center justify-center">
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                        <span className="font-bold text-[#0F172A]">Updating task...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}