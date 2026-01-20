"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Building2, Calendar } from "lucide-react";
import { type Deal } from "@/app/dashboard/deals/actions";

interface KanbanCardProps {
    deal: Deal;
    isOverlay?: boolean;
    onClick?: () => void;
}

export function KanbanCard({ deal, isOverlay, onClick }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: deal.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(deal.value);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick();
                }
            }}
            className={`group glass rounded-2xl p-5 border border-primary/5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-[box-shadow,border-color,background-color] cursor-grab active:cursor-grabbing ${
                isOverlay ? 'shadow-2xl border-primary/30 ring-2 ring-primary/20 scale-105 transition-none' : ''
            }`}
        >
            <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-[#0F172A] leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {deal.name}
                    </h4>
                </div>

                <div className="flex items-center gap-2 text-[#0F172A]/60">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold truncate">
                        {deal.customer?.company_name || deal.customer?.full_name || "Unassigned"}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#0F172A]/5">
                    <div className="text-lg font-black text-orange-500">
                        {formattedValue}
                    </div>
                    {deal.close_date && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0F172A]/40 uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {new Date(deal.close_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
