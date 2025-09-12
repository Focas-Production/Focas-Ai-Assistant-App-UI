import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import AdminManagePeople from './AdminManagePeople';
import AdminStudentview from './AdminStudentview';
import AdminTutorview from './AdminTutorview';
import TutorSessionview from '../tutor/TutorSessionview';
import StudentReport from '../student/StudentReport';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Manage People');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    // All user management goes through AdminManagePeople with filtering
    switch (activeLink) {
      case 'Manage People':
        return <AdminManagePeople filterRole="all" />;
      case 'Students':
        return <AdminManagePeople filterRole="student" />;
      case 'Admins':
        return <AdminManagePeople filterRole="admin" />;
      case 'Tutors':
        return <AdminManagePeople filterRole="tutor" />;
      default:
        return <AdminManagePeople filterRole="all" />;
    }
  };

  // Handle sidebar navigation
  const handleSidebarNavigation = (link: string) => {
    console.log('Sidebar clicked:', link);
    setActiveLink(link);
    // Navigate to admin root to show the correct component
    navigate('/admin');
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 font-inter">
      
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeLink={activeLink}
        setActiveLink={handleSidebarNavigation}
        onLogout={handleLogout}
        variant="admin"
      />

      <div className={`flex-1 transition-all duration-500 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        
        <Navbar userType="admin" activeLink={activeLink} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto  from-blue-50 via-white to-blue-100 p-8">
          <Routes>
            <Route path="/" element={renderContent()} />
            <Route path="/student-view/:studentId" element={<AdminStudentview />} />
            <Route path="/tutor-view/:tutorId" element={<AdminTutorview />} />
            <Route path="/tutor-session-view/:sessionId" element={<TutorSessionview />} />
            <Route path="/student-report" element={<StudentReport />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
