"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
    Crown, 
    User, 
    Mail, 
    Phone, 
    Building2, 
    Shield, 
    Calendar,
    MapPin,
    Briefcase,
    Users,
    Award,
    Clock,
    UserCheck,
    Loader2,
    AlertCircle,
    ArrowUp,
    ChevronRight
} from "lucide-react";

interface ManagerData {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    phone?: string;
    title?: string;
    department?: string;
    location?: string;
    workspace: {
        name: string;
        created_at: string;
    };
}

interface UserData {
    id: string;
    full_name: string;
    email: string;
    role: string;
    manager_id?: string;
    workspace: {
        name: string;
    };
}

export default function ManagerDetailsPage() {
    const [managerData, setManagerData] = useState<ManagerData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchManagerData();
    }, []);

    const fetchManagerData = async () => {
        try {
            const response = await fetch('/api/manager-details');
            const data = await response.json();
            
            if (response.ok && data) {
                setUserData(data);
                
                // If user has a manager, fetch manager details
                if (data.manager_id) {
                    const managerResponse = await fetch(`/api/manager-details?manager_id=${data.manager_id}`);
                    const managerInfo = await managerResponse.json();
                    
                    if (managerResponse.ok && managerInfo) {
                        setManagerData(managerInfo);
                    } else {
                        setError('Manager information not found');
                    }
                } else {
                    setError('No reporting manager assigned');
                }
            } else {
                setError('Failed to load user information');
            }
        } catch (err) {
            console.error('Error fetching manager data:', err);
            setError('Failed to load manager information');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-[#0F172A]/40 font-bold uppercase tracking-widest text-xs">Loading manager details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                {/* Header with Logo */}
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
                                alt="Manager Portal Logo" 
                                width={120} 
                                height={120} 
                                className="rounded-3xl shadow-2xl shadow-orange-500/40 group-hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute inset-0 rounded-3xl bg-orange-500/30 blur-3xl -z-10"></div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">My Manager</h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass bg-white/50 rounded-[3rem] p-12 border border-orange-500/10 max-w-2xl mx-auto"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <AlertCircle className="w-12 h-12 text-orange-500" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-[#0F172A] mb-4">No Manager Assigned</h2>
                        
                        <div className="space-y-4 text-left">
                            <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10">
                                <p className="text-sm font-bold text-[#0F172A] mb-2">Current Status:</p>
                                <p className="text-xs text-[#0F172A]/60">{error}</p>
                            </div>
                            
                            {userData && (
                                <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                    <p className="text-sm font-bold text-[#0F172A] mb-2">Your Information:</p>
                                    <div className="space-y-1 text-xs text-[#0F172A]/60">
                                        <p><strong>Name:</strong> {userData.full_name}</p>
                                        <p><strong>Role:</strong> {userData.role}</p>
                                        <p><strong>Organization:</strong> {userData.workspace?.name}</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                                <p className="text-sm font-bold text-[#0F172A] mb-2">Next Steps:</p>
                                <ul className="text-xs text-[#0F172A]/60 space-y-1">
                                    <li>• Contact your administrator to assign a reporting manager</li>
                                    <li>• Check with HR about your organizational structure</li>
                                    <li>• Visit the Team page to see the current hierarchy</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!managerData) {
        return null;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10">
            {/* Header with Logo */}
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
                            alt="Manager Portal Logo" 
                            width={120} 
                            height={120} 
                            className="rounded-3xl shadow-2xl shadow-orange-500/40 group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 rounded-3xl bg-orange-500/30 blur-3xl -z-10"></div>
                    </div>
                </motion.div>
            </div>

            {/* Page Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Crown className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">My Manager</h1>
                </div>
                <p className="text-[#0F172A]/40 font-bold uppercase tracking-[0.2em] text-xs">
                    Your reporting manager information
                </p>

                {/* Reporting Chain */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mt-6 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 max-w-md mx-auto"
                >
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>{userData?.full_name}</span>
                    </div>
                    <ArrowUp className="w-4 h-4 text-[#0F172A]/40" />
                    <div className="flex items-center gap-2 text-sm font-bold text-orange-600">
                        <Crown className="w-4 h-4" />
                        <span>{managerData.full_name}</span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Manager Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 glass bg-white/50 rounded-[3rem] p-8 border border-orange-500/10 h-fit"
                >
                    <div className="text-center space-y-6">
                        {/* Avatar */}
                        <div className="relative mx-auto w-32 h-32">
                            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-orange-500/30">
                                {managerData.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Crown className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-[#0F172A]">
                                {managerData.full_name}
                            </h2>
                            <p className="text-orange-600 font-bold uppercase tracking-widest text-sm">
                                {managerData.title || 'Manager'}
                            </p>
                            <p className="text-[#0F172A]/60 font-bold text-sm">
                                {managerData.workspace?.name || 'Organization'}
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-orange-500/10">
                            <div className="text-center">
                                <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                </div>
                                <p className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-widest">Member Since</p>
                                <p className="font-bold text-[#0F172A] text-sm">
                                    {new Date(managerData.created_at).getFullYear()}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <Shield className="w-4 h-4 text-orange-600" />
                                </div>
                                <p className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-widest">Access Level</p>
                                <p className="font-bold text-[#0F172A] text-sm capitalize">{managerData.role}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Manager Contact Information */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass bg-white/50 rounded-[3rem] p-8 border border-orange-500/10"
                >
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-[#0F172A] mb-2">Contact Information</h3>
                        <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">
                            How to reach your manager
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-widest ml-4">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                <div className="w-full pl-12 pr-4 py-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-sm font-bold text-[#0F172A]">
                                    {managerData.email}
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-widest ml-4">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                <div className="w-full pl-12 pr-4 py-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-sm font-bold text-[#0F172A]">
                                    {managerData.phone || 'Not provided'}
                                </div>
                            </div>
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-widest ml-4">Job Title</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                <div className="w-full pl-12 pr-4 py-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-sm font-bold text-[#0F172A]">
                                    {managerData.title || managerData.role}
                                </div>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-widest ml-4">Department</label>
                            <div className="relative group">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                <div className="w-full pl-12 pr-4 py-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-sm font-bold text-[#0F172A]">
                                    {managerData.department || 'Management'}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-widest ml-4">Office Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                <div className="w-full pl-12 pr-4 py-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-sm font-bold text-[#0F172A]">
                                    {managerData.location || 'Head Office'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="mt-8 pt-8 border-t border-orange-500/10">
                        <h4 className="text-lg font-black text-[#0F172A] mb-4">Reporting Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-xl">
                                <Building2 className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Organization</p>
                                    <p className="font-bold text-[#0F172A]">{managerData.workspace?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-xl">
                                <UserCheck className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Your Role</p>
                                    <p className="font-bold text-[#0F172A] capitalize">{userData?.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-xl">
                                <Award className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Reporting Status</p>
                                    <p className="font-bold text-green-600">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}