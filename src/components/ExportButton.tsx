"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Users, Briefcase, CheckSquare, Loader2 } from "lucide-react";
import { exportCustomers, exportDeals, exportTasks } from "@/app/dashboard/export-actions";

type ExportType = 'customers' | 'deals' | 'tasks';

export function ExportButton() {
    const [loading, setLoading] = useState<ExportType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async (type: ExportType) => {
        setLoading(type);
        setError(null);

        try {
            let result;
            switch (type) {
                case 'customers':
                    result = await exportCustomers();
                    break;
                case 'deals':
                    result = await exportDeals();
                    break;
                case 'tasks':
                    result = await exportTasks();
                    break;
            }

            if (result?.error) {
                setError(result.error);
            } else if (result?.csv) {
                // Create and download CSV file
                const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', result.filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            setError('Export failed. Please try again.');
            console.error('Export error:', err);
        } finally {
            setLoading(null);
        }
    };

    const getExportConfig = (type: ExportType) => {
        switch (type) {
            case 'customers':
                return {
                    icon: Users,
                    label: 'Customers',
                    color: 'bg-blue-500',
                    hover: 'hover:bg-blue-600'
                };
            case 'deals':
                return {
                    icon: Briefcase,
                    label: 'Deals',
                    color: 'bg-orange-500',
                    hover: 'hover:bg-orange-600'
                };
            case 'tasks':
                return {
                    icon: CheckSquare,
                    label: 'Tasks',
                    color: 'bg-indigo-500',
                    hover: 'hover:bg-indigo-600'
                };
        }
    };

    return (
        <div className="relative group">
            <button
                className="flex items-center gap-2 px-4 py-3 bg-white/50 border border-primary/10 rounded-2xl hover:bg-white/70 transition-all group/button"
            >
                <Download className="w-4 h-4 text-[#0F172A]/40 group-hover/button:text-primary transition-colors" />
                <span className="text-sm font-bold text-[#0F172A]/60">Export Data</span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl border border-primary/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 space-y-1">
                    {(['customers', 'deals', 'tasks'] as ExportType[]).map((type) => {
                        const config = getExportConfig(type);
                        return (
                            <button
                                key={type}
                                onClick={() => handleExport(type)}
                                disabled={loading === type}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold text-sm transition-all ${config.hover} ${
                                    loading === type 
                                        ? 'bg-[#0F172A]/10 text-[#0F172A]/40 cursor-not-allowed' 
                                        : 'text-[#0F172A] hover:text-white'
                                }`}
                            >
                                {loading === type ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <config.icon className="w-4 h-4" />
                                )}
                                <span>Export {config.label}</span>
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <div className="px-4 py-2 border-t border-primary/10">
                        <p className="text-xs font-bold text-red-500">{error}</p>
                    </div>
                )}

                <div className="px-4 py-2 text-[10px] font-black text-[#0F172A]/30 uppercase tracking-widest border-t border-primary/5">
                    Admin only
                </div>
            </div>
        </div>
    );
}