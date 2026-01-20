"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, 
    X, 
    Users, 
    Briefcase, 
    CheckSquare, 
    FileText,
    Calendar,
    Hash
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
    id: string;
    type: 'customer' | 'deal' | 'task';
    title: string;
    subtitle?: string;
    description?: string;
    url: string;
    icon: React.ReactNode;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setResults([]);
            return;
        }

        setIsLoading(true);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search by 300ms
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();
                
                if (response.ok) {
                    setResults(data.results || []);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false);
        setSearchTerm("");
        router.push(result.url);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'customer': return <Users className="w-4 h-4" />;
            case 'deal': return <Briefcase className="w-4 h-4" />;
            case 'task': return <CheckSquare className="w-4 h-4" />;
            default: return <Search className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'customer': return 'text-blue-500';
            case 'deal': return 'text-orange-500';
            case 'task': return 'text-indigo-500';
            default: return 'text-gray-500';
        }
    };

    const getTypeBg = (type: string) => {
        switch (type) {
            case 'customer': return 'bg-blue-500/10';
            case 'deal': return 'bg-orange-500/10';
            case 'task': return 'bg-indigo-500/10';
            default: return 'bg-gray-500/10';
        }
    };

    return (
        <>
            {/* Search Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 px-4 py-3 bg-white/50 border border-primary/10 rounded-2xl hover:bg-white/70 transition-all group"
            >
                <Search className="w-4 h-4 text-[#0F172A]/40 group-hover:text-primary transition-colors" />
                <span className="text-sm font-bold text-[#0F172A]/60 hidden md:inline">Search...</span>
                <kbd className="hidden md:flex items-center gap-1 px-2 py-1 text-xs font-black bg-[#0F172A]/5 rounded-lg text-[#0F172A]/40 border border-[#0F172A]/10">
                    <span className="text-[8px]">⌘</span>K
                </kbd>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[200]"
                        />

                        {/* Search Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[201]"
                        >
                            <div className="glass bg-white/90 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl overflow-hidden">
                                {/* Search Input */}
                                <div className="relative p-4 border-b border-primary/5">
                                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/30" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search customers, deals, tasks..."
                                        className="w-full pl-14 pr-12 py-4 bg-transparent border-none outline-none text-[#0F172A] font-bold text-lg placeholder:text-[#0F172A]/40"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-[#0F172A]/5 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-[#0F172A]/40" />
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-8 text-center">
                                            <div className="inline-block w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
                                            <p className="text-sm font-bold text-[#0F172A]/40">Searching...</p>
                                        </div>
                                    ) : searchTerm.trim().length === 0 ? (
                                        <div className="p-8 text-center">
                                            <Search className="w-12 h-12 text-[#0F172A]/20 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-[#0F172A]/40">Type to search customers, deals, and tasks</p>
                                            <p className="text-xs text-[#0F172A]/30 mt-2">Press Esc to close</p>
                                        </div>
                                    ) : results.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <Search className="w-12 h-12 text-[#0F172A]/20 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-[#0F172A]/40">No results found</p>
                                            <p className="text-xs text-[#0F172A]/30 mt-2">Try different search terms</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-primary/5">
                                            {results.map((result, index) => (
                                                <motion.div
                                                    key={`${result.type}-${result.id}`}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.02 }}
                                                    onClick={() => handleSelect(result)}
                                                    className="p-4 hover:bg-primary/5 cursor-pointer group transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`${getTypeBg(result.type)} p-3 rounded-xl ${getTypeColor(result.type)} group-hover:scale-110 transition-transform`}>
                                                            {getTypeIcon(result.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-[#0F172A] truncate group-hover:text-primary transition-colors">
                                                                    {result.title}
                                                                </h3>
                                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${getTypeBg(result.type)} ${getTypeColor(result.type)}`}>
                                                                    {result.type}
                                                                </span>
                                                            </div>
                                                            {result.subtitle && (
                                                                <p className="text-sm text-[#0F172A]/60 truncate mb-1">
                                                                    {result.subtitle}
                                                                </p>
                                                            )}
                                                            {result.description && (
                                                                <p className="text-xs text-[#0F172A]/40 truncate">
                                                                    {result.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-[#0F172A]/20 group-hover:text-primary transition-colors">
                                                            <Hash className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-3 bg-[#0F172A]/2 text-xs text-[#0F172A]/40 text-center border-t border-primary/5">
                                    Press Enter to select • Esc to close
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}