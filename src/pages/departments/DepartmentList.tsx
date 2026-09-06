import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Department } from '@/types/department';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Select';
import { formatCurrency } from '@/lib/utils';
import {
  Building2,
  Plus,
  Users,
  DollarSign,
  UserCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { PageTransition, RevealCard } from '@/components/motion/Motion';

export function DepartmentList() {
  const { departments, employees, addDepartment } = useData();
  const { hasPermission, currentOrg } = useAuth();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    managerId: '',
    annualBudget: 500000,
    colorHex: '#3B82F6',
  });

  const canManage = hasPermission('departments.manage');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const mgr = employees.find((e) => e.id === formData.managerId);

    addDepartment({
      organizationId: currentOrg.id,
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      managerId: formData.managerId || undefined,
      managerName: mgr?.fullName || undefined,
      managerEmail: mgr?.email || undefined,
      annualBudget: Number(formData.annualBudget),
      colorHex: formData.colorHex,
    });

    setIsCreateOpen(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      managerId: '',
      annualBudget: 500000,
      colorHex: '#3B82F6',
    });
  };

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        title="Departments & Teams"
        description="Functional business units, managerial hierarchy, and personnel allocation across Apex Global."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Departments' }]}
        actions={
          canManage && (
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
              New Department
            </Button>
          )
        }
      />

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept, idx) => {
          const deptEmployees = employees.filter((e) => e.departmentId === dept.id);
          const activeCount = deptEmployees.filter((e) => e.status === 'ACTIVE').length;

          return (
            <RevealCard
              key={dept.id}
              delayMs={40 * (idx + 1)}
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: dept.colorHex || '#3B82F6' }}
                    />
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {dept.code}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#202227] px-2 py-0.5 rounded">
                    {deptEmployees.length} members
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#202227] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Department Lead:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {dept.managerName || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      Annual Budget:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(dept.annualBudget)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#202227] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {activeCount} active personnel
                </span>
                <Link
                  to={`/departments/${dept.id}`}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View Roster</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </RevealCard>
          );
        })}
      </div>

      {/* Create Department Modal */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Department"
        description="Add a new organizational unit and assign a department manager."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Department Name"
            required
            placeholder="e.g. Artificial Intelligence Research"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department Code"
              required
              placeholder="e.g. AI-RES"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <Input
              label="Annual Budget (USD)"
              type="number"
              value={formData.annualBudget}
              onChange={(e) => setFormData({ ...formData, annualBudget: Number(e.target.value) })}
            />
          </div>
          <Select
            label="Department Lead / Manager"
            value={formData.managerId}
            onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
          >
            <option value="">Select Manager</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName} ({e.designation})
              </option>
            ))}
          </Select>
          <Textarea
            label="Description"
            rows={2}
            placeholder="Key responsibilities and strategic objectives of this department..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Department
            </Button>
          </div>
        </form>
      </Dialog>
    </PageTransition>
  );
}
