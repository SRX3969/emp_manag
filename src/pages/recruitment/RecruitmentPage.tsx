import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import {
  Briefcase,
  UserPlus,
  Plus,
  Mail,
  Phone,
  ArrowRight,
  UserCheck,
  Star,
  Building,
} from 'lucide-react';
import { Candidate, CandidateStage, JobOpening } from '@/types/system';

export function RecruitmentPage() {
  const {
    jobs,
    candidates,
    departments,
    addJob,
    updateCandidateStage,
    convertCandidateToEmployee,
  } = useData();
  const { hasPermission, currentOrg } = useAuth();

  const [activeTab, setActiveTab] = useState('pipeline');
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [hireCandidate, setHireCandidate] = useState<Candidate | null>(null);

  const [hireForm, setHireForm] = useState({
    departmentId: departments[0]?.id || 'dept_eng',
    designation: '',
    salary: 120000,
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    departmentId: departments[0]?.id || 'dept_eng',
    location: 'New York, NY (Hybrid)',
    employmentType: 'Full-Time',
    openPositions: 1,
    experienceLevel: 'Senior (4+ years)',
    salaryRange: '$120,000 - $145,000',
    description: '',
  });

  const canManage = hasPermission('recruitment.manage');
  const stages: CandidateStage[] = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'];

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title.trim()) return;

    const dept = departments.find((d) => d.id === jobForm.departmentId);

    addJob({
      organizationId: currentOrg.id,
      title: jobForm.title.trim(),
      departmentId: jobForm.departmentId,
      departmentName: dept?.name || 'Engineering',
      location: jobForm.location,
      employmentType: jobForm.employmentType,
      openPositions: Number(jobForm.openPositions),
      status: 'ACTIVE',
      experienceLevel: jobForm.experienceLevel,
      salaryRange: jobForm.salaryRange,
      description: jobForm.description.trim(),
    });

    setIsAddJobOpen(false);
  };

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireCandidate) return;

    convertCandidateToEmployee(
      hireCandidate.id,
      hireForm.departmentId,
      hireForm.designation.trim() || hireCandidate.jobTitle,
      Number(hireForm.salary)
    );

    setHireCandidate(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Acquisition & Recruitment"
        description="Candidate pipelines, applicant screening stages, interview scoring, and direct employee provisioning."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Recruitment' }]}
        actions={
          canManage && (
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddJobOpen(true)}>
              Post Job Opening
            </Button>
          )
        }
      />

      <Tabs
        tabs={[
          { id: 'pipeline', label: 'Candidate Pipeline', count: candidates.length },
          { id: 'jobs', label: 'Open Positions', count: jobs.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Pipeline Kanban */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {stages.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage);

            return (
              <div
                key={stage}
                className="rounded-lg border border-slate-200 bg-slate-50/50 dark:border-[#292B30] dark:bg-[#131417] p-3 flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-[#292B30]">
                  <span className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300">
                    {stage}
                  </span>
                  <span className="rounded-full bg-slate-200 dark:bg-[#202227] px-2 py-0.2 text-[10px] font-bold">
                    {stageCandidates.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      className="p-3 rounded-md border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-xs text-xs space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">
                          {cand.fullName}
                        </h4>
                        {cand.rating && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                            ★ {cand.rating}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 text-[11px] truncate">{cand.jobTitle}</p>
                      <p className="text-slate-400 text-[10px]">
                        {cand.yearsOfExperience} yrs exp · Prev: {cand.currentCompany || 'N/A'}
                      </p>

                      {cand.notes && (
                        <p className="p-1.5 rounded bg-slate-50 dark:bg-[#1D1F23] text-[10px] text-slate-600 dark:text-slate-400 italic">
                          "{cand.notes}"
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-100 dark:border-[#202227] flex items-center justify-between">
                        {/* Stage Selector */}
                        <select
                          value={cand.stage}
                          onChange={(e) => updateCandidateStage(cand.id, e.target.value as CandidateStage)}
                          aria-label="Update candidate stage"
                          className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] dark:border-[#292B30] dark:bg-[#1D1F23] dark:text-slate-300 focus:outline-none"
                        >
                          {stages.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {/* Convert to employee button if at OFFER stage */}
                        {cand.stage === 'OFFER' && (
                          <Button
                            size="xs"
                            variant="primary"
                            leftIcon={<UserCheck className="w-3 h-3" />}
                            onClick={() => {
                              setHireCandidate(cand);
                              setHireForm({
                                departmentId: departments[0]?.id || 'dept_eng',
                                designation: cand.jobTitle,
                                salary: 130000,
                              });
                            }}
                          >
                            Hire
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Job Openings */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm flex flex-col justify-between text-xs space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="success" size="sm">
                    {job.status}
                  </Badge>
                  <span className="text-slate-400 text-[11px]">{job.employmentType}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {job.title}
                </h4>
                <p className="text-slate-500 mt-0.5">
                  {job.departmentName} · {job.location}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#202227] space-y-1 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Compensation:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{job.salaryRange}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span>{job.experienceLevel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Job Modal */}
      <Dialog
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        title="Create Job Opening"
        description="Post an active hiring requisition."
      >
        <form onSubmit={handleCreateJob} className="space-y-4">
          <Input
            label="Position Title"
            required
            placeholder="e.g. Senior Security Engineer"
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={jobForm.departmentId}
              onChange={(e) => setJobForm({ ...jobForm, departmentId: e.target.value })}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
            />
            <Input
              label="Location"
              value={jobForm.location}
              onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Salary Range"
              placeholder="e.g. $130,000 - $160,000"
              value={jobForm.salaryRange}
              onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
            />
            <Input
              label="Experience Requirement"
              placeholder="e.g. 5+ years"
              value={jobForm.experienceLevel}
              onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
            />
          </div>
          <Textarea
            label="Job Description"
            rows={3}
            placeholder="Key role responsibilities..."
            value={jobForm.description}
            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddJobOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Post Opening
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Convert Candidate to Employee Modal */}
      <Dialog
        isOpen={!!hireCandidate}
        onClose={() => setHireCandidate(null)}
        title="Provision Candidate to Employee"
        description={`Convert ${hireCandidate?.fullName} into a verified personnel profile.`}
      >
        {hireCandidate && (
          <form onSubmit={handleHireSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-md bg-slate-50 dark:bg-[#1D1F23]">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{hireCandidate.fullName}</p>
              <p className="text-slate-500">{hireCandidate.email} · {hireCandidate.phone}</p>
            </div>
            <Select
              label="Assigned Department"
              value={hireForm.departmentId}
              onChange={(e) => setHireForm({ ...hireForm, departmentId: e.target.value })}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
            />
            <Input
              label="Official Job Title"
              required
              value={hireForm.designation}
              onChange={(e) => setHireForm({ ...hireForm, designation: e.target.value })}
            />
            <Input
              label="Agreed Base Annual Salary (USD)"
              type="number"
              required
              value={hireForm.salary}
              onChange={(e) => setHireForm({ ...hireForm, salary: Number(e.target.value) })}
            />

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
              <Button variant="outline" size="sm" type="button" onClick={() => setHireCandidate(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<UserCheck className="w-3.5 h-3.5" />}>
                Complete Hiring & Create Record
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
