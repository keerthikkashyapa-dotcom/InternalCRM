# Phase 3: Sales Pipeline & Deal Management

## Objective
Visualize the sales process through a dynamic Deal Pipeline (Kanban board) and track revenue opportunities.

## 1. Development Tasks
- **Database Schema**: 
    - Create `deals` table with fields for Name, Value, Close Date, and Owner.
    - Define stages: `New`, `Contacted`, `Negotiation`, `Won`, `Lost`.
- **Kanban Board UI**:
    - Implement a drag-and-drop pipeline interface using `dnd-kit` or similar.
    - Each column represents a stage; cards represent deals.
- **Deal Modal**:
    - Build a detailed modal that opens when a card is clicked.
    - Link deals to existing customers from Phase 2.
- **State Management**:
    - Optimistic UI updates when moving deals between stages to ensure a "snappy" feel.

## 2. Connection to Previous Phase
- Deals are **linked to Customers** (Phase 2) via foreign keys.
- The **Modern Design System** (Phase 1/Guidelines) ensures the Kanban cards feel like tactile glass objects.

## 3. Connection to Next Phase
In **Phase 4**, we will add the ability to upload "Proposal Documents" or "Invoice Images" directly to these deals.

## 4. UI/UX Refinement
- **Animations**: Use Framer Motion's `layout` prop for smooth card shuffling when a deal changes priority or stage.
- **Bold Values**: Display deal values in a large, bold orange font to highlight potential revenue.
