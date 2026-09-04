import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import { Megaphone, Plus, Pin, CheckCircle2, Eye, Calendar } from 'lucide-react';
import { AnnouncementItem } from '@/types/system';

export function AnnouncementsPage() {
  const { announcements, createAnnouncement, markAnnouncementRead } = useData();
  const { currentUser, hasPermission, currentOrg } = useAuth();

  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'GENERAL' as AnnouncementItem['category'],
    isPinned: false,
  });

  const canPublish = hasPermission('settings.manage') || currentUser.role === 'HR_ADMIN';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    createAnnouncement({
      organizationId: currentOrg.id,
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorDesignation: currentUser.role === 'SUPER_ADMIN' ? 'Chief Executive Officer' : 'VP of Human Resources',
      isPinned: form.isPinned,
    });

    setIsPublishOpen(false);
    setForm({
      title: '',
      content: '',
      category: 'GENERAL',
      isPinned: false,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Announcements & Notices"
        description="Official executive bulletins, benefits policy notices, and corporate all-hands memos."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Announcements' }]}
        actions={
          canPublish && (
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsPublishOpen(true)}>
              Publish Notice
            </Button>
          )
        }
      />

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-6 rounded-lg border bg-white dark:bg-[#17181B] shadow-sm text-xs space-y-3 transition-all ${
              ann.isPinned
                ? 'border-blue-300 dark:border-blue-900/60 ring-1 ring-blue-100 dark:ring-blue-950'
                : 'border-slate-200 dark:border-[#292B30]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {ann.isPinned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                    <Pin className="w-3 h-3" /> Pinned Bulletin
                  </span>
                )}
                <Badge
                  variant={
                    ann.category === 'POLICY'
                      ? 'info'
                      : ann.category === 'URGENT'
                        ? 'danger'
                        : ann.category === 'EVENT'
                          ? 'warning'
                          : 'neutral'
                  }
                  size="sm"
                >
                  {ann.category}
                </Badge>
              </div>
              <span className="text-slate-400 text-[11px]">{formatDate(ann.publishedAt)}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
              {ann.title}
            </h3>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
              {ann.content}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-[#202227] flex items-center justify-between text-[11px] text-slate-400">
              <span>
                Published by <strong className="text-slate-600 dark:text-slate-300">{ann.authorName}</strong> ({ann.authorDesignation})
              </span>
              <button
                onClick={() => markAnnouncementRead(ann.id)}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Acknowledged ({ann.readCount} views)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Notice Modal */}
      <Dialog
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        title="Publish Company Notice"
        description="Broadcast an official bulletin to all organization personnel."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Notice Title"
            required
            placeholder="e.g. Annual Benefits Open Enrollment"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Classification"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              options={[
                { value: 'GENERAL', label: 'General Announcement' },
                { value: 'POLICY', label: 'Corporate Policy' },
                { value: 'EVENT', label: 'Company Event / All Hands' },
                { value: 'URGENT', label: 'Urgent Bulletin' },
              ]}
            />
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="pin-notice"
                checked={form.isPinned}
                onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="pin-notice" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Pin to top of bulletin board
              </label>
            </div>
          </div>
          <Textarea
            label="Notice Message Body"
            required
            rows={5}
            placeholder="Full memo text and official details..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsPublishOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Notice
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
