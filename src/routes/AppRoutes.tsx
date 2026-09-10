import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';

// Lazy-loaded page components for high-performance code splitting
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const EmployeeList = lazy(() => import('@/pages/employees/EmployeeList').then(m => ({ default: m.EmployeeList })));
const EmployeeNew = lazy(() => import('@/pages/employees/EmployeeNew').then(m => ({ default: m.EmployeeNew })));
const EmployeeDetail = lazy(() => import('@/pages/employees/EmployeeDetail').then(m => ({ default: m.EmployeeDetail })));
const EmployeeEdit = lazy(() => import('@/pages/employees/EmployeeEdit').then(m => ({ default: m.EmployeeEdit })));
const DepartmentList = lazy(() => import('@/pages/departments/DepartmentList').then(m => ({ default: m.DepartmentList })));
const DepartmentDetail = lazy(() => import('@/pages/departments/DepartmentDetail').then(m => ({ default: m.DepartmentDetail })));
const OrganizationChart = lazy(() => import('@/pages/organization/OrganizationChart').then(m => ({ default: m.OrganizationChart })));
const AttendancePage = lazy(() => import('@/pages/attendance/AttendancePage').then(m => ({ default: m.AttendancePage })));
const LeavePage = lazy(() => import('@/pages/leave/LeavePage').then(m => ({ default: m.LeavePage })));
const HolidaysPage = lazy(() => import('@/pages/holidays/HolidaysPage').then(m => ({ default: m.HolidaysPage })));
const PayrollPage = lazy(() => import('@/pages/payroll/PayrollPage').then(m => ({ default: m.PayrollPage })));
const PerformancePage = lazy(() => import('@/pages/performance/PerformancePage').then(m => ({ default: m.PerformancePage })));
const DocumentsPage = lazy(() => import('@/pages/documents/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const TasksPage = lazy(() => import('@/pages/tasks/TasksPage').then(m => ({ default: m.TasksPage })));
const AnnouncementsPage = lazy(() => import('@/pages/announcements/AnnouncementsPage').then(m => ({ default: m.AnnouncementsPage })));
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage').then(m => ({ default: m.ReportsPage })));
const RecruitmentPage = lazy(() => import('@/pages/recruitment/RecruitmentPage').then(m => ({ default: m.RecruitmentPage })));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AuditLogsPage = lazy(() => import('@/pages/audit/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const LandingPage = lazy(() => import('@/pages/landing/LandingPage').then(m => ({ default: m.LandingPage })));

function RouteLoadingFallback() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <span className="text-xs text-slate-400 font-mono">Loading module...</span>
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Public Landing & Authentication */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Application Container */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* People: Employees */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<EmployeeNew />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

          {/* People: Departments & Org */}
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />
          <Route path="/organization" element={<OrganizationChart />} />

          {/* Workforce */}
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/attendance/*" element={<AttendancePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/leave/*" element={<LeavePage />} />
          <Route path="/holidays" element={<HolidaysPage />} />

          {/* Payroll */}
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/payroll/*" element={<PayrollPage />} />

          {/* Performance */}
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/performance/*" element={<PerformancePage />} />

          {/* Resources */}
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/*" element={<DocumentsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/*" element={<TasksPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/announcements/*" element={<AnnouncementsPage />} />

          {/* Analytics & Reports */}
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/*" element={<ReportsPage />} />

          {/* Recruitment */}
          <Route path="/recruitment" element={<RecruitmentPage />} />
          <Route path="/recruitment/*" element={<RecruitmentPage />} />

          {/* System & Audit */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/*" element={<SettingsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
