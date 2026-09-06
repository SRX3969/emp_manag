import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmployeeStatus, EmploymentType, Gender, PayType } from '@/types/employee';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/motion/Motion';

export function EmployeeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, departments, updateEmployee } = useData();

  const employee = employees.find((e) => e.id === id);

  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    departmentId: employee?.departmentId || '',
    designation: employee?.designation || '',
    managerId: employee?.managerId || '',
    employmentType: (employee?.employmentType || 'FULL_TIME') as EmploymentType,
    workLocation: (employee?.workLocation || 'Hybrid') as 'On-site' | 'Remote' | 'Hybrid',
    status: (employee?.status || 'ACTIVE') as EmployeeStatus,
    salary: employee?.salary || 2400000,
    panNumber: employee?.panNumber || employee?.taxIdentificationNumber || '',
    uanNumber: employee?.uanNumber || '',
    ifscCode: employee?.ifscCode || '',
    address: employee?.address || '',
    city: employee?.city || '',
    country: employee?.country || '',
    postalCode: employee?.postalCode || '',
  });

  if (!employee) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Employee record not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/employees')} className="mt-4">
          Back to Directory
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === formData.departmentId);
    const mgr = employees.find((e) => e.id === formData.managerId);

    updateEmployee(employee.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      departmentId: formData.departmentId,
      departmentName: dept?.name || employee.departmentName,
      designation: formData.designation,
      managerId: formData.managerId || undefined,
      managerName: mgr?.fullName || undefined,
      employmentType: formData.employmentType,
      workLocation: formData.workLocation,
      status: formData.status,
      salary: Number(formData.salary),
      panNumber: formData.panNumber,
      taxIdentificationNumber: formData.panNumber,
      uanNumber: formData.uanNumber,
      ifscCode: formData.ifscCode,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      postalCode: formData.postalCode,
    });

    navigate(`/employees/${employee.id}`);
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={`Edit: ${employee.fullName}`}
        description={`Update employment details, status, and compensation for ${employee.employeeCode}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Employees', href: '/employees' },
          { label: employee.fullName, href: `/employees/${employee.id}` },
          { label: 'Edit' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
            Core Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-[#202227] pb-3">
            Role & Organizational Alignment
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
            />
            <Input
              label="Designation"
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
            <Select
              label="Reporting Manager"
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
            >
              <option value="">No Manager (Direct Executive)</option>
              {employees
                .filter((e) => e.id !== employee.id)
                .map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.designation})
                  </option>
                ))}
            </Select>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'ON_LEAVE', label: 'On Leave' },
                { value: 'PROBATION', label: 'Probation' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'TERMINATED', label: 'Terminated' },
              ]}
            />
            <Select
              label="Employment Type"
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
              options={[
                { value: 'FULL_TIME', label: 'Full-Time' },
                { value: 'PART_TIME', label: 'Part-Time' },
                { value: 'CONTRACT', label: 'Contract' },
                { value: 'INTERN', label: 'Intern' },
              ]}
            />
            <Input
              label="Annual CTC / Salary (₹)"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
            />
            <Input
              label="Permanent Account Number (PAN)"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
              placeholder="e.g. AAAPS1234A"
            />
            <Input
              label="Universal Account Number (UAN / EPF)"
              value={formData.uanNumber}
              onChange={(e) => setFormData({ ...formData, uanNumber: e.target.value })}
              placeholder="e.g. 100982347101"
            />
            <Input
              label="Bank IFSC Code"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
              placeholder="e.g. HDFC0001234"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate(`/employees/${employee.id}`)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={<CheckCircle className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </PageTransition>
  );
}
