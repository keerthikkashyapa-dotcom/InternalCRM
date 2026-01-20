"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { exportTasksFromPage } from "./export-actions";

export function TasksExportButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await exportTasksFromPage();
            
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
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleExport}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 bg-white/50 border border-primary/10 rounded-2xl hover:bg-white/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                    <Download className="w-4 h-4 text-[#0F172A]/40 group-hover/button:text-primary transition-colors" />
                )}
                <span className="text-sm font-bold text-[#0F172A]/60">
                    {loading ? 'Exporting...' : 'Export Tasks'}
                </span>
            </button>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 right-0 bg-red-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg z-50"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
}