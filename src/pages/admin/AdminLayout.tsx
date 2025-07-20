import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import StudentDetails from './StudentDetails';
import AdminDetails from './AdminDetails';
import TutorDetails from './TutorDetails';
import AdminSidebar from './AdminSidebar';


const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Clear session/token here
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
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        onLogout={handleLogout}
      />

      <div className={`flex-1 transition-all duration-500 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="bg-white shadow px-8 py-6 border-b">
          <h1 className="text-xl font-bold">{activeLink}</h1>
        </header>

        <main className="overflow-auto h-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
