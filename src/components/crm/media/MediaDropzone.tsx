"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File as FileIcon, Loader2, CheckCircle2 } from "lucide-react";

interface MediaDropzoneProps {
    workspaceId: string;
    customerId?: string;
    dealId?: string;
    uploaderId?: string;
    onUploadSuccess?: () => void;
}

export function MediaDropzone({ 
    workspaceId, 
    customerId, 
    dealId, 
    uploaderId,
    onUploadSuccess 
}: MediaDropzoneProps) {
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        setStatus('idle');
        
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("workspace_id", workspaceId);
        if (customerId) formData.append("customer_id", customerId);
        if (dealId) formData.append("deal_id", dealId);
        if (uploaderId) formData.append("uploader_id", uploaderId);

        try {
            // We'll use the FastAPI backend running on port 8000
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            }).catch(() => {
                throw new Error("Media service is offline. Please ensure the backend is running.");
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Upload failed");
            }

            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error: any) {
            console.error("Upload error:", error);
            setStatus('error');
            setErrorMessage(error.message);
        } finally {
            setUploading(false);
        }
    }, [workspaceId, customerId, dealId, uploaderId, onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        }
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`relative group cursor-pointer transition-all duration-300 rounded-[2.5rem] border-2 border-dashed p-10 flex flex-col items-center justify-center space-y-4
                    ${isDragActive ? 'border-orange-500 bg-orange-50/50 scale-[1.02]' : 'border-primary/20 hover:border-primary/40 bg-white/30 backdrop-blur-md shadow-sm'}
                    ${status === 'success' ? 'border-green-400 bg-green-50/50' : ''}
                    ${status === 'error' ? 'border-red-400 bg-red-50/50' : ''}
                `}
            >
                <input {...getInputProps()} />
                
                <AnimatePresence mode="wait">
                    {uploading ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center space-y-4"
                        >
                            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                            <p className="text-orange-600 font-bold">Uploading your file...</p>
                        </motion.div>
                    ) : status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center space-y-4"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                            <p className="text-green-600 font-bold">Upload Complete!</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Upload className="w-8 h-8 text-orange-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-[#0F172A] tracking-tight">
                                    {isDragActive ? "Drop it here!" : "Upload Media"}
                                </p>
                                <p className="text-[#0F172A]/50 font-medium text-sm">
                                    Drag & drop or click to select
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {status === 'error' && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs font-bold absolute bottom-4"
                    >
                        {errorMessage}
                    </motion.p>
                )}
            </div>
            
            <p className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-[0.2em] text-center mt-4">
                Supported: PDF, DOCX, PNG, JPG (Max 10MB)
            </p>
        </div>
    );
}
