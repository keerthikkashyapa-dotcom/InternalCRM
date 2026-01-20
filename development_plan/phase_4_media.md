# Phase 4: Media Management (FastAPI & Python)

## Objective
Implement a high-performance backend for handling file uploads (documents, IDs, images) using FastAPI.

## 1. Development Tasks
- **FastAPI Backend**:
    - Setup a Python FastAPI service.
    - Implement `/upload` and `/files/{id}` endpoints.
- **Storage Logic**:
    - Integrate with Supabase Storage or AWS S3 for actual file persistence.
- **Media Frontend**:
    - Build a `MediaGallery` component in Next.js.
    - Implement interactive "File Dropzones" with glassmorphic styling.
- **Cross-Service Communication**:
    - Secure the FastAPI endpoints using shared secrets or Supabase auth verification.

## 2. Connection to Previous Phase
- Files uploaded via FastAPI will be **linked to Deals** (Phase 3) or **Customers** (Phase 2) via metadata in the database.
- A "Documents" tab will be added to the Customer Detail page.

## 3. UI/UX Refinement
- **Progressive Upload**: Use interactive progress bars with orange accents.
- **Hover Previews**: Show small glassmorphic previews/thumbnails when hovering over media links.

> [!TIP]
> Use FastAPI's asynchronous capabilities to ensure file processing doesn't block the main thread.
