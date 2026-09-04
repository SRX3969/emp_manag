import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog, ConfirmDialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import { CalendarRange, Plus, Trash2, Calendar } from 'lucide-react';
import { Holiday } from '@/types/leave';

export function HolidaysPage() {
  const { holidays, addHoliday, deleteHoliday } = useData();
  const { hasPermission, currentOrg } = useAuth();

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    date: '2026-07-04',
    type: 'PUBLIC' as 'PUBLIC' | 'OPTIONAL' | 'COMPANY',
    description: '',
  });

  const canManage = hasPermission('settings.manage');

  const filteredHolidays = holidays.filter((h) => h.year === selectedYear);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date) return;

    const parsedDate = new Date(form.date);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(parsedDate);

    addHoliday({
      organizationId: currentOrg.id,
      name: form.name.trim(),
      date: form.date,
      dayOfWeek,
      type: form.type,
      year: parsedDate.getFullYear(),
      description: form.description.trim() || 'Company Recognized Holiday',
    });

    setIsAddModalOpen(false);
    setForm({
      name: '',
      date: '2026-07-04',
      type: 'PUBLIC',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Holiday Calendar"
        description="Public holidays, corporate designated non-working days, and optional cultural observances."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Holidays' }]}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              aria-label="Filter holidays by calendar year"
              className="h-8.5 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
            >
              <option value={2026}>Calendar Year 2026</option>
              <option value={2027}>Calendar Year 2027</option>
            </select>
            {canManage && (
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
                Add Holiday
              </Button>
            )}
          </div>
        }
      />

      {/* Holidays List */}
      <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#202227] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Scheduled Observances ({filteredHolidays.length})
          </h3>
          <span className="text-xs text-slate-500">Corporate Standard Calendar</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#202227]">
          {filteredHolidays.map((hol) => (
            <div
              key={hol.id}
              className="px-6 py-4 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-[#1D1F23]/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold text-center min-w-[54px]">
                  <span className="block text-[10px] uppercase tracking-wider">
                    {hol.dayOfWeek.slice(0, 3)}
                  </span>
                  <span className="text-base">{new Date(hol.date).getDate()}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {hol.name}
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {formatDate(hol.date)} · {hol.description || 'General Holiday'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    hol.type === 'PUBLIC'
                      ? 'success'
                      : hol.type === 'COMPANY'
                        ? 'info'
                        : 'warning'
                  }
                  size="sm"
                >
                  {hol.type}
                </Badge>
                {canManage && (
                  <button
                    onClick={() => setDeleteId(hol.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-[#1D1F23]"
                    title="Delete holiday"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Holiday Dialog */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Company Holiday"
        description="Configure an official holiday on the company calendar."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Holiday Title"
            required
            placeholder="e.g. Labor Day"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Select
              label="Classification"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              options={[
                { value: 'PUBLIC', label: 'Public Federal' },
                { value: 'COMPANY', label: 'Company Designated' },
                { value: 'OPTIONAL', label: 'Optional / Floating' },
              ]}
            />
          </div>
          <Input
            label="Description / Note"
            placeholder="e.g. Federal Holiday · Office Closed"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Holiday
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteHoliday(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Holiday"
        message="Are you sure you want to remove this holiday from the official corporate calendar?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
