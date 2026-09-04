import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Select';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Shield,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { EmployeeStatus, EmploymentType, Gender, PayType } from '@/types/employee';

export function EmployeeNew() {
  const { addEmployee, departments, employees } = useData();
  const { currentOrg } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'MALE' as Gender,
    dateOfBirth: '1995-05-15',
    avatarUrl: '',
    address: '',
    city: 'New York',
    country: 'United States',
    postalCode: '10001',
    emergencyContactName: '',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '',
    departmentId: departments[0]?.id || 'dept_eng',
    designation: '',
    managerId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'FULL_TIME' as EmploymentType,
    workLocation: 'Hybrid' as 'On-site' | 'Remote' | 'Hybrid',
    status: 'ACTIVE' as EmployeeStatus,
    salary: 95000,
    payType: 'SALARIED' as PayType,
    currency: 'USD',
    bankAccountNumber: '',
    taxIdentificationNumber: '',
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.designation.trim()) errs.designation = 'Designation/Job Title is required';
    if (!formData.salary || formData.salary <= 0) errs.salary = 'Please specify a valid positive salary';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const selectedDeptObj = departments.find((d) => d.id === formData.departmentId);
    const selectedManagerObj = employees.find((e) => e.id === formData.managerId);
    const generatedCode = `EMP-00${String(employees.length + 101)}`;

    setTimeout(() => {
      addEmployee({
        organizationId: currentOrg.id,
        employeeCode: generatedCode,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        avatarUrl:
          formData.avatarUrl.trim() ||
          `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address.trim() || 'Corporate Office Address',
        city: formData.city.trim(),
        country: formData.country.trim(),
        postalCode: formData.postalCode.trim(),
        emergencyContact: {
          name: formData.emergencyContactName.trim() || 'Emergency Contact',
          relationship: formData.emergencyContactRelation,
          phone: formData.emergencyContactPhone.trim() || formData.phone.trim(),
        },
        departmentId: formData.departmentId,
        departmentName: selectedDeptObj?.name || 'General',
        designation: formData.designation.trim(),
        managerId: formData.managerId || undefined,
        managerName: selectedManagerObj?.fullName || undefined,
        joiningDate: formData.joiningDate,
        employmentType: formData.employmentType,
        workLocation: formData.workLocation,
        status: formData.status,
        salary: Number(formData.salary),
        payType: formData.payType,
        currency: formData.currency,
        bankAccountNumber: formData.bankAccountNumber.trim() || '**** **** 8921',
        taxIdentificationNumber: formData.taxIdentificationNumber.trim() || 'XXX-XX-1100',
        bio: formData.bio.trim(),
      });

      setIsSubmitting(false);
      navigate('/employees');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Add New Employee"
        description="Create a verified employee record and provision workforce access."
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Employees', href: '/employees' },
          { label: 'New Employee' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal Information */}
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-[#202227] pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              1. Personal Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Legal identity details for compliance and personnel records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={errors.firstName}
              placeholder="e.g. Rahul"
            />
            <Input
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={errors.lastName}
              placeholder="e.g. Sharma"
            />
            <Input
              label="Date of Birth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
              options={[
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'NON_BINARY', label: 'Non-Binary' },
                { value: 'PREFER_NOT_TO_SAY', label: 'Prefer Not to Say' },
              ]}
            />
            <div className="sm:col-span-2">
              <Input
                label="Profile Photo URL (Optional)"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                helperText="Leave empty to use default initials avatar"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Emergency */}
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-[#202227] pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              2. Contact & Emergency Details
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct contact channels and official emergency contact point.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Work / Official Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="e.g. rahul.sharma@apexglobal.com"
            />
            <Input
              label="Phone Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              placeholder="+1 (555) 000-0000"
            />
            <div className="sm:col-span-2">
              <Input
                label="Residential Street Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Suite, Apt, Street name"
              />
            </div>
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="Postal / ZIP Code"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
            <Input
              label="Emergency Contact Name"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              placeholder="Contact Person Full Name"
            />
            <Input
              label="Emergency Contact Phone"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              placeholder="+1 (555) 999-9999"
            />
          </div>
        </div>

        {/* Section 3: Employment Details */}
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-[#202227] pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              3. Employment & Placement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department alignment, role designation, and reporting line.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              required
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              options={departments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }))}
            />
            <Input
              label="Designation / Job Title"
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              error={errors.designation}
              placeholder="e.g. Senior Software Engineer"
            />
            <Select
              label="Reporting Manager"
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
            >
              <option value="">No Manager (Direct Executive)</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.designation})
                </option>
              ))}
            </Select>
            <Input
              label="Joining Date"
              type="date"
              required
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
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
                { value: 'FREELANCER', label: 'Freelancer' },
              ]}
            />
            <Select
              label="Work Location"
              value={formData.workLocation}
              onChange={(e) => setFormData({ ...formData, workLocation: e.target.value as any })}
              options={[
                { value: 'Hybrid', label: 'Hybrid' },
                { value: 'On-site', label: 'On-site (HQ)' },
                { value: 'Remote', label: 'Remote' },
              ]}
            />
            <Select
              label="Initial Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'PROBATION', label: 'Probation' },
              ]}
            />
          </div>
        </div>

        {/* Section 4: Compensation */}
        <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-[#202227] pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              4. Compensation & Financial
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Salary configuration and disbursement details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Annual Base Salary"
              type="number"
              required
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              error={errors.salary}
              placeholder="e.g. 120000"
            />
            <Select
              label="Pay Frequency / Type"
              value={formData.payType}
              onChange={(e) => setFormData({ ...formData, payType: e.target.value as PayType })}
              options={[
                { value: 'SALARIED', label: 'Salaried (Monthly)' },
                { value: 'HOURLY', label: 'Hourly' },
              ]}
            />
            <Input
              label="Bank Account Mask / Routing"
              value={formData.bankAccountNumber}
              onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
              placeholder="**** **** 8921"
            />
            <Input
              label="Tax Identification / SSN"
              value={formData.taxIdentificationNumber}
              onChange={(e) => setFormData({ ...formData, taxIdentificationNumber: e.target.value })}
              placeholder="XXX-XX-1100"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-[#292B30]">
          <Button variant="outline" type="button" onClick={() => navigate('/employees')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting} leftIcon={<CheckCircle className="w-4 h-4" />}>
            Save & Provision Employee
          </Button>
        </div>
      </form>
    </div>
  );
}
