"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    CheckSquare, 
    Filter, 
    Search, 
    Plus,
    LayoutGrid,
    List as ListIcon,
    Loader2
} from "lucide-react";
import { TaskList } from "@/components/crm/tasks/TaskList";
import { AddTaskModal } from "@/components/crm/tasks/AddTaskModal";
import { getTasks, type Task } from "./actions";
import { TasksExportButton } from "./ExportButton";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        const data = await getTasks();
        setTasks(data);
        setLoading(false);
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             task.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (filter === 'pending') return matchesSearch && task.status !== 'Completed';
        if (filter === 'completed') return matchesSearch && task.status === 'Completed';
        return matchesSearch;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <CheckSquare className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Tasks</h1>
                    </div>
                    <p className="text-[#0F172A]/40 font-bold uppercase tracking-[0.2em] text-xs ml-1">
                        Manage your collaboration & follow-ups
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-[2rem] shadow-2xl shadow-orange-500/20 transition-all flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span>Add New Task</span>
                    </button>
                </div>
            </div>

            {/* Controls Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-orange-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white/70 backdrop-blur-md border border-primary/5 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/20 transition-all font-bold text-[#0F172A] shadow-sm"
                    />
                </div>
                
                <div className="md:col-span-2 flex justify-center">
                    <TasksExportButton />
                </div>
                
                <div className="md:col-span-4 flex p-1 bg-[#0F172A]/5 rounded-[2.5rem]">
                    <button 
                        onClick={() => setFilter('pending')}
                        className={`flex-1 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${filter === 'pending' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'}`}
                    >
                        To Do
                    </button>
                    <button 
                        onClick={() => setFilter('completed')}
                        className={`flex-1 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${filter === 'completed' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'}`}
                    >
                        Done
                    </button>
                    <button 
                        onClick={() => setFilter('all')}
                        className={`flex-1 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'}`}
                    >
                        All
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                    <p className="text-[#0F172A]/40 font-bold uppercase tracking-widest text-xs">Loading tasks...</p>
                </div>
            ) : (
                <div className="glass bg-white/30 rounded-[3rem] p-8 border border-primary/5">
                    <TaskList 
                        tasks={filteredTasks} 
                        onRefresh={loadTasks}
                    />
                </div>
            )}

            <AddTaskModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadTasks}
            />
        </div>
    );
}
