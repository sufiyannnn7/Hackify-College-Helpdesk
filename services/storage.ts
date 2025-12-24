
import { Complaint } from "../types";

const STORAGE_KEY = 'hackify_complaints';

export const getComplaints = (): Complaint[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveComplaint = (complaint: Complaint) => {
  const complaints = getComplaints();
  complaints.push(complaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
};

export const updateComplaintStatus = (id: string, status: any, remarks: string) => {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  if (index !== -1) {
    complaints[index].status = status;
    complaints[index].adminRemarks = remarks;
    complaints[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }
};
