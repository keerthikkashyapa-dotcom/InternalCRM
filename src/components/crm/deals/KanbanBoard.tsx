"use client";

import React, { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { type Deal, type DealStage, updateDealStage } from "@/app/dashboard/deals/actions";

const STAGES: DealStage[] = ["New", "Contacted", "Negotiation", "Won", "Lost"];

interface KanbanBoardProps {
    deals: Deal[];
    onUpdate: () => void;
    onDealClick: (deal: Deal) => void;
}

export function KanbanBoard({ deals, onUpdate, onDealClick }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [items, setItems] = useState<Record<DealStage, Deal[]>>({
        New: [],
        Contacted: [],
        Negotiation: [],
        Won: [],
        Lost: [],
    });

    // Update items when deals change
    useEffect(() => {
        const grouped: Record<DealStage, Deal[]> = {
            New: [],
            Contacted: [],
            Negotiation: [],
            Won: [],
            Lost: [],
        };
        deals.forEach((deal) => {
            if (grouped[deal.stage]) {
                grouped[deal.stage].push(deal);
            }
        });
        setItems(grouped);
    }, [deals]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find containers
        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId) || (overId as DealStage);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer as DealStage];

            const activeIndex = activeItems.findIndex((item) => item.id === activeId);
            const overIndex = overItems.findIndex((item) => item.id === overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem = over && overIndex === overItems.length - 1;
                const modifier = isBelowLastItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: activeItems.filter((item) => item.id !== active.id),
                [overContainer as DealStage]: [
                    ...overItems.slice(0, newIndex),
                    prev[activeContainer][activeIndex],
                    ...overItems.slice(newIndex, overItems.length),
                ],
            };
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // The overContainer is where the item dropped
        const overContainer = findContainer(overId) || (overId as DealStage);
        
        // Find the deal in the source deals array to check its original stage
        const deal = deals.find(d => d.id === activeId);
        
        if (!deal || !overContainer) return;

        if (deal.stage !== overContainer) {
            // Stage actually changed - update backend
            try {
                const result = await updateDealStage(activeId, overContainer as DealStage);
                if (!result.success) {
                    // Revert on failure
                    onUpdate();
                } else {
                    // Success - refresh data to stay in sync
                    onUpdate();
                }
            } catch (err) {
                onUpdate();
            }
        } else {
            // Reordering within the same column
            const activeIndex = items[deal.stage].findIndex((item) => item.id === activeId);
            const overIndex = items[overContainer as DealStage].findIndex((item) => item.id === overId);

            if (activeIndex !== overIndex && overIndex !== -1) {
                setItems((prev) => ({
                    ...prev,
                    [overContainer as DealStage]: arrayMove(prev[overContainer as DealStage], activeIndex, overIndex),
                }));
            }
        }
    };

    function findContainer(id: string) {
        if (id in items) return id as DealStage;
        return (Object.keys(items) as DealStage[]).find((key) =>
            items[key].find((item) => item.id === id)
        );
    }

    const activeDeal = activeId
        ? (Object.values(items).flat().find((item) => item.id === activeId))
        : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 h-full overflow-x-auto pb-10 px-4 min-h-[600px] items-start scroll-smooth">
                {STAGES.map((stage) => (
                    <KanbanColumn key={stage} id={stage} title={stage} items={items[stage]}>
                        <SortableContext
                            items={items[stage].map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col gap-4 min-h-[200px]">
                                {items[stage].map((deal) => (
                                    <KanbanCard 
                                        key={deal.id} 
                                        deal={deal} 
                                        onClick={() => onDealClick(deal)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </KanbanColumn>
                ))}
            </div>
            <DragOverlay adjustScale={false} dropAnimation={null}>
                {activeId && activeDeal ? (
                    <div className="w-80 opacity-90 rotate-2 cursor-grabbing pointer-events-none">
                        <KanbanCard deal={activeDeal} isOverlay />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
