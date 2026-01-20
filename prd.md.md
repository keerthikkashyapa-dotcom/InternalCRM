# Product Requirements Document (PRD)
## Customer Relationship Management Website
### Business Name: Manage Your Business Here

---

## 1. Product Overview

### 1.1 Product Description
**Manage Your Business Here** is a standalone, internal **Customer Relationship Management (CRM) and Operational Management web application** designed for small businesses and startups.

The platform centralizes:
- Customer data
- Sales pipelines
- Task & team operations

The system does **not integrate with external tools** and is intended strictly for **internal organizational use**.

---

### 1.2 Target Audience
- Small business owners
- Startup founders
- Sales managers
- Operations teams
- Internal business staff

---

### 1.3 Key Objectives
- Replace spreadsheets and manual tracking
- Provide clear visibility into customers, deals, and tasks
- Improve team accountability
- Enable fast onboarding with minimal learning curve

---

## 2. Design & UI Guidelines

### 2.1 UI Style
- **Modern Glassmorphism Design**
- Frosted glass cards
- Background blur effects
- Soft shadows
- Rounded corners
- Smooth transitions & micro-interactions

### 2.2 Color Theme
- **Primary Color:** Light Blue (backgrounds, highlights)
- **Secondary Color:** Orange (CTAs, action buttons, alerts)
- Supporting neutral colors (white, grey)

### 2.3 UX Principles
- Minimal clicks to perform core actions
- Consistent layout across pages
- Role-based UI visibility
- Fully responsive web design

---

## 3. Information Architecture & Page Structure

### Recommended Pages (Total: 9 Pages)

1. Login / Landing Page  
2. Signup & Workspace Creation  
3. Dashboard  
4. Customers (List View)  
5. Customer Detail Page  
6. Deals / Pipeline  
7. Tasks  
8. Team & Roles Management  
9. Settings  

---

## 4. User Roles & Permissions

| Role | Permissions |
|----|----|
| Admin | Full access, manage users, roles, export data |
| Manager | Manage customers, deals, tasks, view analytics |
| Team Member | View & update assigned tasks and deals |

---

## 5. Core Functional Requirements

---

## 5.1 Authentication & Workspace Management

### Features
- User signup using email & password
- Secure login and logout
- Workspace / organization creation
- One workspace per user (Phase 1)
- Role-based access control enforced at API & UI level

---

## 5.2 Dashboard

### Purpose
Provide a real-time overview of business operations.

### Dashboard Widgets
- Total customers
- Active deals
- Pending tasks
- Deals by stage
- Team activity overview

### Role-Based Dashboard View
- **Admin / Manager:** Full analytics & team overview
- **Team Member:** Assigned tasks and personal deals

---

## 5.3 Customer Management

### Customer Fields
- Name (Required)
- Email
- Phone
- Company
- Notes
- Status:
  - Lead
  - Active
  - Closed
- Created date
- Updated date

### Features
- Add, edit, delete customers
- View customer profile
- Link deals and tasks
- Status tracking

---

## 5.4 Deal / Pipeline Management

### Deal Fields
- Deal name
- Linked customer
- Deal value
- Expected close date
- Deal stage:
  - New
  - Contacted
  - Negotiation
  - Won
  - Lost
- Assigned owner

### Features
- Create and update deals
- Change deal stages
- Pipeline view with filters

---

## 5.5 Task Management

### Task Fields
- Task title
- Description
- Linked customer (optional)
- Linked deal (optional)
- Assigned user
- Due date
- Status:
  - Pending
  - In Progress
  - Completed

### Features
- Create tasks
- Assign tasks
- Update status
- View personal and team tasks

---

## 6. Optional Features

### 6.1 Search & Filters
- Search customers by name, email, phone
- Filter deals by stage
- Filter tasks by status and due date

### 6.2 Activity History
- Customer updates
- Deal stage transitions
- Task status changes
- Timestamped logs

### 6.3 Data Export
- Export customers (CSV)
- Export deals (CSV)
- Export tasks (CSV)
- Admin-only access

---

## 7. Non-Functional Requirements

### Performance
- Page load < 2 seconds
- Support up to 50 users per workspace

### Security
- Password hashing
- Secure authentication
- Role-based authorization
- Workspace-level data isolation

### Scalability
- Modular architecture
- Future-ready for feature expansion

---

## 8. Suggested Tech Stack

### 8.1 Frontend
- **Framework:** React.js or Next.js
- **Styling:** Tailwind CSS (ideal for glassmorphism)
- **UI Components:** Custom glassmorphic components
- **State Management:** React Context / Redux Toolkit
- **Charts & Visuals:** Recharts / Chart.js

### 8.2 Backend
- **Runtime:** Node.js
- **Framework:** Express.js / NestJS
- **Authentication:** JWT-based authentication
- **Authorization:** Role-based middleware

### 8.3 Database
- **Primary DB:** PostgreSQL (recommended) or MySQL
- **ORM:** Prisma / Sequelize / TypeORM

### 8.4 API Architecture
- RESTful APIs
- Versioned endpoints (v1)
- JSON-based responses

### 8.5 Hosting & Deployment
- **Frontend:** Vercel / Netlify
- **Backend:** AWS / DigitalOcean / Railway
- **Database:** AWS RDS / Supabase

### 8.6 Security & DevOps
- HTTPS
- Environment-based configuration
- CI/CD pipelines
- Daily automated backups

---

## 9. Success Metrics

- User onboarding time < 5 minutes
- Task completion rate
- Daily active users per workspace
- Deal closure tracking accuracy

---

## 10. Future Enhancements (Out of Scope)

- Email notifications
- File attachments
- Mobile application
- AI-based analytics
- External integrations

---

## End of PRD
