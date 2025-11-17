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

interface SprintTimerState {
  isRunning?: boolean;
  startTime?: string | Date;
  duration?: number;
  elapsedSeconds?: number;
}

interface ActiveSprint {
  topic?: string;
  status?: string;
  timer?: SprintTimerState;
  sessionId?: {
    subject?: string;
    chapter?: string;
    session?: string;
    room?: string;
  };
}

const StudentDashboard: React.FC = () => {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [activeSprint, setActiveSprint] = useState<ActiveSprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timerDisplay, setTimerDisplay] = useState('00:00');
  const [timerEnded, setTimerEnded] = useState(false);
  
  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (!userInfoString) {
      setIsLoading(false);
      return; // Not logged in
    }
    const user: UserInfo = JSON.parse(userInfoString);

    const fetchActiveData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const activeSession = await apiService.getActiveSessionByStudent(user.id);
        const sprintResponse = await apiService.getActiveSprintForStudent(user.id);
        setAllocationData(activeSession);
        setActiveSprint((sprintResponse || null) as ActiveSprint | null);
      } catch (error) {
        console.error("Failed to fetch active session:", error);
        setAllocationData(null);
        setActiveSprint(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveData();
    // Poll every 5 seconds to reflect tutor updates in near real-time
    const interval = setInterval(fetchActiveData, 5000);
    return () => clearInterval(interval);
  }, []); // Runs once on component mount

  const getStatusColor = (status: string = "Pending") => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    const updateTimer = () => {
      const timer = activeSprint?.timer;
      if (!timer) {
        setTimerDisplay('00:00');
        setTimerEnded(false);
        return;
      }

      let totalSeconds = timer.elapsedSeconds || 0;
      if (timer.isRunning && timer.startTime) {
        const startMs = new Date(timer.startTime).getTime();
        totalSeconds += Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      }

      let reachedMax = false;
      if (timer.duration) {
        const maxSeconds = timer.duration * 60;
        if (totalSeconds >= maxSeconds) {
          totalSeconds = maxSeconds;
          reachedMax = true;
        }
      }

      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      setTimerDisplay(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      setTimerEnded(reachedMax);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSprint]);

  const subjectToShow = allocationData?.subject || activeSprint?.sessionId?.subject || 'N/A';
  const chapterToShow = allocationData?.chapter || activeSprint?.sessionId?.chapter || 'N/A';
  const sprintTopic = activeSprint?.topic;
  const sessionTopic = allocationData?.topic;
  const topicToShow =
    sprintTopic && sprintTopic !== 'N/A'
      ? sprintTopic
      : sessionTopic && sessionTopic !== 'N/A'
        ? sessionTopic
        : 'Pending';
  const sprintStatus = activeSprint?.status;
  const sessionStatus = allocationData?.status;
  const statusToShow = sprintStatus || sessionStatus || 'Pending';
  const hasSessionData = allocationData || activeSprint;
  const showTimer = !!activeSprint?.timer && (activeSprint.timer.isRunning || (activeSprint.timer.elapsedSeconds ?? 0) > 0);
  const timerFormatted = activeSprint?.timer?.duration
    ? `${timerDisplay} / ${activeSprint.timer.duration} min${activeSprint.timer.duration > 1 ? 's' : ''}`
    : timerDisplay;

  if (isLoading) {
    return <div className="p-8 text-center">Loading Dashboard...</div>;
  }

  return (
    <div className="p-8 font-inter">
      {showTimer && (
        <div className="mb-5 ">
          <div className="text-start">
            {/* <h3 className="text-lg font-semibold text-blue-700 mb-2">Session Timer</h3> */}
            <div className="text-2xl font-mono font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200 inline-block">
              {timerFormatted}
            </div>
            {/* {activeSprint?.timer?.duration && (
              <p className="mt-2 text-sm text-gray-500">
                Total duration: {activeSprint.timer.duration} min{activeSprint.timer.duration > 1 ? 's' : ''}
              </p>
            )} */}
            {timerEnded && (
              <p className="mt-2 text-base font-semibold text-green-600">
                Time is up — you can now start the test.
              </p>
            )}
          </div>
        </div>
      )}
      {hasSessionData ? (
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
                  <td className="py-4 px-4 text-gray-800 font-medium">{subjectToShow}</td>
                  <td className="py-4 px-4 text-gray-700">{chapterToShow}</td>
                  <td className="py-4 px-4 text-gray-700">{topicToShow}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(statusToShow)}`}>
                      {statusToShow}
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