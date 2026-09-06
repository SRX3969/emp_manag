import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Users,
  Building,
  FileText,
  CheckSquare,
  Bell,
  CornerDownLeft,
  UserPlus,
  Clock,
  Calendar,
  DollarSign,
  ShieldCheck,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { employees, departments, documents, tasks, announcements } = useData();
  const { role } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickActions = useMemo(() => {
    const actions = [
      {
        id: 'act_emp_new',
        title: 'Add New Employee',
        subtitle: 'Register and provision personnel profile',
        category: 'Quick Actions',
        icon: <UserPlus className="w-4 h-4 text-blue-500" />,
        url: '/employees/new',
        adminOnly: true,
      },
      {
        id: 'act_attendance',
        title: 'Clock In / Shift Terminal',
        subtitle: 'Record daily shift attendance and work mode',
        category: 'Quick Actions',
        icon: <Clock className="w-4 h-4 text-emerald-500" />,
        url: '/attendance',
      },
      {
        id: 'act_leave',
        title: 'Apply for Leave',
        subtitle: 'Submit paid time-off or sick leave request',
        category: 'Quick Actions',
        icon: <Calendar className="w-4 h-4 text-amber-500" />,
        url: '/leave',
      },
      {
        id: 'act_payroll',
        title: 'Manage Payroll & Compensation',
        subtitle: 'Process pay periods and view payslips',
        category: 'Quick Actions',
        icon: <DollarSign className="w-4 h-4 text-purple-500" />,
        url: '/payroll',
      },
      {
        id: 'act_audit',
        title: 'Security & Audit Logs',
        subtitle: 'Review immutable compliance activity trail',
        category: 'Quick Actions',
        icon: <ShieldCheck className="w-4 h-4 text-rose-500" />,
        url: '/audit-logs',
        adminOnly: true,
      },
      {
        id: 'act_settings',
        title: 'Organization Settings',
        subtitle: 'Configure company policies and preferences',
        category: 'Quick Actions',
        icon: <Settings className="w-4 h-4 text-slate-500" />,
        url: '/settings',
      },
    ];

    if (role === 'EMPLOYEE') {
      return actions.filter((a) => !a.adminOnly);
    }
    return actions;
  }, [role]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return quickActions;
    }
    const q = query.toLowerCase();

    const actionMatches = quickActions
      .filter((a) => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q))
      .map((a) => ({
        ...a,
        icon: a.icon,
      }));

    const empMatches = employees
      .filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q) ||
          e.departmentName.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        title: e.fullName,
        subtitle: `${e.employeeCode} · ${e.designation} (${e.departmentName})`,
        category: 'Employees',
        icon: <Users className="w-4 h-4 text-blue-500" />,
        url: `/employees/${e.id}`,
      }));

    const deptMatches = departments
      .filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
      .slice(0, 3)
      .map((d) => ({
        id: d.id,
        title: d.name,
        subtitle: `Code: ${d.code} · Manager: ${d.managerName || 'Unassigned'}`,
        category: 'Departments',
        icon: <Building className="w-4 h-4 text-emerald-500" />,
        url: `/departments/${d.id}`,
      }));

    const docMatches = documents
      .filter((doc) => doc.name.toLowerCase().includes(q) || doc.category.toLowerCase().includes(q))
      .slice(0, 3)
      .map((doc) => ({
        id: doc.id,
        title: doc.name,
        subtitle: `${doc.category} · ${doc.fileSizeFormatted}`,
        category: 'Documents',
        icon: <FileText className="w-4 h-4 text-amber-500" />,
        url: '/documents',
      }));

    const taskMatches = tasks
      .filter((t) => t.title.toLowerCase().includes(q) || t.assigneeName.toLowerCase().includes(q))
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        title: t.title,
        subtitle: `Assigned to ${t.assigneeName} · Priority: ${t.priority}`,
        category: 'Tasks',
        icon: <CheckSquare className="w-4 h-4 text-purple-500" />,
        url: '/tasks',
      }));

    const annMatches = announcements
      .filter((a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q))
      .slice(0, 2)
      .map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: `Published by ${a.authorName}`,
        category: 'Announcements',
        icon: <Bell className="w-4 h-4 text-rose-500" />,
        url: '/announcements',
      }));

    return [...actionMatches, ...empMatches, ...deptMatches, ...docMatches, ...taskMatches, ...annMatches];
  }, [query, quickActions, employees, departments, documents, tasks, announcements]);

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(searchResults[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 select-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] animate-reveal-fade" onClick={onClose} />

      {/* Command Palette Modal */}
      <div className="relative w-full max-w-xl rounded-xl bg-white dark:bg-[#17181B] border border-slate-200 dark:border-[#292B30] shadow-2xl overflow-hidden z-10 animate-reveal-scale">
        {/* Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-[#292B30]">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search employees, departments, tasks..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#202227] border border-slate-200 dark:border-[#292B30] text-[10px] text-slate-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
          {searchResults.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
              No results found for "<span className="font-medium text-slate-700 dark:text-slate-300">{query}</span>"
            </div>
          ) : (
            <div className="space-y-1">
              {!query.trim() && (
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  Suggested Actions & Shortcuts
                </div>
              )}
              {searchResults.map((item, idx) => (
                <div
                  key={`${item.category}-${item.id}`}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-xs transition-colors ${
                    selectedIndex === idx
                      ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-200 font-medium'
                      : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-[#1D1F23] dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-md bg-slate-100 dark:bg-[#202227] shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#202227] text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                    {selectedIndex === idx && <CornerDownLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Keyboard Navigation Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-[#202227] bg-slate-50/50 dark:bg-[#131417] text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1D1F23] border border-slate-200 dark:border-[#292B30] text-[10px] font-mono">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1D1F23] border border-slate-200 dark:border-[#292B30] text-[10px] font-mono">
                ↵
              </kbd>{' '}
              Execute
            </span>
          </div>
          <span className="font-mono text-[10px]">Command Palette</span>
        </div>
      </div>
    </div>
  );
}
