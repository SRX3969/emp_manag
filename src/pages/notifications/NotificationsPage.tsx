import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { Bell, CheckCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageTransition } from '@/components/motion/Motion';

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <PageTransition className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Notification Center"
        description="Real-time alerts for leave approvals, payroll disbursements, announcements, and task updates."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Notifications' }]}
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-4 h-4" />}
              onClick={markAllNotificationsRead}
            >
              Mark All as Read
            </Button>
          ) : null
        }
      />

      <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#202227] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Activity Alerts
            </h3>
            {unreadCount > 0 && (
              <Badge variant="info" size="sm">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#202227]">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              You have no active alerts. All caught up!
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.linkUrl) navigate(notif.linkUrl);
                }}
                className={`px-6 py-4 flex items-start justify-between gap-4 text-xs transition-colors cursor-pointer ${
                  !notif.isRead
                    ? 'bg-blue-50/30 dark:bg-blue-950/20 hover:bg-blue-50/50'
                    : 'hover:bg-slate-50 dark:hover:bg-[#1D1F23]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-slate-100 dark:bg-[#1D1F23] text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {formatDateTime(notif.createdAt)}
                    </span>
                  </div>
                </div>

                {notif.linkUrl && (
                  <div className="shrink-0 self-center text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
