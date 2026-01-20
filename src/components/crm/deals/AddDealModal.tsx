"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutDashboard, DollarSign, Calendar, User, Loader2, Info, FileText, Trash2, Edit2, ListTodo } from "lucide-react";
import { createDeal, updateDeal, deleteDeal, type Deal } from "@/app/dashboard/deals/actions";
import { getCustomers, type Customer } from "@/app/crm/actions";
import { useState, useEffect } from "react";
import { MediaDropzone } from "../media/MediaDropzone";
import { MediaGallery } from "../media/MediaGallery";
import { TaskList } from "../tasks/TaskList";
import { AddTaskModal } from "../tasks/AddTaskModal";
import { getTasks, type Task } from "@/app/dashboard/tasks/actions";

interface AddDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    deal?: Deal | null;
    mode?: 'add' | 'edit' | 'view';
}

export function AddDealModal({ isOpen, onClose, deal, mode = 'add' }: AddDealModalProps) {
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [currentMode, setCurrentMode] = useState<'add' | 'edit' | 'view'>(mode);
    const [activeTab, setActiveTab] = useState<'info' | 'docs' | 'tasks'>('info');
    const [refreshMedia, setRefreshTrigger] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    useEffect(() => {
        if (isOpen && deal && (activeTab === 'tasks')) {
            loadTasks();
        }
    }, [isOpen, deal, activeTab]);

    const loadTasks = async () => {
        if (!deal) return;
        setLoadingTasks(true);
        const data = await getTasks({ dealId: deal.id });
        setTasks(data);
        setLoadingTasks(false);
    };

    const isViewMode = currentMode === 'view';

    const [formData, setFormData] = useState({
        name: "",
        value: "",
        close_date: "",
        customer_id: "",
        stage: "New"
    });

    useEffect(() => {
        if (isOpen) {
            getCustomers().then(setCustomers);
            setCurrentMode(mode);
            setActiveTab('info');
            
            if (deal) {
                setFormData({
                    name: deal.name || "",
                    value: deal.value?.toString() || "",
                    close_date: deal.close_date || "",
                    customer_id: deal.customer_id || "",
                    stage: deal.stage || "New"
                });
            } else {
                setFormData({
                    name: "",
                    value: "",
                    close_date: "",
                    customer_id: "",
                    stage: "New"
                });
            }
        }
    }, [isOpen, deal, mode]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const form = e.currentTarget;
        const data = new FormData(form);
        
        let result;
        if (deal) {
            result = await updateDeal(deal.id, data);
        } else {
            result = await createDeal(data);
        }
        
        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            onClose();
        }
    }

    async function handleDelete() {
        if (!deal || !confirm("Are you sure you want to delete this deal?")) return;
        
        setDeleteLoading(true);
        const result = await deleteDeal(deal.id);
        setDeleteLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            onClose();
        }
    }

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
                        className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white/90 backdrop-blur-xl border-l border-primary/10 shadow-2xl z-[101] p-10 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                                    {isViewMode ? "Deal Details" : deal ? "Edit Deal" : "New Deal"}
                                </h2>
                                <p className="text-[#0F172A]/50 font-medium text-sm">
                                    {isViewMode ? "Sales opportunity overview" : deal ? "Update deal information" : "Create a new sales opportunity"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isViewMode && (
                                    <button
                                        onClick={() => setCurrentMode('edit')}
                                        className="p-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-2xl transition-all text-orange-600 flex items-center gap-2 font-bold text-sm px-5 group"
                                    >
                                        <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        <span>Edit Deal</span>
                                    </button>
                                )}
                                {!isViewMode && deal && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                        className="p-3 bg-red-50 hover:bg-red-100 rounded-2xl transition-all text-red-500 disabled:opacity-50 flex items-center gap-2 font-bold text-sm px-5"
                                        title="Delete Deal"
                                    >
                                        {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        <span>Delete</span>
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-[#0F172A]/5 rounded-2xl transition-colors text-[#0F172A]/40"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        {deal && (
                            <div className="flex p-1 bg-[#0F172A]/5 rounded-2xl mb-8">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'info' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'
                                    }`}
                                >
                                    <Info className="w-4 h-4" />
                                    <span>Info</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('tasks')}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'tasks' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'
                                    }`}
                                >
                                    <ListTodo className="w-4 h-4" />
                                    <span>Tasks</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('docs')}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'docs' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Docs</span>
                                </button>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === 'info' ? (
                                    <motion.div
                                        key="info-tab"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-8"
                                    >
                                        {error && (
                                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 text-sm font-bold">
                                                {error}
                                            </div>
                                        )}

                                        {isViewMode && deal && (
                                            <div className="p-8 glass bg-orange-500/5 border-orange-500/10 rounded-[2.5rem] text-center mb-8">
                                                <div className="text-[10px] font-black text-orange-500/40 uppercase tracking-[0.2em] mb-2">Deal Value</div>
                                                <div className="text-5xl font-black text-[#0F172A] tracking-tight">
                                                    ${parseFloat(formData.value).toLocaleString()}
                                                </div>
                                                <div className="mt-4 flex items-center justify-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        deal.stage === 'Won' ? 'bg-green-100 text-green-600' :
                                                        deal.stage === 'Lost' ? 'bg-red-100 text-red-600' :
                                                        'bg-orange-100 text-orange-600'
                                                    }`}>
                                                        {deal.stage}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Deal Name</label>
                                                <div className="relative group">
                                                    <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        name="name"
                                                        required
                                                        disabled={isViewMode}
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="e.g. Enterprise Software License"
                                                        className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold disabled:opacity-70"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Value ($)</label>
                                                    <div className="relative group">
                                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            name="value"
                                                            required
                                                            disabled={isViewMode}
                                                            type="number"
                                                            step="0.01"
                                                            value={formData.value}
                                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                                            placeholder="5000"
                                                            className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold disabled:opacity-70"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Expected Close</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            name="close_date"
                                                            disabled={isViewMode}
                                                            type="date"
                                                            value={formData.close_date}
                                                            onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                                                            className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold disabled:opacity-70"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Link Customer</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                    <select
                                                        name="customer_id"
                                                        required
                                                        disabled={isViewMode}
                                                        value={formData.customer_id}
                                                        onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold appearance-none cursor-pointer disabled:opacity-70"
                                                    >
                                                        <option value="">Select a customer...</option>
                                                        {customers.map((c) => (
                                                            <option key={c.id} value={c.id}>
                                                                {c.full_name} {c.company_name ? `(${c.company_name})` : ""}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Initial Stage</label>
                                                <div className="relative group">
                                                    <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                    <select
                                                        name="stage"
                                                        disabled={isViewMode}
                                                        value={formData.stage}
                                                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold appearance-none cursor-pointer disabled:opacity-70"
                                                    >
                                                        <option value="New">New</option>
                                                        <option value="Contacted">Contacted</option>
                                                        <option value="Negotiation">Negotiation</option>
                                                        <option value="Won">Won</option>
                                                        <option value="Lost">Lost</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {!isViewMode && (
                                                <div className="pt-10">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        disabled={loading}
                                                        type="submit"
                                                        className="w-full py-5 bg-orange-500 text-white font-black rounded-[2rem] shadow-2xl shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                                                    >
                                                        {loading ? (
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <span>{deal ? "Save Changes" : "Create Deal"}</span>
                                                                <DollarSign className="w-6 h-6" />
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            )}

                                            {isViewMode && (
                                                <div className="pt-10">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            onClose();
                                                        }}
                                                        className="w-full py-5 bg-[#0F172A] text-white font-black rounded-[2rem] shadow-2xl shadow-[#0F172A]/20 flex items-center justify-center space-x-2 transition-all"
                                                    >
                                                        <span>Close Details</span>
                                                    </motion.button>
                                                </div>
                                            )}
                                        </form>
                                    </motion.div>
                                ) : activeTab === 'tasks' ? (
                                    <motion.div
                                        key="tasks-tab"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-6"
                                    >
                                        <TaskList 
                                            tasks={tasks} 
                                            onRefresh={loadTasks} 
                                            showAddButton 
                                            onAddClick={() => setIsAddTaskOpen(true)}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="docs-tab"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-10"
                                    >
                                        <MediaDropzone 
                                            workspaceId={deal?.workspace_id || ""}
                                            dealId={deal?.id}
                                            onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)}
                                        />
                                        <MediaGallery 
                                            workspaceId={deal?.workspace_id || ""}
                                            dealId={deal?.id}
                                            refreshTrigger={refreshMedia}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <AddTaskModal 
                            isOpen={isAddTaskOpen} 
                            onClose={() => setIsAddTaskOpen(false)}
                            dealId={deal?.id}
                            onSuccess={loadTasks}
                        />

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
