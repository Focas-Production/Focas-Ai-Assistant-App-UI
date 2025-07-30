import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMessageCircle, FiLayers, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';

interface AllocationData {
  subject: string;
  chapter: string;
  session: string;
  room: string;
  date?: string;
}

interface SprintData {
  id: number;
  name: string;
  topic: string;
  timer: {
    isRunning: boolean;
    time: number;
    startTime: number | null;
    duration: number;
  };
  feedback: string;
  status: string;
}

interface StudentDashboardProps {
  allocationData?: AllocationData | null;
}

const parseSessionTime = (session: string | undefined) => {
  if (!session || typeof session !== 'string' || !session.includes('-')) return [0, 0];
  const [start, end] = session.split(' - ');
  const parseFlexible = (t: string | undefined) => {
    if (!t) return 0;
    const match = t.match(/(\d{1,2})(?::(\d{2}))?(am|pm)/i);
    if (!match) return 0;
    let hour = parseInt(match[1], 10);
    let min = match[2] ? parseInt(match[2], 10) : 0;
    let period = match[3].toLowerCase();
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    return hour * 60 + min;
  };
  return [parseFlexible(start?.trim()), parseFlexible(end?.trim())];
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({ allocationData }) => {
  const [sprintData, setSprintData] = useState<SprintData[]>([]);
  const [currentTimer, setCurrentTimer] = useState<{ time: number; isRunning: boolean }>({ time: 0, isRunning: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [localAllocationData, setLocalAllocationData] = useState<AllocationData | null>(null);

  useEffect(() => {
    // Load allocation data from localStorage if not passed as props
    if (!allocationData) {
      const savedAllocationData = localStorage.getItem('studentAllocationData');
      if (savedAllocationData) {
        setLocalAllocationData(JSON.parse(savedAllocationData));
      }
    }

    const loadSprintData = () => {
      const data = JSON.parse(localStorage.getItem('sprintData') || '[]');
      setSprintData(data);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const currentStudent = data.find((sprint: SprintData) => sprint.name === userInfo.name);
      if (currentStudent) {
        setCurrentTimer({
          time: currentStudent.timer.time,
          isRunning: currentStudent.timer.isRunning
        });
      }
    };
    loadSprintData();
    const interval = setInterval(() => {
      const data = JSON.parse(localStorage.getItem('sprintData') || '[]');
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const currentStudent = data.find((sprint: SprintData) => sprint.name === userInfo.name);
      if (currentStudent && currentStudent.timer.isRunning) {
        setCurrentTimer({
          time: currentStudent.timer.time,
          isRunning: currentStudent.timer.isRunning
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [allocationData]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const currentStudentSprint = sprintData.find(sprint => sprint.name === userInfo.name);
  
  // Use allocationData from props or localStorage
  const finalAllocationData = allocationData || localAllocationData;

  // Always show table if allocation data exists
  let showTable = false;
  let tableData: any[] = [];
  
  if (finalAllocationData && finalAllocationData.subject && finalAllocationData.chapter) {
    showTable = true;
    
    // Check if tutor has allocated topic and status
    let topic = 'Pending';
    let status = 'Pending';
    
    if (currentStudentSprint) {
      // Only show tutor's topic if it's not the default "Topic 1"
      if (currentStudentSprint.topic && currentStudentSprint.topic !== 'Topic 1') {
        topic = currentStudentSprint.topic;
      }
      
      // Only show tutor's status if it's not the default "come to live"
      if (currentStudentSprint.status && currentStudentSprint.status !== 'come to live') {
        status = currentStudentSprint.status;
      }
    }
    
    tableData = [{
      subject: finalAllocationData.subject,
      chapter: finalAllocationData.chapter,
      topic: topic,
      status: status
    }];
  }

  // Pagination logic
  const totalItems = tableData.length;
  const paginatedTableData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'come to live':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen font-inter">
      {/* Timer Display */}
      {currentTimer.isRunning && (
        <div className="mb-6 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Session Timer</h3>
              <div className="text-4xl font-mono font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-xl border-2 border-blue-200">
                {formatTime(currentTimer.time)}
              </div>
            </div>
      </div>
        </div>
      )}

      {showTable ? (
        <div className="bg-white/100 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100">
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Subject</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Chapter</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Topic</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTableData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`${index < paginatedTableData.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200 cursor-pointer`}
                  >
                    <td className="py-4 px-4 text-gray-800 font-medium">{row.subject}</td>
                    <td className="py-4 px-4 text-gray-700">{row.chapter}</td>
                    <td className="py-4 px-4 text-gray-700">{row.topic}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(row.status)}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No allocation data found</h3>
          <p className="text-gray-600">Please complete your allocation first to see your dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
