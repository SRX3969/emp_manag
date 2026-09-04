# Apex Global — Enterprise Employee & Workforce Management Platform

A modern, production-grade enterprise Human Resources & Workforce Management system built with **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Convex**.

Designed to human enterprise standards (inspired by Linear, Stripe, and Workday) with precision typography (Manrope & Inter), dense scan-friendly data tables, accessible contrast, responsive layout, and full Role-Based Access Control (RBAC).

---

## 🏛️ Architecture & System Modules

### 1. **Role-Based Access Control (RBAC)**
Supports 4 distinct authorization personas with strictly enforced permissions:
- **`SUPER_ADMIN`**: Full platform control, corporate governance, compensation adjustments, and audit trail inspection.
- **`HR_ADMIN`**: Workforce lifecycle, recruitment pipeline, personnel provisioning, and policy management.
- **`MANAGER`**: Team timesheet approvals, leave request decisions, and quarterly performance appraisals.
- **`EMPLOYEE`**: Self-service shift clock-in/out, leave applications, personal payslips, and task tracking.

### 2. **Core Feature Suite**
- **Dashboard**: Dynamic role-tailored overview with attendance rates, pending approvals, team statistics, and notices.
- **Employee Directory**: High-density DataTable with multi-criteria filtering, sorting, pagination, multi-step provisioning form, and 8-tab employee profile.
- **Departments & Org Hierarchy**: Visual organization chart and department budget management.
- **Workforce Management**:
  - **Attendance**: Shift check-in/out terminal, timesheet adjustments, and punctuality monitoring.
  - **Leave Management**: Leave balance allocations, request submission, and manager approval queues.
  - **Holidays**: Corporate and public holiday calendar.
- **Payroll**: Pay run processing, gross/tax/net deductions, and printable payslip statements.
- **Performance**: Strategic OKRs/KPIs, milestone progress sliders, and review appraisals.
- **Document Vault**: Encrypted storage repository with confidentiality gating.
- **Task Management**: Kanban board and list view for operational delegation.
- **Company Announcements**: Official executive bulletins and pinboard notices.
- **Analytics & Reports**: Department demographics, attendance utilization, and CSV data exports.
- **Recruitment Pipeline**: Job requisition manager and 1-click candidate-to-employee provisioning.
- **Audit Logs**: Immutable security compliance trail recording actors, actions, timestamps, and IP addresses.
- **Global Search**: Command palette (`Ctrl + K` / `Cmd + K`) for instant navigation.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router v7, Lucide Icons, Recharts.
- **Backend & Database**: Convex (Schema, real-time reactive queries, mutations, indexes, and storage).
- **Authentication**: Clerk React integrated with Convex + local multi-role RBAC simulator.

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

The application will launch on `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```

---

## 🎨 Enterprise Design Guidelines
- **Typography**: Headings set in **Manrope**, UI & Data set in **Inter**.
- **Light Theme**: Background `#F8F9FA`, Surface `#FFFFFF`, Border `#E5E7EB`, Text `#171717`.
- **Dark Theme**: Background `#101113`, Surface `#17181B`, Border `#292B30`, Text `#F5F5F5`.
- **No AI Tropes**: Zero purple neon gradients, glowing cards, floating blobs, robotic graphics, or hyperbolic marketing hype.
