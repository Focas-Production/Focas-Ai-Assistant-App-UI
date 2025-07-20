import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './AdminDashboard';
import StudentDetails from './StudentDetails';
import AdminDetails from './AdminDetails';
import TutorDetails from './TutorDetails';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeLink) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Students':
        return <StudentDetails />;
      case 'Admins':
        return <AdminDetails />;
      case 'Tutors':
        return <TutorDetails />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 font-inter">
      
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        onLogout={handleLogout}
      />

      <div className={`flex-1 transition-all duration-500 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* Header */}
        <header className="bg-white/40 backdrop-blur-lg border-b border-blue-100/40 shadow-md shadow-blue-100/20 px-6 py-4 flex items-center justify-between">
          
          {/* Optional Logo or Breadcrumb */}
          <div className="text-sm text-gray-400 hidden md:block">
            Admin / {activeLink}
          </div>

          {/* Title to Right */}
          <h1 className="text-xl font-bold text-right text-gray-700 tracking-tight w-full">
            {activeLink}
          </h1>
        </header>

        {/* Main Content */}
        <main className="overflow-auto h-full bg-white/60 backdrop-blur-md">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
