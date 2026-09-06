import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { EmployeeList } from '@/pages/employees/EmployeeList';
import { EmployeeNew } from '@/pages/employees/EmployeeNew';
import { EmployeeDetail } from '@/pages/employees/EmployeeDetail';
import { EmployeeEdit } from '@/pages/employees/EmployeeEdit';
import { DepartmentList } from '@/pages/departments/DepartmentList';
import { DepartmentDetail } from '@/pages/departments/DepartmentDetail';
import { OrganizationChart } from '@/pages/organization/OrganizationChart';
import { AttendancePage } from '@/pages/attendance/AttendancePage';
import { LeavePage } from '@/pages/leave/LeavePage';
import { HolidaysPage } from '@/pages/holidays/HolidaysPage';
import { PayrollPage } from '@/pages/payroll/PayrollPage';
import { PerformancePage } from '@/pages/performance/PerformancePage';
import { DocumentsPage } from '@/pages/documents/DocumentsPage';
import { TasksPage } from '@/pages/tasks/TasksPage';
import { AnnouncementsPage } from '@/pages/announcements/AnnouncementsPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { RecruitmentPage } from '@/pages/recruitment/RecruitmentPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { AuditLogsPage } from '@/pages/audit/AuditLogsPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { LandingPage } from '@/pages/landing/LandingPage';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
}

export function AppRoutes() {
  return (
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
  );
}
