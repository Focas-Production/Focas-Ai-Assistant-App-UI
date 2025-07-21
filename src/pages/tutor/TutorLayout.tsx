import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TutorSidebar from './TutorSidebar';
import TutorSession from './TutorSession';
import Sprint from './TutorSprint';
import TutorStudentDetails from './TutorStudentDetails';


const TutorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Tutor Sessions');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeLink) {
      case 'Tutor Sessions':
        return <TutorSession />;
      case 'Sprint':
        return <Sprint />;
      case 'Students':
        return <TutorStudentDetails />;
      default:
        return <TutorSession />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 font-inter">
      
      <TutorSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        onLogout={handleLogout}
      />

      <div className={`flex-1 transition-all duration-500 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        
        <header className="bg-white/40 backdrop-blur-lg border-b border-blue-100/40 shadow-md shadow-blue-100/20 px-6 py-4 flex items-center justify-between">
          
          <div className="text-sm text-gray-400 hidden md:block">
            Tutor / {activeLink}
          </div>

          <h1 className="text-xl font-bold text-right text-gray-700 tracking-tight w-full">
            {activeLink}
          </h1>
        </header>

        <main className="overflow-auto h-full bg-white/60 backdrop-blur-md">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
