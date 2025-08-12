import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import TutorSession from './TutorSession';
import Sprint from './TutorSprint';
import TutorSessionview from './TutorSessionview';
import StudentReport from '../student/StudentReport';
// import TutorStudentDetails from './TutorStudentDetails';
import Navbar from '../../components/layout/Navbar';

const TutorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Tutor Sessions');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Only clear user authentication data, preserve all other data
    localStorage.removeItem('userInfo');
    // Keep all other data: tutorSessions, sessionStudents, sprintData, etc.
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeLink) {
      case 'Tutor Sessions':
        return <TutorSession />;
      case 'Sprint':
        return <Sprint />;
      
      default:
        return <TutorSession />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 font-inter">
      <Sidebar
        variant="tutor"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        onLogout={handleLogout}
      />
      <div className={`flex-1 transition-all duration-500 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        <Navbar userType="tutor" activeLink={activeLink} />
        <main className="overflow-auto h-full bg-white/60 backdrop-blur-md">
          <Routes>
            <Route path="/" element={renderContent()} />
            <Route path="session-view/:sessionId" element={<TutorSessionview />} />
            <Route path="student-report" element={<StudentReport />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
