# Phase 5: Task Management & Activity Tracking

## Objective
Enable internal collaboration through task assignments and automated activity logging.

## 1. Development Tasks
- **Task Engine**:
    - Create `tasks` table (linked to deals/customers).
    - Statuses: `Pending`, `In Progress`, `Completed`.
- **Assignment System**:
    - Allow Admins/Managers to assign tasks to Team Members.
    - Implement a "My Tasks" view for Team Members.
- **Activity Logs**:
    - Build an automated system that logs changes (e.g., "Deal Stage changed to Won" or "Task Completed").
- **Unified Timeline**:
    - Display a vertical timeline on the Customer Detail page showing all linked deals, tasks, and file uploads.

## 2. Connection to Previous Phases
- Integrates with **Customers** (Phase 2) and **Deals** (Phase 3) as related entities.
- Uses **Supabase Auth** (Phase 1) for user identification in logs.

## 3. UI/UX Refinement
- **Interactive Checklist**: Use `whileTap` on checkboxes to provide immediate tactile feedback.
- **Timeline Aesthetic**: A thin vertical neon-blue line with frosted glass nodes for each activity event.
