"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { type Deal } from "@/app/dashboard/deals/actions";

interface KanbanColumnProps {
    id: string;
    title: string;
    items: Deal[];
    children: React.ReactNode;
}

export function KanbanColumn({ id, title, items, children }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div className="w-80 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-[#0F172A] text-sm uppercase tracking-widest">{title}</h3>
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                        {items.length}
                    </span>
                </div>
            </div>
            <div
                ref={setNodeRef}
                className={`flex-1 bg-white/30 backdrop-blur-md border rounded-[2rem] p-4 min-h-[500px] transition-all duration-200 ${
                    isOver ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-primary/5'
                }`}
            >
                {children}
            </div>
        </div>
    );
}
