
import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus, Priority } from '../types';
import { getComplaints, updateComplaintStatus } from '../services/storage';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  User, 
  ArrowUpRight,
  Inbox,
  LayoutGrid,
  List,
  RefreshCcw,
  Zap,
  ArrowRight,
  Trash2,
  Calendar,
  Building
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [remarks, setRemarks] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = () => {
    const all = getComplaints();
    setComplaints(all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleUpdate = (status: ComplaintStatus) => {
    if (selectedComplaint) {
      updateComplaintStatus(selectedComplaint.id, status, remarks);
      setRemarks('');
      setSelectedComplaint(null);
      loadComplaints();
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = c.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.studentInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === ComplaintStatus.SUBMITTED).length,
    resolved: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length,
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.LOW: return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case Priority.MEDIUM: return "bg-amber-100 text-amber-700 border-amber-200";
      case Priority.HIGH: return "bg-orange-100 text-orange-700 border-orange-200";
      case Priority.URGENT: return "bg-rose-100 text-rose-700 border-rose-200 animate-pulse";
    }
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.SUBMITTED: return <Zap className="text-indigo-500" size={14} />;
      case ComplaintStatus.UNDER_REVIEW: return <Clock className="text-violet-500" size={14} />;
      case ComplaintStatus.RESOLVED: return <CheckCircle className="text-emerald-500" size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="group bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] p-8 shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-2">Total Load</p>
              <h3 className="text-4xl font-black text-white">{stats.total}</h3>
            </div>
            <div className="p-4 bg-white/10 text-white rounded-[1.5rem] backdrop-blur-md">
              <Inbox size={32} strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div className="group bg-gradient-to-br from-violet-600 to-violet-700 rounded-[2rem] p-8 shadow-xl shadow-violet-200 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-xs font-black uppercase tracking-widest mb-2">Awaiting Review</p>
              <h3 className="text-4xl font-black text-white">{stats.pending}</h3>
            </div>
            <div className="p-4 bg-white/10 text-white rounded-[1.5rem] backdrop-blur-md">
              <Clock size={32} strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div className="group bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[2rem] p-8 shadow-xl shadow-emerald-200 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-2">Finalized</p>
              <h3 className="text-4xl font-black text-white">{stats.resolved}</h3>
            </div>
            <div className="p-4 bg-white/10 text-white rounded-[1.5rem] backdrop-blur-md">
              <CheckCircle size={32} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-100 p-8 mb-10">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:w-[32rem]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input
              type="text"
              placeholder="Filter by ID, student, or keyword..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-400 transition-all font-medium text-slate-600 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden lg:block mx-2"></div>
            <select
              className="bg-white border-2 border-slate-50 rounded-[1.25rem] px-6 py-3.5 font-black text-xs text-slate-600 uppercase tracking-widest focus:outline-none focus:border-indigo-300 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value={ComplaintStatus.SUBMITTED}>New Submitted</option>
              <option value={ComplaintStatus.UNDER_REVIEW}>Under Review</option>
              <option value={ComplaintStatus.RESOLVED}>Resolved</option>
            </select>
            <button onClick={loadComplaints} className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.25rem] hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm active:scale-95">
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}>
        {filteredComplaints.length === 0 ? (
          <div className="col-span-full py-24 text-center">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
               <Search size={48} />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No records matching criteria</p>
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <div 
              key={complaint.id}
              className={`bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group flex flex-col relative overflow-hidden ${selectedComplaint?.id === complaint.id ? 'ring-4 ring-indigo-500/10 border-indigo-400 scale-[1.02]' : 'hover:-translate-y-2'}`}
              onClick={() => setSelectedComplaint(complaint)}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-white bg-slate-900 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{complaint.id}</span>
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-wider ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority}
                </span>
              </div>
              
              <div className="flex-1">
                <p className="text-slate-800 font-bold line-clamp-2 text-xl leading-tight mb-6">{complaint.description}</p>
                
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100">
                      <User size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{complaint.studentInfo.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{complaint.studentInfo.class} • {complaint.studentInfo.rollNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                   {getStatusIcon(complaint.status)}
                   {complaint.status}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-300" />
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <ArrowUpRight size={24} className="text-slate-300 -mr-4 -mt-4" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-[0_32px_120px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-400 border border-white">
            <div className="p-12 relative">
              <div className="flex justify-between items-start mb-10">
                <div className="relative">
                  <div className="absolute -left-12 top-0 w-1.5 h-full bg-gradient-to-b from-indigo-600 to-violet-400 rounded-full"></div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Issue Management</h3>
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Processing Ticket <span className="text-indigo-600">#{selectedComplaint.id}</span></p>
                </div>
                <button 
                  onClick={() => setSelectedComplaint(null)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all active:scale-95"
                >
                  <RefreshCcw size={24} className="rotate-45" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
                <div className="space-y-6">
                  <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 relative group">
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">Statement</div>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{selectedComplaint.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-indigo-50/40 p-5 rounded-3xl border border-indigo-100 flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-500">
                        <Building size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-indigo-400 mb-0.5 tracking-widest">Routing</p>
                        <p className="text-xs text-indigo-800 font-black">{selectedComplaint.suggestedDepartment}</p>
                      </div>
                    </div>
                    <div className="flex-1 bg-violet-50/40 p-5 rounded-3xl border border-violet-100 flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm text-violet-500">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-violet-400 mb-0.5 tracking-widest">Category</p>
                        <p className="text-xs text-violet-800 font-black">{selectedComplaint.category}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Official Remark / Resolution</label>
                    <textarea
                      rows={4}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-400 transition-all resize-none text-sm font-bold text-black shadow-inner"
                      placeholder="Specify the action taken or required updates..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => handleUpdate(ComplaintStatus.RESOLVED)}
                      className="group flex items-center justify-between px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-emerald-100 overflow-hidden relative"
                    >
                      <span className="relative z-10">Mark as Resolved</span>
                      <CheckCircle size={22} className="relative z-10 group-hover:scale-125 transition-transform" />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </button>
                    <button
                      onClick={() => handleUpdate(ComplaintStatus.UNDER_REVIEW)}
                      className="group flex items-center justify-between px-8 py-5 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-violet-100 overflow-hidden relative"
                    >
                      <span className="relative z-10">Flag for Review</span>
                      <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
