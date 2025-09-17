// import React, { useState, useEffect } from 'react';

// import Pagination from '../../components/common/Pagination';

// interface AllocationData {
//   subject: string;
//   chapter: string;
//   session: string;
//   room: string;
//   date?: string;
// }

// interface SprintData {
//   id: number;
//   name: string;
//   topic: string;
//   timer: {
//     isRunning: boolean;
//     time: number;
//     startTime: number | null;
//     duration: number;
//   };
//   feedback: string;
//   status: string;
// }

// interface StudentDashboardProps {
//   allocationData?: AllocationData | null;
// }


// const StudentDashboard: React.FC<StudentDashboardProps> = ({ allocationData }) => {
//   const [sprintData, setSprintData] = useState<SprintData[]>([]);
//   const [currentTimer, setCurrentTimer] = useState<{ time: number; isRunning: boolean }>({ time: 0, isRunning: false });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage] = useState(8);
//   const [localAllocationData, setLocalAllocationData] = useState<AllocationData | null>(null);

//   useEffect(() => {
//     // Load allocation data from localStorage if not passed as props
//     if (!allocationData) {
//       const savedAllocationData = localStorage.getItem('studentAllocationData');
//       if (savedAllocationData) {
//         setLocalAllocationData(JSON.parse(savedAllocationData));
//       }
//     }

//     const loadSprintData = () => {
//       const data = JSON.parse(localStorage.getItem('sprintData') || '[]');
//       setSprintData(data);
//       const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//       const currentStudent = data.find((sprint: SprintData) => sprint.name === userInfo.name);
//       if (currentStudent) {
//         setCurrentTimer({
//           time: currentStudent.timer.time,
//           isRunning: currentStudent.timer.isRunning
//         });
//       }
//     };
//     loadSprintData();
//     const interval = setInterval(() => {
//       const data = JSON.parse(localStorage.getItem('sprintData') || '[]');
//       const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//       const currentStudent = data.find((sprint: SprintData) => sprint.name === userInfo.name);
//       if (currentStudent && currentStudent.timer.isRunning) {
//         setCurrentTimer({
//           time: currentStudent.timer.time,
//           isRunning: currentStudent.timer.isRunning
//         });
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [allocationData]);

//   const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//   const currentStudentSprint = sprintData.find(sprint => sprint.name === userInfo.name);
  
//   // Use allocationData from props or localStorage
//   const finalAllocationData = allocationData || localAllocationData;

//   // Always show table if allocation data exists
//   let showTable = false;
//   interface AllocationTableRow {
//     subject: string;
//     chapter: string;
//     topic?: string;
//     status?: string;
//   }
//   let tableData: AllocationTableRow[] = [];
  
//   if (finalAllocationData && finalAllocationData.subject && finalAllocationData.chapter) {
//     showTable = true;
    
//     // Check if tutor has allocated topic and status
//     let topic = 'Pending';
//     let status = 'Pending';
    
//     if (currentStudentSprint) {
//       // Only show tutor's topic if it's not the default "Topic 1"
//       if (currentStudentSprint.topic && currentStudentSprint.topic !== 'Topic 1') {
//         topic = currentStudentSprint.topic;
//       }
      
//       // Only show tutor's status if it's not the default "come to live"
//       if (currentStudentSprint.status && currentStudentSprint.status !== 'come to live') {
//         status = currentStudentSprint.status;
//       }
//     }
    
//     tableData = [{
//       subject: finalAllocationData.subject,
//       chapter: finalAllocationData.chapter,
//       topic: topic,
//       status: status
//     }];
//   }
//   // Pagination logic
//   const totalItems = tableData.length;
//   const paginatedTableData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//         return 'text-green-600 bg-green-100';
//       case 'pending':
//         return 'text-orange-600 bg-orange-100';
//       case 'come to live':
//         return 'text-blue-600 bg-blue-100';
//       default:
//         return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="p-8   font-inter">
//       {/* Timer Display */}
//       {currentTimer.isRunning && (
//         <div className="mb-6 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
//           <div className="flex items-center justify-center">
//             <div className="text-center">
//               <h3 className="text-lg font-semibold text-blue-700 mb-2">Session Timer</h3>
//               <div className="text-4xl font-mono font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-xl border-2 border-blue-200">
//                 {formatTime(currentTimer.time)}
//               </div>
//             </div>
//       </div>
//         </div>
//       )}

//       {showTable ? (
//         <div className="bg-white/100 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/30 bg-gray-100">
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Subject</th>
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Chapter</th>
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Topic</th>
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedTableData.map((row, index) => (
//                   <tr 
//                     key={index} 
//                     className={`${index < paginatedTableData.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200 cursor-pointer`}
//                   >
//                     <td className="py-4 px-4 text-gray-800 font-medium">{row.subject}</td>
//                     <td className="py-4 px-4 text-gray-700">{row.chapter}</td>
//                     <td className="py-4 px-4 text-gray-700">{row.topic}</td>
//                     <td className="py-4 px-4">
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(row.status ?? "Pending")}`}>{row.status ?? "Pending"}</span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <Pagination
//             totalItems={totalItems}
//             rowsPerPage={rowsPerPage}
//             currentPage={currentPage}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       ) : (
//         <div className="text-center py-20">
//           <h3 className="text-2xl font-bold text-gray-800 mb-4">No allocation data found</h3>
//           <p className="text-gray-600">Please complete your allocation first to see your dashboard.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;

import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import type { AllocationData } from '../../types';

// User info interface
interface UserInfo {
  id: string;
  name: string;
}

const StudentDashboard: React.FC = () => {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Note: Your timer logic is separate. For a full integration, 
  // the timer's state should also be part of the session data from the backend.
  const [currentTimer, setCurrentTimer] = useState<{ time: number; isRunning: boolean }>({ time: 0, isRunning: false });

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (!userInfoString) {
      setIsLoading(false);
      return; // Not logged in
    }
    const user: UserInfo = JSON.parse(userInfoString);

    const fetchActiveSession = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // This is the key API call for the dashboard
        const activeSession = await apiService.getActiveSessionByStudent(user.id);
       setAllocationData(activeSession);
      } catch (error) {
        console.error("Failed to fetch active session:", error);
        setAllocationData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveSession();
  }, []); // Runs once on component mount

  const getStatusColor = (status: string = "Pending") => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading Dashboard...</div>;
  }

  return (
    <div className="p-8 font-inter">
      {/* Timer Display */}
      {currentTimer.isRunning && (
        <div className="mb-6 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          {/* Timer JSX remains the same */}
        </div>
      )}
      {allocationData ? (
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
                <tr>
                  <td className="py-4 px-4 text-gray-800 font-medium">{allocationData.subject}</td>
                  <td className="py-4 px-4 text-gray-700">{allocationData.chapter}</td>
                  <td className="py-4 px-4 text-gray-700">{allocationData.topic || "Pending"}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(allocationData.status)}`}>
                      {allocationData.status || "Pending"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Active Session Found</h3>
          <p className="text-gray-600">Please complete your allocation first to see your dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;