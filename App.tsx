
import React, { useState } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { UserRole, StudentInfo } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  const handleLogin = (selectedRole: UserRole, info?: StudentInfo) => {
    setRole(selectedRole);
    if (info) setStudentInfo(info);
  };

  const handleLogout = () => {
    setRole(UserRole.NONE);
    setStudentInfo(null);
  };

  const renderContent = () => {
    switch (role) {
      case UserRole.NONE:
        return <LoginForm onLogin={handleLogin} />;
      case UserRole.STUDENT:
        return studentInfo ? <StudentDashboard info={studentInfo} /> : <LoginForm onLogin={handleLogin} />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return <LoginForm onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        role={role} 
        userName={role === UserRole.STUDENT ? studentInfo?.name : (role === UserRole.ADMIN ? 'Administrator' : undefined)}
        onLogout={handleLogout} 
      />
      
      <main className="pb-24">
        {renderContent()}
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 w-full py-5 bg-white border-t border-slate-100 text-center text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 z-40">
        Hackify • Intelligent College Infrastructure
      </footer>
    </div>
  );
};

export default App;
