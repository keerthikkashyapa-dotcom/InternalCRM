"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Image as ImageIcon, Trash2, ExternalLink, Loader2, X } from "lucide-react";

interface Attachment {
    id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    url: string;
    created_at: string;
}

interface MediaGalleryProps {
    workspaceId: string;
    customerId?: string;
    dealId?: string;
    refreshTrigger?: number;
}

export function MediaGallery({ workspaceId, customerId, dealId, refreshTrigger }: MediaGalleryProps) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadAttachments = async () => {
        setLoading(true);
        setError(null);
        try {
            // Encode parameters to handle potential special characters
            const params = new URLSearchParams();
            if (customerId) params.append("customer_id", customerId);
            if (dealId) params.append("deal_id", dealId);
            
            const url = `http://localhost:8000/attachments/${workspaceId}?${params.toString()}`;

            const response = await fetch(url).catch(() => {
                throw new Error("Media service is offline. Please ensure the backend is running.");
            });

            if (response.ok) {
                const data = await response.json();
                setAttachments(data);
            } else {
                throw new Error(`Failed to load attachments: ${response.statusText}`);
            }
        } catch (err: any) {
            console.error("Failed to load attachments:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workspaceId) {
            loadAttachments();
        }
    }, [workspaceId, customerId, dealId, refreshTrigger]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this file?")) return;
        
        setDeletingId(id);
        try {
            const response = await fetch(`http://localhost:8000/attachments/${id}`, {
                method: "DELETE",
            }).catch(() => {
                throw new Error("Media service is offline.");
            });
            if (response.ok) {
                setAttachments(prev => prev.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#0F172A]/40 uppercase tracking-widest">Attached Documents</h3>
                <span className="bg-orange-500/10 text-orange-600 text-[10px] font-black px-2 py-1 rounded-lg">
                    {attachments.length} Files
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-10 glass rounded-[2rem] border-red-500/10 bg-red-500/5">
                    <X className="w-10 h-10 text-red-500/20 mx-auto mb-2" />
                    <p className="text-red-600/60 font-bold text-sm">{error}</p>
                    <button 
                        onClick={loadAttachments}
                        className="mt-4 text-xs font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            ) : attachments.length === 0 ? (
                <div className="text-center py-10 glass rounded-[2rem] border-primary/5">
                    <FileText className="w-10 h-10 text-orange-500/20 mx-auto mb-2" />
                    <p className="text-[#0F172A]/40 font-bold text-sm">No documents attached yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    <AnimatePresence mode="popLayout">
                        {attachments.map((file) => (
                            <motion.div
                                key={file.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group glass bg-white/40 p-4 rounded-3xl border border-primary/5 hover:border-primary/20 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                        {file.file_type?.includes('image') ? (
                                            <ImageIcon className="w-6 h-6 text-orange-500" />
                                        ) : (
                                            <FileText className="w-6 h-6 text-orange-500" />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-[#0F172A] text-sm truncate">{file.file_name}</p>
                                        <p className="text-[10px] font-bold text-[#0F172A]/30 uppercase tracking-tight">
                                            {formatSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {file.url && (
                                        <a 
                                            href={file.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-orange-50 rounded-xl text-orange-500 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(file.id)}
                                        disabled={deletingId === file.id}
                                        className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors disabled:opacity-50"
                                    >
                                        {deletingId === file.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
