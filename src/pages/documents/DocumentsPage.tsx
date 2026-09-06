import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog, ConfirmDialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import {
  FolderLock,
  Upload,
  FileText,
  Download,
  Trash2,
  Lock,
  Search,
  Filter,
} from 'lucide-react';
import { DocumentCategory, DocumentItem } from '@/types/document';
import { PageTransition, RevealCard } from '@/components/motion/Motion';

export function DocumentsPage() {
  const { documents, employees, uploadDocument, deleteDocument } = useData();
  const { currentUser, role, hasPermission, currentOrg } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Employment Contract' as DocumentCategory,
    employeeId: currentUser.employeeId || 'emp_004',
    isConfidential: true,
  });

  const canManage = hasPermission('documents.manage');

  const categories: DocumentCategory[] = [
    'Employment Contract',
    'ID Proof',
    'Policy',
    'Certificates',
    'Resume',
    'Offer Letter',
    'Payslips',
    'Other',
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q) ||
          (doc.employeeName && doc.employeeName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [documents, selectedCategory, searchTerm]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name.trim()) return;

    const emp = employees.find((e) => e.id === uploadForm.employeeId);

    uploadDocument({
      organizationId: currentOrg.id,
      employeeId: uploadForm.employeeId || undefined,
      employeeName: emp?.fullName || undefined,
      name: uploadForm.name.trim().endsWith('.pdf')
        ? uploadForm.name.trim()
        : `${uploadForm.name.trim()}.pdf`,
      category: uploadForm.category,
      fileSizeFormatted: '1.2 MB',
      fileType: 'application/pdf',
      uploadedBy: currentUser.name,
      isConfidential: uploadForm.isConfidential,
    });

    setIsUploadOpen(false);
    setUploadForm({
      name: '',
      category: 'Employment Contract',
      employeeId: currentUser.employeeId || 'emp_004',
      isConfidential: true,
    });
  };

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        title="Document Vault & Storage"
        description="Secure enterprise repository for employment agreements, verified ID proofs, certifications, and compliance policies."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Documents' }]}
        actions={
          <Button size="sm" leftIcon={<Upload className="w-4 h-4" />} onClick={() => setIsUploadOpen(true)}>
            Upload Document
          </Button>
        }
      />

      {/* Toolbar & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents by filename or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8.5 rounded-md border border-slate-300 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-[#292B30] dark:bg-[#101113] dark:text-slate-100"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter documents by category"
            className="h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-slate-500">{filteredDocs.length} documents</span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc, idx) => (
          <RevealCard
            key={doc.id}
            delayMs={30 * (idx + 1)}
            className="p-4 flex flex-col justify-between text-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="neutral" size="sm">
                  {doc.category}
                </Badge>
                {doc.isConfidential && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    <Lock className="w-3 h-3" />
                    Confidential
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate" title={doc.name}>
                    {doc.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {doc.fileSizeFormatted} · {doc.employeeName ? `For ${doc.employeeName}` : 'Company-wide'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#202227] flex items-center justify-between text-[11px] text-slate-400">
              <span>{formatDate(doc.uploadedAt)}</span>
              <div className="flex items-center gap-1">
                <Button size="xs" variant="ghost" leftIcon={<Download className="w-3 h-3" />}>
                  Download
                </Button>
                {canManage && (
                  <button
                    onClick={() => setDeleteId(doc.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </RevealCard>
        ))}
      </div>

      {/* Upload Document Dialog */}
      <Dialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Document to Vault"
        description="Upload encrypted personnel file or organizational policy."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Name"
            required
            placeholder="e.g. Non_Disclosure_Agreement_2026.pdf"
            value={uploadForm.name}
            onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Document Category"
              value={uploadForm.category}
              onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as any })}
              options={categories.map((c) => ({ value: c, label: c }))}
            />
            <Select
              label="Associated Employee"
              value={uploadForm.employeeId}
              onChange={(e) => setUploadForm({ ...uploadForm, employeeId: e.target.value })}
            >
              <option value="">General / Company-wide</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="confidential"
              checked={uploadForm.isConfidential}
              onChange={(e) => setUploadForm({ ...uploadForm, isConfidential: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="confidential" className="text-xs text-slate-700 dark:text-slate-300">
              Restrict to authorized HR / Manager roles only (Confidential)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#202227]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Upload Document
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
            deleteDocument(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Document"
        message="Are you sure you want to permanently delete this document from storage?"
        confirmText="Delete Document"
        variant="danger"
      />
    </PageTransition>
  );
}
