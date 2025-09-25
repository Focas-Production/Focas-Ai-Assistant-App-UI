// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Pagination from '../../components/common/Pagination';
// import { sessionManager } from '../../utils/sessionManager';

// interface SessionStudent {
//   id: number;
//   name: string;
//   subject: string;
//   chapter: string;
//   session: string;
//   room: string;
//   date: string;
//   sessionId?: string; // Add session ID for direct navigation
// }

// const StudentSessions = () => {
//   const navigate = useNavigate();
//   const [sessions, setSessions] = useState<SessionStudent[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;

//   useEffect(() => {
//     // Get user info to find student sessions
//     const userInfo = localStorage.getItem('userInfo');
//     if (!userInfo) return;

//     const user = JSON.parse(userInfo);
    
//     // Get all sessions from session manager
//     const allSessions = sessionManager.getAllSessions();
    
//     // Filter sessions for current student
//     const studentSessions = allSessions.filter(session => 
//       session.studentName === user.name
//     );

//     if (studentSessions.length > 0) {
//       // Convert to SessionStudent format
//       const formattedSessions: SessionStudent[] = studentSessions.map(session => ({
//         id: parseInt(session.sessionId.split('_')[1]), // Use timestamp part as ID
//         name: session.studentName,
//         subject: session.subject,
//         chapter: session.chapter,
//         session: session.session,
//         room: session.room,
//         date: session.date,
//         sessionId: session.sessionId
//       }));

//       // Remove duplicates by composite key: date+session+room+name
//       const uniqueSessionsMap = new Map<string, SessionStudent>();
//       formattedSessions.forEach(sess => {
//         const key = `${sess.date}_${sess.session}_${sess.room}_${sess.name}`;
//         if (!uniqueSessionsMap.has(key)) {
//           uniqueSessionsMap.set(key, sess);
//         }
//       });
//       const uniqueSessions = Array.from(uniqueSessionsMap.values());

//       // Sort by date (newest first)
//       uniqueSessions.sort((a, b) => {
//         const dateA = new Date(a.date.split('/').reverse().join('-'));
//         const dateB = new Date(b.date.split('/').reverse().join('-'));
//         return dateB.getTime() - dateA.getTime();
//       });

//       console.log('Student sessions loaded:', uniqueSessions);
//       setSessions(uniqueSessions);
//     } else {
//       // Fallback to legacy session students data
//       const sessionStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
//       console.log('Raw session students from localStorage:', sessionStudents);
      
//       if (sessionStudents.length > 0) {
//         // Remove duplicates by composite key: date+session+room+name
//         const uniqueSessions = new Map();
        
//         sessionStudents.forEach((student: SessionStudent) => {
//           const key = `${student.date}-${student.session}-${student.room}-${student.name}`;
//           console.log('Processing student:', student.name, 'with key:', key, 'date:', student.date);
//           if (!uniqueSessions.has(key)) {
//             uniqueSessions.set(key, {
//               id: student.id,
//               name: student.name,
//               subject: student.subject,
//               chapter: student.chapter,
//               session: student.session,
//               room: student.room,
//               date: student.date || new Date().toLocaleDateString('en-GB')
//             });
//           } else {
//             console.log('Duplicate found for key:', key, 'skipping...');
//           }
//         });

//         // Convert to array and sort by date (newest first)
//         const formattedSessions = Array.from(uniqueSessions.values())
//           .sort((a: SessionStudent, b: SessionStudent) => {
//             const dateA = new Date(a.date.split('/').reverse().join('-'));
//             const dateB = new Date(b.date.split('/').reverse().join('-'));
//             return dateB.getTime() - dateA.getTime();
//           });

//         console.log('Final formatted sessions:', formattedSessions);
//         setSessions(formattedSessions);
//       } else {
//         // Fallback to current user's allocation data if no session students exist
//         const allocationData = localStorage.getItem('studentAllocationData');
//         if (allocationData) {
//           const data = JSON.parse(allocationData);
//           const sessionData = {
//             id: Date.now(),
//             name: 'Current Student',
//             subject: data.subject,
//             chapter: data.chapter,
//             session: data.session,
//             room: data.room,
//             date: data.date || new Date().toLocaleDateString('en-GB')
//           };
//           setSessions([sessionData]);
//         }
//       }
//     }
//   }, []);

//   const handleViewReport = (session: SessionStudent) => {
//     if (session.sessionId) {
//       // Use session ID for direct navigation
//       localStorage.setItem('selectedSessionId', session.sessionId);
//       navigate('/student/report');
//     } else {
//       // Fallback to legacy method
//       const key = `${session.date}_${session.session}`;
//       localStorage.setItem('selectedSessionForReport', key);
//       navigate('/student/report');
//     }
//   };
  
//   // Pagination logic
//   const totalItems = sessions.length;
//   const paginatedSessions = sessions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   return (
//     <div className=" p-8">
//       <div className="max-w-7xl mx-auto  flex-col">
        
//         {/* Table Container */}
//         <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden flex-1">
//           <div className="overflow-x-auto h-full">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/30 bg-gray-100">
//                   <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Date</th>
//                   <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Session</th>
//                   <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Room</th>
//                   <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedSessions.length > 0 ? (
//                   paginatedSessions.map((session, index) => (
//                     <tr 
//                       key={session.id} 
//                       className={`${index < paginatedSessions.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200 cursor-pointer`}
//                     >
//                       <td className="py-3 px-4 text-gray-800 font-medium">{session.date}</td>
//                       <td className="py-3 px-4 text-gray-700">{session.session}</td>
//                       <td className="py-3 px-4 text-gray-700">{session.room}</td>
//                       <td className="py-3 px-4">
//                         <button
//                           onClick={() => handleViewReport(session)}
//                           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
//                       No session data found. Please complete your allocation first.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
        
//         {/* Pagination */}
//         <div className="mt-4">
//           <Pagination
//             totalItems={totalItems}
//             rowsPerPage={rowsPerPage}
//             currentPage={currentPage}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentSessions;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import Pagination from '../../components/common/Pagination';
import type { AllocationData } from '../../types';

// User info interface
interface UserInfo {
  id: string;
  name: string;
}

const StudentSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AllocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (!userInfoString) {
      setIsLoading(false);
      return; // Not logged in
    }
    const user: UserInfo = JSON.parse(userInfoString);

    const fetchSessionHistory = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // Single API call replaces old localStorage/sessionManager logic
        const sessionHistory = await apiService.getSessionsByStudent(user.id);
        setSessions(sessionHistory || []);
      } catch (error) {
        console.error('Failed to fetch session history:', error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionHistory();
  }, []);

  const handleViewReport = (session: AllocationData) => {
    console.log('Navigating to report for session:', session._id);
    navigate(`/student/report/${session._id}`);
  };

  // Pagination
  const totalItems = sessions.length;
  const paginatedSessions = sessions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (isLoading) {
    return <div className="p-8 text-center">Loading Session History...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto flex-col">
        {/* Table Container */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden flex-1">
          <div className="overflow-x-auto h-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Date</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Session</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Room</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSessions.length > 0 ? (
                  paginatedSessions.map((session, index) => (
                    <tr
                      key={session._id}
                      className={`${
                        index < paginatedSessions.length - 1 ? 'border-b border-black/10' : ''
                      } hover:bg-white/20 transition-colors duration-200 cursor-pointer`}
                    >
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {new Date(session.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{session.session}</td>
                      <td className="py-3 px-4 text-gray-700">{session.room}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewReport(session)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                      No session data found. Please complete your allocation first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentSessions;
