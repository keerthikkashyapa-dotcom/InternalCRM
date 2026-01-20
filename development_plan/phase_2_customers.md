# Phase 2: Core CRM (Customers & Organizations)

## Objective
Implement the fundamental data entities of the CRM: Organizations and Contacts, with full CRUD functionality.

## 1. Development Tasks
- **Database Schema (RLS)**:
    - Create `customers` table with Workspace ID scoping.
    - Setup Supabase Row Level Security (RLS) to ensure users only see data from their own workspace.
- **Customer List View**:
    - Develop a high-performance list view using glassmorphic rows.
    - Implement search and filtering (Phase 6 refined).
- **Customer Profiles**:
    - Create a detailed profile page for each customer.
    - Display basic info: Name, Email, Phone, Company, Status (Lead, Active, Closed).
- **CRM Logic**:
    - Build "Add/Edit Customer" modals with a sleek sliding animation from the right.

## 2. Connection to Previous Phase
- Uses the **Auth Context** from Phase 1 to automatically tag new customers with the current user's `workspace_id`.
- Utilizes the **RBAC Middleware** to restrict "Delete" actions to Admins/Managers only.

## 3. Connection to Next Phase
The customers created here will be selectable when creating **Deals** in **Phase 3**.

## 4. UI/UX Refinement
- **Status Badges**: Use vibrant color chips (Orange for Leads, Green for Active).
- **Glass Cards**: Customer info should be grouped in frosted glass cards with `p-8` padding for breathing room.
