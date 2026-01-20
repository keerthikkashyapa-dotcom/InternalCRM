"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Building2,
    ChevronRight,
    Edit2,
    Eye
} from "lucide-react";
import { getCustomers, type Customer } from "@/app/crm/actions";
import { AddCustomerModal } from "@/components/crm/AddCustomerModal";
import { Users } from "lucide-react";
import { CustomersExportButton } from "./ExportButton";

const statusColors: Record<string, string> = {
    lead: "bg-orange-100 text-orange-600 border-orange-200",
    active: "bg-green-100 text-green-600 border-green-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    async function load() {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    const filteredCustomers = customers.filter(c => 
        c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.company_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const handleView = (customer: Customer) => {
        setSelectedCustomer(customer);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedCustomer(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Customers</h1>
                    <p className="text-[#0F172A]/50 font-medium">Manage and track your organization contacts</p>
                </div>

                <motion.button
                    onClick={handleAdd}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#0F172A] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-[#0F172A]/10"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Customer</span>
                </motion.button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search customers, emails, companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 glass bg-white/50 border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#0F172A] font-medium"
                    />
                </div>
                <CustomersExportButton />
                <button className="px-6 py-4 glass bg-white/50 border-primary/10 rounded-2xl font-bold text-[#0F172A]/60 flex items-center space-x-2 hover:text-[#0F172A] transition-colors">
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                </button>
            </div>

            {/* Table Container */}
            <div className="glass rounded-[2.5rem] border-primary/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#0F172A]/5 bg-[#0F172A]/[0.02]">
                                <th className="px-8 py-5 text-xs font-black text-[#0F172A]/40 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-5 text-xs font-black text-[#0F172A]/40 uppercase tracking-widest">Company</th>
                                <th className="px-8 py-5 text-xs font-black text-[#0F172A]/40 uppercase tracking-widest">Contact</th>
                                <th className="px-8 py-5 text-xs font-black text-[#0F172A]/40 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-[#0F172A]/40 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0F172A]/5">
                            <AnimatePresence>
                                {loading ? (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-4">
                                                <div className="h-12 bg-[#0F172A]/5 rounded-xl w-full" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <Users className="w-8 h-8 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[#0F172A] font-bold text-lg">No customers found</p>
                                                    <p className="text-[#0F172A]/40">
                                                        {searchQuery ? "Try a different search term" : "Start growing your pipeline by adding your first contact."}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer, idx) => (
                                        <motion.tr
                                            key={customer.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => handleView(customer)}
                                            className="group hover:bg-primary/[0.02] transition-colors cursor-pointer"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                                                        {customer.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[#0F172A]">{customer.full_name}</div>
                                                        <div className="text-xs text-[#0F172A]/40 font-medium">Added {new Date(customer.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-2 text-[#0F172A]/70 font-semibold">
                                                    <Building2 className="w-4 h-4 opacity-30" />
                                                    <span>{customer.company_name || "Independent"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2 text-xs font-bold text-[#0F172A]/60">
                                                        <Mail className="w-3.5 h-3.5 opacity-50" />
                                                        <span>{customer.email}</span>
                                                    </div>
                                                    {customer.phone && (
                                                        <div className="flex items-center space-x-2 text-xs font-bold text-[#0F172A]/40">
                                                            <Phone className="w-3.5 h-3.5 opacity-50" />
                                                            <span>{customer.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusColors[customer.status]}`}>
                                                    {customer.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleView(customer);
                                                        }}
                                                        className="px-4 py-2 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl transition-all font-bold text-xs flex items-center gap-2 shadow-sm border border-primary/10"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span>View</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(customer);
                                                        }}
                                                        className="px-4 py-2 bg-[#0F172A]/5 hover:bg-[#0F172A] text-[#0F172A]/60 hover:text-white rounded-xl transition-all font-bold text-xs flex items-center gap-2 shadow-sm border border-[#0F172A]/5"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span>Edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            <AddCustomerModal
                isOpen={isModalOpen}
                customer={selectedCustomer}
                mode={modalMode}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCustomer(null);
                    load();
                }}
            />
        </div>
    );
}
