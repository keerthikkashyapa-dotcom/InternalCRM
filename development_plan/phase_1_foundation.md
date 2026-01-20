# Phase 1: Foundation & Authentication

## Objective
Establish the project core, setup the database, and implement the secure Auth system (Login/Signup) that connects from the Phase 0 Landing Page.

## 1. Development Tasks
- **Project Setup**: Initialize Next.js with Tailwind CSS and Framer Motion.
- **Supabase Integration**: Setup Supabase project, enable Auth (Email/Password), and create the initial `profiles` table.
- **Authentication Views**:
    - Build "Sign In" page: High-contrast frosted glass card with Login/Admin login options.
    - Build "Sign Up" page: Multi-step form for User Details and Workspace Creation.
- **Workspace Schema**: 
    - Create `workspaces` table.
    - Create `roles` enum (Admin, Manager, Team Member).
- **RBAC Middleware**: Implement Next.js Middleware to protect routes based on Supabase session and user role.

## 2. Connection to Previous Phase
- This phase handles the logic for the **"Sign In"** and **"Get Started"** buttons defined in **Phase 0**.
- The Landing Page layout (Phase 0) acts as the public container for these Auth views.

## 3. Connection to Next Phase
The foundation laid here (User Session + Workspace Context) will be utilized in **Phase 2** to scope all customer data to the specific workspace.

## 3. UI/UX Refinement
- **Landing Page**: Use a large, bold hero section (`text-7xl font-extrabold`) with a glass-textured login card.
- **Interactive Forms**: Use `whileFocus={{ scale: 1.01 }}` for input fields and high-contrast Orange buttons for "Sign In".

> [!IMPORTANT]
> Ensure every user is linked to exactly one workspace during signup.
