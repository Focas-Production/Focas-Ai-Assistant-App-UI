import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './AdminManagePeople';
import StudentDetails from './AdminStudentDetails';
import AdminStudentview from './AdminStudentview';
import AdminDetails from './AdminDetails';
import TutorDetails from './AdminTutorDetails';
import AdminTutorview from './AdminTutorview';
import TutorSessionview from '../tutor/TutorSessionview';
import StudentReport from '../student/StudentReport';
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Manage People');
  const navigate = useNavigate();
  const location = useLocation();



  const handleLogout = () => {
    // Only clear user authentication data, preserve all other data
    localStorage.removeItem('userInfo');
    // Keep all other data: adminPeopleData, etc.
    navigate('/login');
  };

  const renderContent = () => {
    // Handle normal admin navigation
    switch (activeLink) {
      case 'Manage People':
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

  // Handle sidebar navigation
  const handleSidebarNavigation = (link: string) => {
    console.log('Sidebar clicked:', link);
    setActiveLink(link);
    // Navigate to admin root to show the correct component
    navigate('/admin');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 font-inter">
      
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
        <main className="overflow-auto h-full bg-white/60 backdrop-blur-md relative">
          <Routes>
            <Route path="/" element={renderContent()} />
            <Route path="/student-view/:studentId" element={<AdminStudentview setActiveLink={setActiveLink} />} />
            <Route path="/tutor-view/:tutorId" element={<AdminTutorview setActiveLink={setActiveLink} />} />
            <Route path="/tutor-session-view/:sessionId" element={<TutorSessionview />} />
            <Route path="/student-report" element={<StudentReport showSidebar={false} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
