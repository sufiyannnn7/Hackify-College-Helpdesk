
import React from 'react';
import { UserRole } from '../types';
import { LogOut, GraduationCap, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  userName?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ role, userName, onLogout }) => {
  return (
    <header className="bg-white border-b-2 border-slate-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center group">
            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-3">
              <span className="text-4xl font-bold tracking-tight text-indigo-700 drop-shadow-sm font-cute">
                Hackify
              </span>
              <span className="hidden sm:block h-8 w-[3px] bg-indigo-100 rounded-full rotate-12"></span>
              <span className="text-lg sm:text-xl font-medium text-slate-800 tracking-tight font-cute">
                College Helpdesk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {role !== UserRole.NONE && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2 font-cute">
                    {role === UserRole.STUDENT ? <GraduationCap size={16} className="text-indigo-600" /> : <ShieldAlert size={16} className="text-rose-600" />}
                    {userName}
                  </p>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest leading-none mt-1 bg-indigo-50 px-2 py-1 rounded-full">
                    {role} ACCESS
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-rose-600 hover:text-white transition-all duration-300 border border-slate-200 hover:border-rose-500 hover:shadow-lg shadow-sm bounce-hover"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
