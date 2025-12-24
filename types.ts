
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  NONE = 'NONE'
}

export enum ComplaintStatus {
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  RESOLVED = 'Resolved'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface StudentInfo {
  name: string;
  class: string;
  division: string;
  rollNumber: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentInfo: StudentInfo;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: Priority;
  suggestedDepartment: string;
  adminRemarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysis {
  category: string;
  priority: Priority;
  suggestedDepartment: string;
}
