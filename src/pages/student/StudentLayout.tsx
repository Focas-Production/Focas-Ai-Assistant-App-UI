declare global {
  interface Window {
    clearStudentData: () => void;
    checkStudentData: () => void;
  }
}
import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import StudentDashboard from '../student/StudentDashboard';
import AiAssistant from '../student/StudentAiAssistant';
import StudentSessions from '../student/StudentSessions';
import Allocation from '../student/StudentAllocation';
import StudentReport from '../student/StudentReport';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

interface AllocationData {
  subject: string;
  chapter: string;
  session: string;
  room: string;
}

const StudentLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Allocation');
  const [allocationCompleted, setAllocationCompleted] = useState(false);
  const [skipAllocation, setSkipAllocation] = useState(false);
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAllocationData = localStorage.getItem('studentAllocationData');
    const savedAllocationCompleted = localStorage.getItem('studentAllocationCompleted');
    const savedSkipAllocation = localStorage.getItem('studentSkipAllocation');
    const savedActiveLink = localStorage.getItem('studentActiveLink');

    // Debug logging
    console.log('Loading student state from localStorage:');
    console.log('savedAllocationData:', savedAllocationData);
    console.log('savedAllocationCompleted:', savedAllocationCompleted);
    console.log('savedSkipAllocation:', savedSkipAllocation);
    console.log('savedActiveLink:', savedActiveLink);

    // Check if we have proper allocation data
    const hasAllocationData = savedAllocationData && savedAllocationData !== 'null';

    if (hasAllocationData) {
      setAllocationData(JSON.parse(savedAllocationData));
    }

    if (savedAllocationCompleted === 'true') {
      setAllocationCompleted(true);
    }

    if (savedSkipAllocation === 'true') {
      setSkipAllocation(true);
    }

    // Restore the saved active link if it exists
    if (savedActiveLink) {
      setActiveLink(savedActiveLink);
    } else {
      // Only default to Allocation if no saved state exists
      setActiveLink('Allocation');
    }

    console.log('Restored state from localStorage');
    setIsInitialized(true);
  }, []);

  const handleLogout = () => {
    // Clear user authentication data AND student state data
    localStorage.removeItem('userInfo');
    // Clear student state so next login starts fresh
    localStorage.removeItem('studentAllocationData');
    localStorage.removeItem('studentAllocationCompleted');
    localStorage.removeItem('studentSkipAllocation');
    localStorage.removeItem('studentActiveLink');
    // Keep other data: sessionStudents, sprintData, etc.
    navigate('/login');
  };

  // Function to clear localStorage for testing (you can call this in browser console)
  const clearStudentData = () => {
    console.log('Clearing all student localStorage data...');
    localStorage.removeItem('studentAllocationData');
    localStorage.removeItem('studentAllocationCompleted');
    localStorage.removeItem('studentSkipAllocation');
    localStorage.removeItem('studentActiveLink');
    localStorage.removeItem('sessionStudents');
    localStorage.removeItem('sprintData');
    console.log('Student data cleared. Reloading page...');
    window.location.reload();
  };

  // Function to check current localStorage state (for debugging)
  const checkStudentData = () => {
    console.log('Current localStorage state:');
    console.log('studentAllocationData:', localStorage.getItem('studentAllocationData'));
    console.log('studentAllocationCompleted:', localStorage.getItem('studentAllocationCompleted'));
    console.log('studentSkipAllocation:', localStorage.getItem('studentSkipAllocation'));
    console.log('studentActiveLink:', localStorage.getItem('studentActiveLink'));
    console.log('sessionStudents:', localStorage.getItem('sessionStudents'));
    console.log('sprintData:', localStorage.getItem('sprintData'));
  };

  // Expose functions to window for testing
  useEffect(() => {
  (window as Window & typeof globalThis).clearStudentData = clearStudentData;
  (window as Window & typeof globalThis).checkStudentData = checkStudentData;
  }, []);

  const handleAllocationSubmit = (data: AllocationData) => {
    setAllocationData(data);
    setAllocationCompleted(true);
    setSkipAllocation(false);
    setActiveLink('Dashboard');
    
    // Save to localStorage
    localStorage.setItem('studentAllocationData', JSON.stringify(data));
    localStorage.setItem('studentAllocationCompleted', 'true');
    localStorage.setItem('studentSkipAllocation', 'false');
    localStorage.setItem('studentActiveLink', 'Dashboard');
  };

  const handleSkipAllocation = () => {
    setSkipAllocation(true);
    setAllocationCompleted(false);
    setActiveLink('Sessions');
    
    // Save to localStorage
    localStorage.setItem('studentSkipAllocation', 'true');
    localStorage.setItem('studentAllocationCompleted', 'false');
    localStorage.setItem('studentActiveLink', 'Sessions');
  };

  const handleSidebarClick = (link: string) => {
    // If allocation is not completed and not skipped, only allow Allocation
    if (!allocationCompleted && !skipAllocation && link !== 'Allocation') {
      return;
    }
    
    // If allocation is skipped, disable Dashboard and AI Assistant
    if (skipAllocation && (link === 'Dashboard' || link === 'AI Assistant')) {
      return;
    }
    
    setActiveLink(link);
    // Save active link to localStorage
    localStorage.setItem('studentActiveLink', link);
  };

  // Determine sidebar state
  const isSidebarDisabled = !allocationCompleted && !skipAllocation;
  
  // Define allowed links based on state
  let allowedLinks: string[];
  if (skipAllocation) {
    // After clicking cross: only Allocation and Sessions enabled
    allowedLinks = ['Allocation', 'Sessions'];
  } else if (allocationCompleted) {
    // After submitting allocation: all links enabled
    allowedLinks = ['Allocation', 'Dashboard', 'AI Assistant', 'Sessions'];
  } else {
    // Initial state: only Allocation enabled
    allowedLinks = ['Allocation'];
  }
  
  // When skipped, we need to show disabled state for Dashboard and AI Assistant
  const shouldShowDisabledState = skipAllocation;

  // Don't render until initialization is complete
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    switch (activeLink) {
      case 'Allocation':
        return <Allocation onSubmit={handleAllocationSubmit} onSkip={handleSkipAllocation} />;
      case 'Dashboard':
        // return <StudentDashboard allocationData={allocationData} />;
        return <StudentDashboard />;
      case 'AI Assistant':
        return <AiAssistant />;
      case 'Sessions':
        return <StudentSessions />;
      default:
        // return <StudentDashboard allocationData={allocationData} />;
        return <StudentDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 font-inter">
      
      <Sidebar
        variant="student"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeLink={activeLink}
        setActiveLink={handleSidebarClick}
        onLogout={handleLogout}
        disabled={isSidebarDisabled}
        allowedLinks={allowedLinks}
        showDisabledState={shouldShowDisabledState}
      />

      <div className={`flex-1 transition-all duration-500 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        
        <Navbar userType="student" activeLink={activeLink} />

        <main className="overflow-auto h-full bg-white/60 backdrop-blur-md">
          <Routes>
            <Route path="/" element={renderContent()} />
            <Route path="/report" element={<StudentReport showSidebar={false} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
