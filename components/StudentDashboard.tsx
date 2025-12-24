
import React, { useState, useEffect } from 'react';
import { StudentInfo, Complaint, ComplaintStatus, Priority } from '../types';
import { getComplaints, saveComplaint } from '../services/storage';
import { analyzeComplaint } from '../services/geminiService';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Tag, 
  BrainCircuit,
  MessageSquarePlus,
  History,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface StudentDashboardProps {
  info: StudentInfo;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ info }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = () => {
    const all = getComplaints();
    setComplaints(all.filter(c => c.studentInfo.rollNumber === info.rollNumber));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const analysis = await analyzeComplaint(description);

    const newComplaint: Complaint = {
      id: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      studentId: info.rollNumber,
      studentInfo: info,
      description,
      category: category || analysis.category,
      status: ComplaintStatus.SUBMITTED,
      priority: analysis.priority,
      suggestedDepartment: analysis.suggestedDepartment,
      adminRemarks: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveComplaint(newComplaint);
    setDescription('');
    setCategory('');
    setIsSubmitting(false);
    setShowForm(false);
    loadComplaints();
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.SUBMITTED: return <Clock className="text-amber-500" size={16} />;
      case ComplaintStatus.UNDER_REVIEW: return <AlertCircle className="text-violet-500" size={16} />;
      case ComplaintStatus.RESOLVED: return <CheckCircle className="text-emerald-500" size={16} />;
    }
  };

  const getStatusClass = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.SUBMITTED: return "bg-amber-50 text-amber-700 border-amber-200";
      case ComplaintStatus.UNDER_REVIEW: return "bg-violet-50 text-violet-700 border-violet-200";
      case ComplaintStatus.RESOLVED: return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="relative">
          <div className="absolute -left-6 top-1 w-1 h-12 bg-gradient-to-b from-violet-600 to-cyan-400 rounded-full"></div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Desk</h2>
          <p className="text-slate-500 mt-2 font-bold flex items-center gap-2">
            Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">{info.name.split(' ')[0]}</span> 
            <Sparkles size={16} className="text-amber-400" />
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`group flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${
            showForm 
              ? 'bg-white text-slate-700 border-2 border-slate-100 hover:bg-slate-50' 
              : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-200 hover:shadow-indigo-300'
          }`}
        >
          {showForm ? 'Discard Changes' : (
            <><Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" /> Lodge Issue</>
          )}
        </button>
      </div>

      {showForm && (
        <div className="mb-12 animate-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-[3rem] p-10 shadow-2xl border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                  <MessageSquarePlus size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">New Complaint</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Describe the problem</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all resize-none font-medium text-slate-700 placeholder:text-slate-300 shadow-sm"
                    placeholder="E.g., The projector in room 302 is flickering..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Context / Category</label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-bold text-slate-600 cursor-pointer shadow-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Auto-Detect Category (AI)</option>
                        <option value="Academics">Academics</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Hygiene">Hygiene</option>
                        <option value="IT & Network">IT & Network</option>
                        <option value="Sports">Sports</option>
                      </select>
                      <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-indigo-600/5 border border-indigo-100/50 rounded-3xl p-5 flex items-start gap-4">
                      <div className="bg-indigo-600 p-2 rounded-xl text-white">
                        <BrainCircuit size={18} />
                      </div>
                      <p className="text-[11px] text-indigo-700 leading-relaxed font-bold">
                        Hackify AI will analyze your description to set priority and notify the relevant faculty members instantly.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-2xl shadow-slate-200 group"
                >
                  {isSubmitting ? (
                    <><RefreshCcw className="animate-spin" size={20} /> Processing via AI...</>
                  ) : (
                    <><Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Confirm & Send</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <History size={24} className="text-violet-500" />
            <h3 className="text-2xl font-black text-slate-800">Activity Log</h3>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{complaints.length} Records found</span>
        </div>
        
        {complaints.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-16 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
              <History size={40} />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No entries yet</p>
          </div>
        ) : (
          complaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className="group bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-white bg-slate-900 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{complaint.id}</span>
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border flex items-center gap-2 uppercase tracking-wider ${getStatusClass(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      {complaint.status}
                    </span>
                    <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">
                      {complaint.category}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 line-clamp-3 leading-relaxed mb-6">{complaint.description}</h4>
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <Clock size={14} className="text-slate-300" />
                      {new Date(complaint.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                {complaint.adminRemarks && (
                  <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-[1.5rem] p-6 md:max-w-xs border border-violet-100 relative group/remark shadow-sm">
                    <div className="absolute -top-3 -right-3 p-2 bg-white rounded-xl shadow-sm border border-violet-50 text-violet-500">
                       <ShieldCheck size={16} />
                    </div>
                    <p className="text-[10px] uppercase font-black text-violet-500 mb-3 tracking-widest">Official Response</p>
                    <p className="text-xs text-black font-bold leading-relaxed italic">"{complaint.adminRemarks}"</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Help with missing RefreshCcw
const RefreshCcw = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);

export default StudentDashboard;
