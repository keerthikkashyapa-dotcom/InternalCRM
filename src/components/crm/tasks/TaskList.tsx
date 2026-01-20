"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CheckCircle2, 
    Circle, 
    Clock, 
    AlertCircle, 
    User, 
    Calendar,
    Trash2,
    Plus,
    Loader2
} from "lucide-react";
import { Task, TaskStatus, updateTaskStatus, deleteTask } from "@/app/dashboard/tasks/actions";

interface TaskListProps {
    tasks: Task[];
    onRefresh?: () => void;
    showAddButton?: boolean;
    onAddClick?: () => void;
}

export function TaskList({ tasks, onRefresh, showAddButton, onAddClick }: TaskListProps) {
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleToggleStatus = async (task: Task) => {
        setUpdatingId(task.id);
        const newStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        const result = await updateTaskStatus(task.id, newStatus);
        setUpdatingId(null);
        if (result.success && onRefresh) onRefresh();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this task?")) return;
        const result = await deleteTask(id);
        if (result.success && onRefresh) onRefresh();
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-500 bg-red-500/10';
            case 'Medium': return 'text-orange-500 bg-orange-500/10';
            case 'Low': return 'text-blue-500 bg-blue-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-[#0F172A]/40 uppercase tracking-widest">Tasks & Follow-ups</h3>
                {showAddButton && (
                    <button 
                        onClick={onAddClick}
                        className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-10 glass rounded-[2rem] border-primary/5">
                    <CheckCircle2 className="w-10 h-10 text-orange-500/20 mx-auto mb-2" />
                    <p className="text-[#0F172A]/40 font-bold text-sm">No tasks assigned yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group glass p-4 rounded-3xl border transition-all flex items-start space-x-4
                                    ${task.status === 'Completed' ? 'bg-green-500/5 border-green-500/10' : 'bg-white/40 border-primary/5 hover:border-primary/20'}
                                `}
                            >
                                <button 
                                    onClick={() => handleToggleStatus(task)}
                                    disabled={updatingId === task.id}
                                    className="mt-1 shrink-0"
                                >
                                    {updatingId === task.id ? (
                                        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                                    ) : task.status === 'Completed' ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-[#0F172A]/20 group-hover:text-orange-500 transition-colors" />
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold text-sm truncate ${task.status === 'Completed' ? 'text-[#0F172A]/30 line-through' : 'text-[#0F172A]'}`}>
                                        {task.title}
                                    </p>
                                    {task.description && (
                                        <p className="text-xs text-[#0F172A]/50 mt-1 line-clamp-1">{task.description}</p>
                                    )}
                                    
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tight ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        
                                        {task.due_date && (
                                            <div className="flex items-center text-[10px] font-bold text-[#0F172A]/40">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </div>
                                        )}

                                        {task.assignee && (
                                            <div className="flex items-center text-[10px] font-bold text-[#0F172A]/40">
                                                <User className="w-3 h-3 mr-1" />
                                                {task.assignee.full_name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleDelete(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
