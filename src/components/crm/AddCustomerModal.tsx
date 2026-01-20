"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Building2, Tag, Loader2, Trash2, Edit2, FileText, Info, CheckSquare, ListTodo, Activity } from "lucide-react";
import { createCustomer, updateCustomer, deleteCustomer, type Customer } from "@/app/crm/actions";
import { useState, useEffect } from "react";
import { ProfileRepairTool } from "./ProfileRepairTool";
import { MediaDropzone } from "./media/MediaDropzone";
import { MediaGallery } from "./media/MediaGallery";
import { TaskList } from "./tasks/TaskList";
import { AddTaskModal } from "./tasks/AddTaskModal";
import { ActivityTimeline } from "./ActivityTimeline";
import { getTasks, type Task } from "@/app/dashboard/tasks/actions";

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer?: Customer | null;
    mode?: 'add' | 'edit' | 'view';
}

export function AddCustomerModal({ isOpen, onClose, customer, mode = 'add' }: AddCustomerModalProps) {
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsProfileRepair, setNeedsProfileRepair] = useState(false);
    const [currentMode, setCurrentMode] = useState<'add' | 'edit' | 'view'>(mode);
    const [activeTab, setActiveTab] = useState<'info' | 'docs' | 'tasks' | 'timeline'>('info');
    const [refreshMedia, setRefreshTrigger] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    useEffect(() => {
        if (isOpen && customer && (activeTab === 'tasks')) {
            loadTasks();
        }
    }, [isOpen, customer, activeTab]);

    const loadTasks = async () => {
        if (!customer) return;
        setLoadingTasks(true);
        const data = await getTasks({ customerId: customer.id });
        setTasks(data);
        setLoadingTasks(false);
    };

    useEffect(() => {
        setCurrentMode(mode);
        setActiveTab('info'); // Reset tab when mode or open state changes
    }, [mode, isOpen]);

    const isViewMode = currentMode === 'view';

    // Form states for controlled inputs when editing
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        status: "lead"
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                fullName: customer.full_name || "",
                email: customer.email || "",
                phone: customer.phone || "",
                companyName: customer.company_name || "",
                status: customer.status || "lead"
            });
        } else {
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                companyName: "",
                status: "lead"
            });
        }
        setError(null);
        setNeedsProfileRepair(false);
    }, [customer, isOpen]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setNeedsProfileRepair(false);

        const form = e.currentTarget;
        const data = new FormData(form);
        
        let result;
        if (customer) {
            result = await updateCustomer(customer.id, data);
        } else {
            result = await createCustomer(data);
        }

        setLoading(false);

        if (result.error) {
            setError(result.error);
            if ('needsProfileRepair' in result && result.needsProfileRepair) {
                setNeedsProfileRepair(true);
            }
        } else {
            onClose();
        }
    }

    async function handleDelete() {
        if (!customer || !confirm("Are you sure you want to delete this customer?")) return;
        
        setDeleteLoading(true);
        const result = await deleteCustomer(customer.id);
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
                                    {isViewMode ? "Customer Details" : customer ? "Edit Customer" : "New Customer"}
                                </h2>
                                <p className="text-[#0F172A]/50 font-medium text-sm">
                                    {isViewMode ? "Full profile information" : customer ? "Update details for this contact" : "Fill in the details to expand your network"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isViewMode && (
                                    <button
                                        onClick={() => setCurrentMode('edit')}
                                        className="p-3 bg-primary/10 hover:bg-primary/20 rounded-2xl transition-all text-primary flex items-center gap-2 font-bold text-sm px-5 group"
                                    >
                                        <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        <span>Edit Profile</span>
                                    </button>
                                )}
                                {!isViewMode && customer && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                        className="p-3 bg-red-50 hover:bg-red-100 rounded-2xl transition-all text-red-500 disabled:opacity-50 flex items-center gap-2 font-bold text-sm px-5"
                                        title="Delete Customer"
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
                        {customer && (
                            <div className="flex p-1 bg-[#0F172A]/5 rounded-2xl mb-8 overflow-x-auto no-scrollbar shrink-0">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`flex-1 min-w-[100px] flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'info' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'
                                    }`}
                                >
                                    <Info className="w-4 h-4" />
                                    <span>Info</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('tasks')}
                                    className={`flex-1 min-w-[100px] flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'tasks' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'
                                    }`}
                                >
                                    <ListTodo className="w-4 h-4" />
                                    <span>Tasks</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('docs')}
                                    className={`flex-1 min-w-[100px] flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'docs' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Docs</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('timeline')}
                                    className={`flex-1 min-w-[100px] flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'timeline' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'
                                    }`}
                                >
                                    <Activity className="w-4 h-4" />
                                    <span>History</span>
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
                                        {needsProfileRepair && (
                                            <div className="mb-6">
                                                <ProfileRepairTool onSuccess={onClose} />
                                            </div>
                                        )}
                                        
                                        {isViewMode && customer && (
                                            <div className="space-y-8 mb-10">
                                                <div className="p-8 glass bg-primary/5 border-primary/10 rounded-[2.5rem] flex flex-col items-center text-center">
                                                    <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center text-primary text-4xl font-black shadow-inner mb-4">
                                                        {customer.full_name.charAt(0)}
                                                    </div>
                                                    <div className="text-3xl font-black text-[#0F172A] mb-1">{customer.full_name}</div>
                                                    <div className="flex items-center gap-2 text-[#0F172A]/40 font-bold text-xs uppercase tracking-widest">
                                                        <span>Member Since {new Date(customer.created_at).getFullYear()}</span>
                                                        <span className="w-1 h-1 bg-[#0F172A]/20 rounded-full" />
                                                        <span className={`px-2 py-0.5 rounded-md border ${
                                                            customer.status === 'active' ? 'bg-green-100 text-green-600 border-green-200' :
                                                            customer.status === 'lead' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                                                            'bg-slate-100 text-slate-600 border-slate-200'
                                                        }`}>
                                                            {customer.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="p-5 rounded-2xl bg-[#0F172A]/[0.02] border border-[#0F172A]/5 flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                            <Mail className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Email Address</div>
                                                            <div className="font-bold text-[#0F172A]">{customer.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-5 rounded-2xl bg-[#0F172A]/[0.02] border border-[#0F172A]/5 flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                            <Phone className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Phone Number</div>
                                                            <div className="font-bold text-[#0F172A]">{customer.phone || "Not provided"}</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-5 rounded-2xl bg-[#0F172A]/[0.02] border border-[#0F172A]/5 flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                            <Building2 className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest">Company</div>
                                                            <div className="font-bold text-[#0F172A]">{customer.company_name || "Independent"}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        name="fullName"
                                                        required
                                                        disabled={isViewMode}
                                                        type="text"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        placeholder="e.g. Robert Fox"
                                                        className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Email</label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            name="email"
                                                            required
                                                            disabled={isViewMode}
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            placeholder="name@company.com"
                                                            className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Phone</label>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            name="phone"
                                                            disabled={isViewMode}
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            placeholder="+1 (555) 000-0000"
                                                            className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Company</label>
                                                <div className="relative group">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        name="companyName"
                                                        disabled={isViewMode}
                                                        type="text"
                                                        value={formData.companyName}
                                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                        placeholder="Company Name"
                                                        className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[#0F172A]/40 uppercase tracking-widest ml-1">Status</label>
                                                <div className="relative group">
                                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/20 group-focus-within:text-primary transition-colors" />
                                                    <select
                                                        name="status"
                                                        disabled={isViewMode}
                                                        value={formData.status}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 bg-[#0F172A]/[0.02] border border-[#0F172A]/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[#0F172A] font-bold appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                                    >

                                                        <option value="lead">Lead</option>
                                                        <option value="active">Active</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {error && (
                                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                                                    <Info className="w-5 h-5 shrink-0" />
                                                    <p className="text-xs font-bold">{error}</p>
                                                </div>
                                            )}

                                            {!isViewMode && (
                                                <div className="pt-10">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        disabled={loading}
                                                        type="submit"
                                                        className="w-full py-5 bg-[#0F172A] text-white font-black rounded-[2rem] shadow-2xl shadow-[#0F172A]/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                                                    >
                                                        {loading ? (
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <span>{customer ? "Save Changes" : "Add Customer"}</span>
                                                                <X className={`w-6 h-6 ${customer ? "" : "rotate-45"}`} />
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
                                                        className="w-full py-5 bg-primary text-white font-black rounded-[2rem] shadow-2xl shadow-primary/20 flex items-center justify-center space-x-2 transition-all"
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
                                ) : activeTab === 'docs' ? (
                                    <motion.div
                                        key="docs-tab"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-10"
                                    >
                                        <MediaDropzone 
                                            workspaceId={customer?.workspace_id || ""}
                                            customerId={customer?.id}
                                            onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)}
                                        />
                                        <MediaGallery 
                                            workspaceId={customer?.workspace_id || ""}
                                            customerId={customer?.id}
                                            refreshTrigger={refreshMedia}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="timeline-tab"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-10"
                                    >
                                        <ActivityTimeline customerId={customer?.id || ""} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <AddTaskModal 
                            isOpen={isAddTaskOpen} 
                            onClose={() => setIsAddTaskOpen(false)}
                            customerId={customer?.id}
                            onSuccess={loadTasks}
                        />

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
