# UI/UX & Design Guidelines

This document defines the visual and interactive standards that **must** be followed across all development phases of the Internal CRM Management system.

## 1. Design Aesthetic: Modern Glassmorphism
The design should feel premium, lightweight, and modern. Use "Frosted Glass" effects to create hierarchy and depth.

### Core Elements:
- **Glass Containers**: Use `backdrop-filter: blur(12px)` with a semi-transparent white or light blue background (`rgba(255, 255, 255, 0.7)`).
- **Borders**: Thin, subtle borders (`1px solid rgba(255, 255, 255, 0.3)`) to define glass edges.
- **Shadows**: Soft, multi-layered shadows to provide lift without looking "heavy".
- **Corners**: Large border radii (`rounded-2xl` or `1.5rem`) for a friendly, modern feel.

## 2. Color Palette & Typography

### Colors:
- **Primary (Background/Soft Elements)**: Sky Blue (`#E0F2FE`)
- **Secondary (Action/CTA)**: Vibrant Orange (`#FB923C`)
- **Text**: Deep Navy (`#0F172A`) for high contrast.
- **Success/Neutral**: Soft emeralds and greys that blend with the blue/orange theme.

### Typography:
- **Font Face**: Inter or Outfit (Sans-serif).
- **Headings**: **Bold & Prominent**. Use high weights (700-800) for page titles and section headers.
- **Readability**: Ensure generous line spacing and letter spacing for a clean look.

## 3. Interactive Guidelines (Framer Motion)

### Buttons & Cards:
- **Hover Scale**: Slight scale up (`whileHover={{ scale: 1.02 }}`).
- **Tap Effect**: Subtle compression (`whileTap={{ scale: 0.98 }}`).
- **Interactive States**: Use the Secondary Orange for hover states on buttons to make them feel "alive".

### Transitions:
- **Page Transitions**: Smooth fade-in and slide-up for initial page loads.
- **Layout Animations**: Use `layout` prop in Framer Motion for smooth transitions when lists change or modals open.

## 4. Minimalist Management Layout
- **White Space**: Prioritize breathing room. Avoid clutter.
- **Iconography**: Use clean, stroke-based icons (Lucide React or Heroicons).
- **Density**: "Management type" design doesn't mean "rows of text". Use cards, chips, and badges to organize data visually.
