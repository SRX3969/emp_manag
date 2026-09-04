export type DocumentCategory =
  | 'Resume'
  | 'Offer Letter'
  | 'Employment Contract'
  | 'ID Proof'
  | 'Certificates'
  | 'Payslips'
  | 'Policy'
  | 'Other';

export interface DocumentItem {
  id: string;
  organizationId: string;
  employeeId?: string; // If null, company-wide document
  employeeName?: string;
  name: string;
  category: DocumentCategory;
  fileSizeFormatted: string;
  fileType: string;
  storageId?: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  isConfidential: boolean;
}
