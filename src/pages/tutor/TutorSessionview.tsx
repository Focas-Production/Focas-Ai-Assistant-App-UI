// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// interface SessionStudent {
//   id: number;
//   name: string;
//   phoneNumber?: string;
//   subject: string;
//   chapter: string;
//   session: string;
//   room: string;
//   date: string;
//   tutorName?: string; 
// }

// interface Session {
//   id: number;
//   date: string;
//   session: string;
//   room: string;
// }

// const TutorSessionview = () => {
//   const { sessionId } = useParams<{ sessionId: string }>();
//   const navigate = useNavigate();
//   const [session, setSession] = useState<Session | null>(null);
//   const [matchingStudents, setMatchingStudents] = useState<SessionStudent[]>([]);

//   useEffect(() => {
//     // Get session details from tutorSessions localStorage
//     const tutorSessions = JSON.parse(localStorage.getItem('tutorSessions') || '[]');
//     if (sessionId) {
//       const selectedSession = tutorSessions.find((s: Session) => s.id === parseInt(sessionId));
//       setSession(selectedSession || null);
//     }
//   }, [sessionId]);

//   useEffect(() => {
//     // Get students who have chosen the same session and room AND match the current tutor
//     if (session) {
//       const sessionStudentsRaw = localStorage.getItem('sessionStudents');
//       const sessionStudents: SessionStudent[] = sessionStudentsRaw ? JSON.parse(sessionStudentsRaw) : [];
//       const userInfoRaw = localStorage.getItem('userInfo');
//       const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
//       const tutorName: string = userInfo ? userInfo.name : '';
//       // Only show students for this session/room AND for this tutor (tutorName must match)
//       const students = sessionStudents.filter((student: SessionStudent) =>
//         student.session === session.session &&
//         student.room === session.room &&
//         student.tutorName === tutorName
//       );
//       setMatchingStudents(students);
//     }
//   }, [session]);

//   // Removed unused handleBack function to fix warning

//   if (!session) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center text-gray-500">Session not found</div>
//         </div>
//       </div>
//     );
//   }

//   const uniqueStudents = [];
//   const seen = new Set();
//   for (const s of matchingStudents) {
//     const key = `${s.name}-${s.phoneNumber}`;
//     if (!seen.has(key)) {
//       uniqueStudents.push(s);
//       seen.add(key);
//     }
//   }
//   // Use uniqueStudents for rendering

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto">
        
        

//         {/* Session Info */}
//         <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Details</h2>
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label className="text-gray-600 font-medium">Date:</label>
//               <p className="text-gray-800 font-semibold">{session.date}</p>
//             </div>
//             <div>
//               <label className="text-gray-600 font-medium">Session:</label>
//               <p className="text-gray-800 font-semibold">{session.session}</p>
//             </div>
//             <div>
//               <label className="text-gray-600 font-medium">Room:</label>
//               <p className="text-gray-800 font-semibold">{session.room}</p>
//             </div>
//           </div>
//         </div>

//         {/* Students Table */}
//         <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/30 bg-gray-100">
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Name</th>
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Phone Number</th>
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Chapter</th>
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Topic</th>
//                   <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {uniqueStudents.length > 0 ? (
//                   uniqueStudents.map((student, index) => {
//                     // Get chapter from student allocation (already in student object)
//                     const chapter = student.chapter || 'N/A';
//                     // Get topic from sprintData in localStorage for this student/date/session/room
//                     let topic = 'N/A';
//                     try {
//                       const sprintData = JSON.parse(localStorage.getItem('sprintData') || '[]');
//                       const sprint = sprintData.find((s: any) =>
//                         s.name === student.name &&
//                         s.id === student.id &&
//                         s.session === session.session &&
//                         s.room === session.room &&
//                         s.date === session.date
//                       );
//                       if (sprint && sprint.topic) topic = sprint.topic;
//                     } catch {}
//                     return (
//                       <tr 
//                         key={student.id} 
//                         className={`${index < uniqueStudents.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200 cursor-pointer bg-white`}
//                       >
//                         <td className="py-4 px-4 text-gray-800 font-medium">{student.name}</td>
//                         <td className="py-4 px-4 text-gray-700">{student.phoneNumber || 'N/A'}</td>
//                         <td className="py-4 px-4 text-gray-700">{chapter}</td>
//                         <td className="py-4 px-4 text-gray-700">{topic}</td>
//                         <td className="py-4 px-4">
//                           <button 
//                             onClick={() => {
//                               // Store the selected session data for the report page
//                               localStorage.setItem('selectedSessionForReport', JSON.stringify({
//                                 date: session.date,
//                                 session: session.session,
//                                 room: session.room,
//                                 studentName: student.name,
//                                 studentPhone: student.phoneNumber
//                               }));
//                               // Since we're in TutorSessionview, we're in tutor context
//                               // Set navigation source for tutor
//                               localStorage.setItem('reportNavigationSource', 'tutor');
//                               navigate('/tutor/student-report');
//                             }}
//                             className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
//                       No students found for this session.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default TutorSessionview;


// src/pages/tutor/TutorSessionview.tsx (REVISED)

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { AllocationData as SessionData } from '../../types';

const TutorSessionview = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [students, setStudents] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch the main session details
        const sessionDetails = await apiService.getSessionById(sessionId);
        setSession(sessionDetails);

        // 2. Fetch the students assigned to this session
        // Assumes an endpoint like GET /api/sessions/:sessionId/students
        const studentList = await apiService.getStudentsInSession(sessionId);
        setStudents(studentList);
      } catch (error) {
        console.error("Failed to load session data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessionData();
  }, [sessionId]);
  
  const handleViewReport = (studentSession: SessionData) => {
      // Navigate using the student's unique session ID
      navigate(`/tutor/student-report/${studentSession._id}`);
  };

  if (isLoading) return <div className="p-8">Loading session view...</div>;
  if (!session) return <div className="p-8">Session not found.</div>;

  return (
    <div className="p-8">
      {/* Session Info Display */}
      <div className="bg-white/30 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold">Session Details</h2>
        <p>Date: {new Date(session.date).toLocaleDateString('en-GB')}</p>
        <p>Session: {session.session}</p>
        <p>Room: {session.room}</p>
      </div>

      {/* Students Table */}
      <div className="bg-white/30 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            {/* ... table headers ... */}
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map(student => (
                <tr key={student._id}>
                  <td>{student.studentName}</td>
                  <td>{student.chapter}</td>
                  <td>{student.topic || 'N/A'}</td>
                  <td>
                    <button onClick={() => handleViewReport(student)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8">No students found for this session.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorSessionview;