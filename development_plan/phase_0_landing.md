# Phase 0: Landing Page & Visual Identity

## Objective
Create a stunning first impression with a modern, glassmorphic landing page that clearly defines the CRM's value proposition and provides clear entry points for users and admins.

## 1. Landing Page Structure & Sections
The Landing Page should be a single-page scrolling experience with the following sections:

- **1.1 Global Navigation Bar**:
    - Frosted glass appearance (`backdrop-blur`).
    - Logo: "Manage Your Business Here" (Bold Navy).
    - Links: Features, About, Support.
    - CTAs: "Sign In" (Outline) and "Get Started" (Vibrant Orange).

- **1.2 Hero Section**:
    - **Headline**: "Internal Operations, Redefined." (Bold, 800 weight).
    - **Sub-headline**: A clean, minimal CRM for small businesses to manage customers, deals, and tasks.
    - **Primary CTA**: Large "Create Workspace" button with spring animation.
    - **Background**: Subtle animated mesh gradient with sky blue accents.

- **1.3 Feature Grid**:
    - Glass cards highlighting: Customer Tracking, Visual Pipelines, Task Management, and Media Storage.
    - Use stroke icons with orange highlights.

- **1.4 Social Proof / Mission**:
    - A brief section on "Why Internal CRM?" focusing on data isolation and efficiency.

- **1.5 Footer**:
    - Simple links and copyright.

## 2. Shared Routes & Entry Points
Beyond the homepage, this phase also defines the standard layout for:
- **Login Redirects**: Logic to check if a user is already authenticated.
- **Admin Portal Entry**: A specific hidden or explicit link for Admin-only login access (further refined in Phase 1).

## 3. Connection to Next Phase
- The "Get Started" and "Sign In" buttons on the Landing Page will link directly to the **Auth Views** developed in **Phase 1**.
- The visual style (Glassmorphism, Orange CTAs) established here MUST be used as the template for all subsequent internal pages.

## 4. UI/UX Refinement
- **Interactions**: Implement a "reveal on scroll" animation for feature cards using Framer Motion.
- **Typography**: Hero text should use `tracking-tight` for a premium, compact look.
