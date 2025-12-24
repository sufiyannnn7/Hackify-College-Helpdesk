
import React, { useState } from 'react';
import { UserRole, StudentInfo } from '../types';
import { User, BookOpen, Hash, ArrowRight, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';

interface LoginFormProps {
  onLogin: (role: UserRole, info?: StudentInfo) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.STUDENT);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    class: '',
    division: '',
    rollNumber: '',
  });

  const [adminKey, setAdminKey] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentInfo.name && studentInfo.rollNumber) {
      onLogin(UserRole.STUDENT, studentInfo);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === 'ADMIN123') {
      onLogin(UserRole.ADMIN);
    } else {
      alert("Invalid Admin Credentials (Hint: ADMIN123)");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-violet-200 rounded-full blur-3xl opacity-40"></div>
        
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 relative z-10">
          <div className="flex p-3 gap-2 bg-slate-100/50">
            <button
              onClick={() => setActiveTab(UserRole.STUDENT)}
              className={`flex-1 py-4 rounded-[2rem] text-sm font-bold uppercase tracking-wider transition-all duration-300 font-cute ${
                activeTab === UserRole.STUDENT
                  ? 'bg-white text-indigo-700 shadow-md ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setActiveTab(UserRole.ADMIN)}
              className={`flex-1 py-4 rounded-[2rem] text-sm font-bold uppercase tracking-wider transition-all duration-300 font-cute ${
                activeTab === UserRole.ADMIN
                  ? 'bg-white text-rose-700 shadow-md ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="p-10">
            <div className="mb-10 text-center">
              <div className={`inline-flex p-5 rounded-[2.5rem] mb-6 shadow-sm border bounce-hover ${activeTab === UserRole.STUDENT ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                {activeTab === UserRole.STUDENT ? <GraduationCap size={48} strokeWidth={1.5} /> : <ShieldCheck size={48} strokeWidth={1.5} />}
              </div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight font-cute">
                {activeTab === UserRole.STUDENT ? 'Hi Student!' : 'Admin Area'}
              </h2>
              <p className="text-slate-500 text-base mt-2 font-medium">
                {activeTab === UserRole.STUDENT 
                  ? 'Step inside to get help.' 
                  : 'Authorized personnel only.'}
              </p>
            </div>

            {activeTab === UserRole.STUDENT ? (
              <form onSubmit={handleStudentSubmit} className="space-y-5">
                <div className="relative group">
                  <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    value={studentInfo.name}
                    onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
                    <input
                      required
                      type="text"
                      placeholder="Class"
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                      value={studentInfo.class}
                      onChange={(e) => setStudentInfo({ ...studentInfo, class: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
                    <input
                      required
                      type="text"
                      placeholder="Div"
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                      value={studentInfo.division}
                      onChange={(e) => setStudentInfo({ ...studentInfo, division: e.target.value })}
                    />
                  </div>
                </div>
                <div className="relative group">
                  <Hash className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
                  <input
                    required
                    type="text"
                    placeholder="Roll Number"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    value={studentInfo.rollNumber}
                    onChange={(e) => setStudentInfo({ ...studentInfo, rollNumber: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 text-lg font-cute bounce-hover"
                >
                  Let's Go! <ArrowRight size={22} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-4 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={22} />
                  <input
                    required
                    type="password"
                    placeholder="Admin Access Key"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl flex items-center gap-3 border border-rose-100">
                  <Sparkles size={20} className="text-rose-600" />
                  <p className="text-xs text-rose-700 font-bold uppercase tracking-widest font-cute">Admin Credentials Required</p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl text-lg font-cute bounce-hover"
                >
                  Login <ArrowRight size={22} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
