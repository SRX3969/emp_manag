import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  ListFilter,
  User,
} from 'lucide-react';
import { TaskItem, TaskPriority, TaskStatus } from '@/types/system';

export function TasksPage() {
  const { tasks, employees, addTask, updateTaskStatus } = useData();
  const { currentUser, currentOrg } = useAuth();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState<string>('ALL');

  const [form, setForm] = useState({
    title: '',
    description: '',
    assigneeId: currentUser.employeeId || 'emp_004',
    priority: 'MEDIUM' as TaskPriority,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

  const filteredTasks = tasks.filter((t) => {
    if (filterAssignee !== 'ALL' && t.assigneeId !== filterAssignee) return false;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const assignee = employees.find((e) => e.id === form.assigneeId);

    addTask({
      organizationId: currentOrg.id,
      title: form.title.trim(),
      description: form.description.trim(),
      assigneeId: form.assigneeId,
      assigneeName: assignee?.fullName || currentUser.name,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      priority: form.priority,
      status: 'TODO',
      dueDate: form.dueDate,
    });

    setIsNewTaskOpen(false);
    setForm({
      title: '',
      description: '',
      assigneeId: currentUser.employeeId || 'emp_004',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const getPriorityBadgeVariant = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & Deliverables"
        description="Operational task board, responsibility delegation, and team milestone tracking."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Tasks' }]}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              aria-label="Filter tasks by assignee"
              className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Team Members</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName}
                </option>
              ))}
            </select>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsNewTaskOpen(true)}>
              New Task
            </Button>
          </div>
        }
      />

      {/* Kanban Column View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map((status) => {
          const colTasks = filteredTasks.filter((t) => t.status === status);

          return (
            <div
              key={status}
              className="rounded-lg border border-slate-200 bg-slate-50/50 dark:border-[#292B30] dark:bg-[#131417] p-4 flex flex-col min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-[#292B30]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span>{status.replace('_', ' ')}</span>
                  <span className="rounded-full bg-slate-200 dark:bg-[#202227] px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {colTasks.length}
                  </span>
                </h3>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-md border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-xs text-xs space-y-2 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant={getPriorityBadgeVariant(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      <span className="text-slate-400 text-[10px]">
                        Due {formatDate(task.dueDate)}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-[#202227] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <Avatar name={task.assigneeName} size="xs" />
                        <span className="truncate max-w-[100px]">{task.assigneeName}</span>
                      </div>

                      {/* Status quick mover */}
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        aria-label="Update task status"
                        className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600 dark:border-[#292B30] dark:bg-[#1D1F23] dark:text-slate-300 focus:outline-none"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Dialog */}
      <Dialog
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        title="Assign New Task"
        description="Delegate a project action item with target deadline."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Task Title"
            required
            placeholder="e.g. Conduct Q3 Cloud Cost Audit"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assignee"
              value={form.assigneeId}
              onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
              options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
            />
            <Select
              label="Priority Level"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            required
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <Textarea
            label="Instructions / Description"
            rows={3}
            placeholder="Key deliverables and acceptance criteria..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewTaskOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Assign Task
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
