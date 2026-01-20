"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    Plus,
    Search,
    Filter,
    LayoutDashboard
} from "lucide-react";
import { getDeals, type Deal } from "./actions";
import { KanbanBoard } from "@/components/crm/deals/KanbanBoard";
import { AddDealModal } from "@/components/crm/deals/AddDealModal";
import { DealsExportButton } from "./ExportButton";

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

    async function load() {
        const data = await getDeals();
        setDeals(data);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    const handleAdd = () => {
        setSelectedDeal(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleDealClick = (deal: Deal) => {
        setSelectedDeal(deal);
        setModalMode('view');
        setIsModalOpen(true);
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col space-y-8">
            {/* Prominent Centered Logo */}
            <div className="flex justify-center mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="group"
                >
                    <div className="relative">
                        <Image 
                            src="/Logo-pages.png" 
                            alt="Manage Your Business Here Logo" 
                            width={160} 
                            height={160} 
                            className="rounded-3xl shadow-2xl shadow-primary/60 group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 rounded-3xl bg-primary/40 blur-3xl -z-10"></div>
                    </div>
                </motion.div>
            </div>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Deal Pipeline</h1>
                    <p className="text-[#0F172A]/50 font-medium">Track your revenue and sales opportunities</p>
                </div>

                <motion.button
                    onClick={handleAdd}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-orange-500 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-orange-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Deal</span>
                </motion.button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search deals, customers..."
                        className="w-full pl-12 pr-4 py-4 glass bg-white/50 border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#0F172A] font-medium"
                    />
                </div>
                <DealsExportButton />
                <button className="px-6 py-4 glass bg-white/50 border-primary/10 rounded-2xl font-bold text-[#0F172A]/60 flex items-center space-x-2 hover:text-[#0F172A] transition-colors">
                    <Filter className="w-5 h-5" />
                    <span>Pipeline Filters</span>
                </button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 min-h-0">
                {loading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full"
                        />
                    </div>
                ) : deals.length === 0 ? (
                    <div className="text-[#0F172A]/40 text-center py-20 glass rounded-[2.5rem] border-primary/5">
                        <LayoutDashboard className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold text-lg">No deals found in the pipeline</p>
                        <p className="text-sm">Start by creating your first sales opportunity</p>
                    </div>
                ) : (
                    <KanbanBoard 
                        deals={deals} 
                        onUpdate={load} 
                        onDealClick={handleDealClick}
                    />
                )}
            </div>

            <AddDealModal
                isOpen={isModalOpen}
                deal={selectedDeal}
                mode={modalMode}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDeal(null);
                    load();
                }}
            />
        </div>
    );
}
