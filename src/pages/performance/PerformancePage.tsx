import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import { Target, Award, Plus, CheckCircle, TrendingUp, UserCheck, Star } from 'lucide-react';
import { PerformanceGoal, PerformanceReview, GoalStatus } from '@/types/performance';
import { PageTransition, RevealCard } from '@/components/motion/Motion';

export function PerformancePage() {
  const { goals, reviews, employees, addGoal, updateGoal, submitReview } = useData();
  const { currentUser, role, hasPermission, currentOrg } = useAuth();

  const [activeTab, setActiveTab] = useState('goals');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);

  const [goalForm, setGoalForm] = useState({
    employeeId: currentUser.employeeId || 'emp_004',
    title: '',
    description: '',
    category: 'INDIVIDUAL' as 'INDIVIDUAL' | 'DEPARTMENTAL' | 'STRATEGIC',
    targetDate: '2026-12-31',
    progressPercent: 25,
    metrics: '',
  });

  const [reviewForm, setReviewForm] = useState({
    rating: 4.5,
    comments: '',
  });

  const canManage = hasPermission('performance.manage');
  const isManager = role === 'MANAGER' || role === 'SUPER_ADMIN' || role === 'HR_ADMIN';

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;

    const emp = employees.find((e) => e.id === goalForm.employeeId);

    addGoal({
      organizationId: currentOrg.id,
      employeeId: goalForm.employeeId,
      employeeName: emp?.fullName || currentUser.name,
      title: goalForm.title.trim(),
      description: goalForm.description.trim(),
      category: goalForm.category,
      targetDate: goalForm.targetDate,
      progressPercent: Number(goalForm.progressPercent),
      status: 'IN_PROGRESS',
      metrics: goalForm.metrics.trim(),
    });

    setIsAddGoalOpen(false);
    setGoalForm({
      employeeId: currentUser.employeeId || 'emp_004',
      title: '',
      description: '',
      category: 'INDIVIDUAL',
      targetDate: '2026-12-31',
      progressPercent: 25,
      metrics: '',
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    submitReview(selectedReview.id, {
      rating: Number(reviewForm.rating),
      comments: reviewForm.comments.trim(),
      isManager: isManager && selectedReview.employeeId !== currentUser.employeeId,
    });

    setSelectedReview(null);
  };

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        title="Performance & Appraisals"
        description="Strategic OKRs, professional development goals, quarterly appraisals, and manager evaluations."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Performance' }]}
        actions={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddGoalOpen(true)}>
            Add Goal
          </Button>
        }
      />

      <Tabs
        tabs={[
          { id: 'goals', label: 'Goals & Objectives', count: goals.length },
          { id: 'reviews', label: 'Performance Reviews', count: reviews.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Goals */}
      {activeTab === 'goals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, idx) => (
            <RevealCard
              key={goal.id}
              delayMs={35 * (idx + 1)}
              className="p-5 text-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge
                    variant={
                      goal.category === 'STRATEGIC'
                        ? 'danger'
                        : goal.category === 'DEPARTMENTAL'
                          ? 'info'
                          : 'neutral'
                    }
                    size="sm"
                  >
                    {goal.category}
                  </Badge>
                  <span className="text-slate-400 text-[11px]">Due {formatDate(goal.targetDate)}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {goal.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {goal.description}
                </p>

                {goal.metrics && (
                  <div className="mt-2 p-2 rounded bg-slate-50 dark:bg-[#1D1F23] text-[11px] text-slate-600 dark:text-slate-400">
                    <strong>Success Metric:</strong> {goal.metrics}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#202227] space-y-2">
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-slate-500">Owner: {goal.employeeName}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {goal.progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#202227] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${goal.progressPercent}%` }}
                  />
                </div>
              </div>
            </RevealCard>
          ))}
        </div>
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-[#202227] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Appraisal Review Cycles
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#202227]">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar name={rev.employeeName} size="sm" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {rev.employeeName}
                        </h4>
                        <p className="text-slate-500 text-[11px]">
                          {rev.cycleName} · Manager: {rev.managerName}
                        </p>
                      </div>
                      <Badge variant={rev.status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                        {rev.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {rev.selfFeedback && (
                      <div className="p-3 rounded bg-slate-50 dark:bg-[#1D1F23] max-w-xl">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Employee Self-Evaluation (Rating: {rev.selfRating}/5.0):
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 italic">
                          "{rev.selfFeedback}"
                        </p>
                      </div>
                    )}

                    {rev.managerFeedback && (
                      <div className="p-3 rounded bg-blue-50/50 dark:bg-blue-950/30 max-w-xl">
                        <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-0.5">
                          Manager Evaluation (Rating: {rev.managerRating}/5.0):
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          "{rev.managerFeedback}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 self-end lg:self-center">
                    {rev.finalRating && (
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                          Final Score
                        </span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-heading">
                          {rev.finalRating} / 5.0
                        </span>
                      </div>
                    )}

                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        setSelectedReview(rev);
                        setReviewForm({
                          rating: rev.managerRating || rev.selfRating || 4.5,
                          comments: rev.managerFeedback || rev.selfFeedback || '',
                        });
                      }}
                    >
                      {rev.status === 'COMPLETED' ? 'Update Feedback' : 'Conduct Evaluation'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      <Dialog
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        title="Create Performance Goal / OKR"
        description="Define a quantifiable target date and success metric."
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Objective Title"
            required
            placeholder="e.g. Complete SOC2 Type II Audit Certification"
            value={goalForm.title}
            onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Goal Classification"
              value={goalForm.category}
              onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value as any })}
              options={[
                { value: 'INDIVIDUAL', label: 'Individual Competency' },
                { value: 'DEPARTMENTAL', label: 'Departmental Target' },
                { value: 'STRATEGIC', label: 'Strategic Company OKR' },
              ]}
            />
            <Input
              label="Target Completion Date"
              type="date"
              required
              value={goalForm.targetDate}
              onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
            />
          </div>
          <Input
            label="Quantifiable Success Metric"
            placeholder="e.g. 100% compliance checklist verified by external auditor"
            value={goalForm.metrics}
            onChange={(e) => setGoalForm({ ...goalForm, metrics: e.target.value })}
          />
          <Textarea
            label="Detailed Scope / Description"
            rows={2}
            placeholder="Key deliverables and milestones..."
            value={goalForm.description}
            onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddGoalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Goal
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Review Submission Modal */}
      <Dialog
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Performance Appraisal Evaluation"
        description={`Formal appraisal evaluation for ${selectedReview?.employeeName}`}
      >
        {selectedReview && (
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Evaluation Rating (1.0 to 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-100"
              />
            </div>

            <Textarea
              label="Evaluative Feedback & Professional Comments"
              required
              rows={4}
              placeholder="Highlight key achievements, strategic contributions, and areas of growth..."
              value={reviewForm.comments}
              onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
              <Button variant="outline" size="sm" type="button" onClick={() => setSelectedReview(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Formal Appraisal
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </PageTransition>
  );
}
