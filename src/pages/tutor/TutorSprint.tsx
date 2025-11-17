
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { sessionManager } from '../../utils/sessionManager';

// interface SprintData {
//   id: number;
//   name: string;
//   topic: string;
//   timer: {
//     isRunning: boolean;
//     time: number;
//     startTime: number | null;
//     duration: number; // in minutes
//   };
//   feedback: string;
//   status: string;
// }

// interface SessionStudent {
//   id: number;
//   name: string;
//   subject: string;
//   chapter: string;
//   session: string;
//   room: string;
//   date: string;
// }


// const TutorSprint = () => {
//   const [sprints, setSprints] = useState<SprintData[]>([]);
//   const navigate = useNavigate();
//   // Handle feedback click to navigate to report page
//   const handleFeedbackClick = (sprint: SprintData) => {
//     // Store session info in localStorage for report page
//     // Try to find the session details from sessionManager
//     const allSessions = sessionManager.getAllSessions();
//     const matchingSession = allSessions.find(
//       (session) => session.studentName === sprint.name
//     );
//     if (matchingSession) {
//       localStorage.setItem(
//         'selectedSessionForReport',
//         JSON.stringify({
//           date: matchingSession.date,
//           session: matchingSession.session,
//           room: matchingSession.room,
//           studentName: matchingSession.studentName
//         })
//       );
//     }
//     localStorage.setItem('reportNavigationSource', 'tutor');
//     navigate('/tutor/student-report');
//   };

//   const TOPIC_OPTIONS = ["Company Accounts", "Profit and Loss", "Accouting standards"];
//   const STATUS_OPTIONS = ["pending", "completed", "come to live"];

//   // Check if current time falls within a session time slot
//   const isCurrentTimeAndDateInSession = (sessionTime: string, sessionDate: string): boolean => {
//     const now = new Date();
//     const currentDate = now.toLocaleDateString('en-GB');
    
//     // Check if date matches
//     if (currentDate !== sessionDate) {
//       return false;
//     }
    
//     const currentHour = now.getHours();
//     const currentMinute = now.getMinutes();
//     const currentTime = currentHour * 60 + currentMinute; // Convert to minutes
    
//     // Parse session time
//     const timeMatch = sessionTime.match(/(\d+)(?::\d+)?\s*(am|pm)\s*-\s*(\d+)(?::\d+)?\s*(am|pm)/i);
//     if (!timeMatch) return false;
    
//     const startHour = parseInt(timeMatch[1]);
//     const startPeriod = timeMatch[2].toLowerCase();
//     const endHour = parseInt(timeMatch[3]);
//     const endPeriod = timeMatch[4].toLowerCase();
    
//     // Convert to 24-hour format
//     const startTime24 = startPeriod === 'pm' && startHour !== 12 ? startHour + 12 : startHour;
//     const endTime24 = endPeriod === 'pm' && endHour !== 12 ? endHour + 12 : endHour;
    
//     const sessionStartMinutes = startTime24 * 60;
//     const sessionEndMinutes = endTime24 * 60;
    
//     return currentTime >= sessionStartMinutes && currentTime <= sessionEndMinutes;
//   };

//   // Load students from localStorage and filter by current session time
//   useEffect(() => {
//     // First try to get students from session manager
//     const allSessions = sessionManager.getAllSessions();
    
//     if (allSessions.length > 0) {
//       // Filter sessions based on current time and date
//       const currentSessions = allSessions.filter(session => 
//         isCurrentTimeAndDateInSession(session.session, session.date)
//       );
      
//       // Convert to SessionStudent format
//       const currentStudents: SessionStudent[] = currentSessions.map(session => ({
//         id: parseInt(session.sessionId.split('_')[1]), // Use timestamp part as ID
//         name: session.studentName,
//         subject: session.subject,
//         chapter: session.chapter,
//         session: session.session,
//         room: session.room,
//         date: session.date
//       }));
      
      
//       // Initialize sprints for current students
//       const initialSprints = currentStudents.map(student => ({
//         id: student.id,
//         name: student.name,
//         topic: "Topic 1",
//         timer: { isRunning: false, time: 0, startTime: null, duration: 5 },
//         feedback: "Session in progress",
//         status: "pending"
//       }));
      
//       setSprints(initialSprints);
//     } else {
//       // Fallback to legacy session students data
//       const students = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
      
//       // Filter students based on current time and date matching their session
//       const filteredStudents = students.filter((student: SessionStudent) => {
//         return isCurrentTimeAndDateInSession(student.session, student.date);
//       });
      
      
//       // Initialize sprints only for students in current session time
//       const initialSprints = filteredStudents.map((student: SessionStudent) => ({
//         id: student.id,
//         name: student.name,
//         topic: "Topic 1",
//         timer: { isRunning: false, time: 0, startTime: null, duration: 5 },
//         feedback: "Session in progress",
//         status: "pending"
//       }));
      
//       setSprints(initialSprints);
//     }
//   }, []);

//   // Timer functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSprints(prevSprints => 
//         prevSprints.map(sprint => {
//           if (sprint.timer.isRunning && sprint.timer.startTime) {
//             const elapsed = Math.floor((Date.now() - sprint.timer.startTime) / 1000);
//             const maxTime = sprint.timer.duration * 60; // Convert minutes to seconds
            
//             // Stop timer if it reaches the set duration
//             if (elapsed >= maxTime) {
//               return {
//                 ...sprint,
//                 timer: {
//                   ...sprint.timer,
//                   isRunning: false,
//                   startTime: null,
//                   time: maxTime
//                 }
//               };
//             }
            
//             return {
//               ...sprint,
//               timer: {
//                 ...sprint.timer,
//                 time: elapsed
//               }
//             };
//           }
//           return sprint;
//         })
//       );
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // Save sprint data to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('sprintData', JSON.stringify(sprints));
//   }, [sprints]);

//   // Load AI scores from session manager and update feedback
//   useEffect(() => {
//     const updateScores = () => {
//       // Get all evaluations from session manager
//       const allEvaluations = sessionManager.getAllEvaluations();
//       console.log('Loading evaluations from session manager:', allEvaluations);
      
//       setSprints(prevSprints => 
//         prevSprints.map(sprint => {
//           // Find evaluations for this student
//           const studentEvaluations = allEvaluations.filter(evaluation => 
//             evaluation.studentName === sprint.name
//           );
//           console.log(`Evaluations for student ${sprint.name}:`, studentEvaluations);
          
//           if (studentEvaluations.length > 0) {
//             // Get the most recent evaluation
//             const latestEvaluation = studentEvaluations.sort((a, b) => 
//               new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//             )[0];
            
//             console.log(`Latest evaluation for ${sprint.name}:`, latestEvaluation);
            
//             return {
//               ...sprint,
//               feedback: `Score: ${latestEvaluation.score}/10`
//             };
//           }
          
//           return sprint;
//         })
//       );
//     };

//     // Initial load
//     updateScores();

//     // Set up interval to check for updates every 2 seconds
//     const interval = setInterval(updateScores, 2000);

//     // Cleanup interval on unmount
//     return () => clearInterval(interval);
//   }, []);

//   const handleTimerToggle = (id: number) => {
//     setSprints(prevSprints =>
//       prevSprints.map(sprint => {
//         if (sprint.id === id) {
//           if (sprint.timer.isRunning) {
//             // Stop timer
//             return {
//               ...sprint,
//               timer: {
//                 ...sprint.timer,
//                 isRunning: false,
//                 startTime: null
//               }
//             };
//           } else {
//             // Start timer
//             return {
//               ...sprint,
//               timer: {
//                 ...sprint.timer,
//                 isRunning: true,
//                 startTime: Date.now(),
//                 time: 0 // Reset time when starting
//               }
//             };
//           }
//         }
//         return sprint;
//       })
//     );
//   };

//   const handleTimerDurationChange = (id: number, duration: number) => {
//     setSprints(prevSprints =>
//       prevSprints.map(sprint => {
//         if (sprint.id === id) {
//           return {
//             ...sprint,
//             timer: {
//               ...sprint.timer,
//               duration: duration,
//               time: 0, // Reset time when changing duration
//               isRunning: false,
//               startTime: null
//             }
//           };
//         }
//         return sprint;
//       })
//     );
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleTopicChange = (id: number, newTopic: string) => {
//     setSprints(prevSprints =>
//       prevSprints.map(sprint =>
//         sprint.id === id ? { ...sprint, topic: newTopic } : sprint
//       )
//     );
//   };

//   const handleStatusChange = (id: number, newStatus: string) => {
//     setSprints(prevSprints =>
//       prevSprints.map(sprint =>
//         sprint.id === id ? { ...sprint, status: newStatus } : sprint
//       )
//   );
//   };

//   // Get current session time and date for display
//   const getCurrentSessionInfo = () => {
//     const now = new Date();
//     const currentHour = now.getHours();
//     const currentMinute = now.getMinutes();
//     const currentTimeInMinutes = currentHour * 60 + currentMinute;
//     const currentDate = now.toLocaleDateString('en-GB');

//     const sessionRanges: { [key: string]: { start: number; end: number } } = {
//       '6am - 9am': { start: 6 * 60, end: 9 * 60 },
//       '10am - 1pm': { start: 10 * 60, end: 13 * 60 },
//       '2pm - 5pm': { start: 14 * 60, end: 17 * 60 },
//       '7pm - 10pm': { start: 19 * 60, end: 22 * 60 },
//     };

//     for (const [session, range] of Object.entries(sessionRanges)) {
//       if (currentTimeInMinutes >= range.start && currentTimeInMinutes <= range.end) {
//         return { session, date: currentDate };
//       }
//     }
//     return { session: 'No active session', date: currentDate };
//   };

//   return (
//     <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-sm">
//           <h1 className="text-3xl font-bold text-blue-700 mb-2">Tutor Sprint Management</h1>
//           <p className="text-slate-600">Current Session: <span className="font-semibold text-blue-600">{getCurrentSessionInfo().session}</span> | Date: <span className="font-semibold text-blue-600">{getCurrentSessionInfo().date}</span></p>
//         </div>

//         {/* Table */}
//         <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="w-1/5 text-center px-6 py-6 text-lg font-semibold text-blue-900">Name</th>
//                   <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Topic</th>
//                   <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Timer</th>
//                   <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Feedback</th>
//                   <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sprints.map((sprint, index) => (
//                   <tr 
//                     key={sprint.id}
//                     className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index === sprints.length - 1 ? '' : 'border-b border-gray-200'}`}
//                   >
//                     <td className="w-1/5 text-center px-6 py-4 text-lg text-gray-900 font-medium">
//                       {sprint.name}
//                     </td>
//                     <td className="w-1/5 text-center px-6 py-4">
//   <div className="inline-flex items-center justify-center gap-1">
//     <span className="text-gray-900 font-medium"></span>
//     <select
//       value={sprint.topic}
//       onChange={(e) => handleTopicChange(sprint.id, e.target.value)}
//       className="px-5 py-1  rounded focus:outline-none text-lg"
//       style={{ minWidth: 0 }}
//     >
//       {TOPIC_OPTIONS.map(option => (
//         <option key={option} value={option}>{option}</option>
//       ))}
//     </select>
//   </div>
// </td>
//                     <td className="w-1/5 text-center px-6 py-4">
//                       <div className="flex items-center justify-center gap-3">
//                         <input
//                           type="number"
//                           min="1"
//                           value={sprint.timer.duration}
//                           onChange={(e) => handleTimerDurationChange(sprint.id, parseInt(e.target.value) || 1)}
//                           className="w-20 px-3 py-2 text-center focus:outline-none  text-lg"
//                           disabled={sprint.timer.isRunning}
//                           placeholder="mins"
//                         />
//                         <span className="text-lg text-gray-500">mins</span>
//                         <span className="text-lg font-mono text-gray-700 min-w-[60px]">
//                           {formatTime(sprint.timer.time)}
//                         </span>
//                         <button
//                           onClick={() => handleTimerToggle(sprint.id)}
//                           className={`p-2 transition-colors ${sprint.timer.isRunning ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
//                           title={sprint.timer.isRunning ? 'Stop' : 'Start'}
//                         >
//                           {sprint.timer.isRunning ? (
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
//                               <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
//                             </svg>
//                           ) : (
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <polygon points="5,3 19,12 5,21" fill="currentColor"/>
//                             </svg>
//                           )}
//                         </button>
//                       </div>
//                     </td>
//                     <td className="w-1/5 text-center px-6 py-4 text-lg text-gray-700">
//                       <span
//                         className="cursor-pointer text-blue-600 hover:underline"
//                         title="View Report"
//                         onClick={() => handleFeedbackClick(sprint)}
//                       >
//                         {sprint.feedback}
//                       </span>
//                     </td>
//                     <td className="w-1/5 text-center px-6 py-4">
//                     <div className="inline-flex items-center justify-center gap-1">
//   <select
//     value={sprint.status}
//     onChange={(e) => handleStatusChange(sprint.id, e.target.value)}
//     className="px-1 py-1  rounded focus:outline-none text-lg"
//     style={{ minWidth: 0 }}
//   >
//     {STATUS_OPTIONS.map(option => (
//       <option key={option} value={option}>{option}</option>
//     ))}
//   </select>
// </div>
// </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             </div>
//         </div>

//         {sprints.length === 0 && (
//           <div className="text-center py-20">
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">No students in current session</h3>
//             <p className="text-gray-600">Students will appear here only during their allocated session time and date.</p>
//             <p className="text-gray-500 mt-2">Current time: {new Date().toLocaleTimeString()} | Date: {new Date().toLocaleDateString('en-GB')}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TutorSprint;

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiService } from '../../services/api';
// import type { AllocationData as SprintData } from '../../types';

// // Define a more specific type for the timer object if it's part of your data model
// interface TimerState {
//   isRunning: boolean;
//   time: number;
//   startTime: number | null;
//   duration: number; // in minutes
// }

// // These can be moved to a config file
// const TOPIC_OPTIONS = ["Company Accounts", "Profit and Loss", "Accounting standards"];
// const STATUS_OPTIONS = ["pending", "completed", "come to live"];

// const TutorSprint = () => {
//   const [sprints, setSprints] = useState<SprintData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // --- Data Fetching ---
//   useEffect(() => {
//     const fetchActiveStudents = async () => {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//       if (!userInfo._id) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         // This single API call gets students in the tutor's currently active session
//         const activeSprints = await apiService.getActiveStudentsForTutor(userInfo._id);
//         setSprints(activeSprints);
//       } catch (error) {
//         console.error("Failed to fetch active students:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchActiveStudents();
//     // Poll for updates every 15 seconds
//     const interval = setInterval(fetchActiveStudents, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   // --- Client-Side Timer for UI Feedback ---
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSprints(prevSprints =>
//         prevSprints.map(sprint => {
//           if (sprint.timer?.isRunning && sprint.timer?.startTime) {
//             const elapsed = Math.floor((Date.now() - sprint.timer.startTime) / 1000);
//             const maxTime = (sprint.timer.duration || 0) * 60;
            
//             if (elapsed >= maxTime) {
//               // Timer finished, update state visually
//               return { ...sprint, timer: { ...sprint.timer, isRunning: false, time: maxTime } };
//             }
//             return { ...sprint, timer: { ...sprint.timer, time: elapsed } };
//           }
//           return sprint;
//         })
//       );
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // --- Event Handlers ---
//   const handleUpdateSprint = async (sprintId: string, updatedData: Partial<SprintData>) => {
//     try {
//       // Optimistic UI update for a snappy experience
//       setSprints(prev => prev.map(s => s._id === sprintId ? { ...s, ...updatedData } : s));
//       // Send the update to the backend
//       await apiService.updateSession(sprintId, updatedData);
//     } catch (error) {
//       console.error("Failed to update sprint:", error);
//       // Optional: Add logic to revert the UI change on API error
//     }
//   };

//   const handleTopicChange = (sprintId: string, newTopic: string) => {
//     handleUpdateSprint(sprintId, { topic: newTopic });
//   };

//   const handleStatusChange = (sprintId: string, newStatus: string) => {
//     handleUpdateSprint(sprintId, { status: newStatus });
//   };

//   const handleTimerToggle = (sprint: SprintData) => {
//     const timer = sprint.timer || { isRunning: false, time: 0, duration: 5, startTime: null };
//     const isRunning = !timer.isRunning;
//     const newTimerState: TimerState = {
//       ...timer,
//       isRunning,
//       startTime: isRunning ? Date.now() - (timer.time * 1000) : null,
//     };
//     handleUpdateSprint(sprint._id, { timer: newTimerState });
//   };
  
//   const handleTimerDurationChange = (sprint: SprintData, duration: number) => {
//       const newTimerState: TimerState = {
//           ...(sprint.timer || { time: 0, isRunning: false, startTime: null }),
//           duration: duration,
//           time: 0, // Reset time on duration change
//           isRunning: false,
//           startTime: null,
//       };
//       handleUpdateSprint(sprint._id, { timer: newTimerState });
//   };

//   const handleFeedbackClick = (sprint: SprintData) => {
//     navigate(`/tutor/student-report/${sprint._id}`);
//   };

//   // --- Helper Functions ---
//   const formatTime = (seconds: number = 0) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   if (isLoading) {
//     return <div className="p-8 text-center">Loading Active Students...</div>;
//   }

//   return (
//     <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-sm">
//           <h1 className="text-3xl font-bold text-blue-700">Tutor Sprint Management</h1>
//           <p className="text-slate-600">Managing students in the current active session.</p>
//         </div>

//         {/* Table */}
//         <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="w-1/5 text-center px-6 py-6 text-lg font-semibold text-blue-900">Name</th>
//                   <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Topic</th>
//                   <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Timer</th>
//                   <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Feedback</th>
//                   <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sprints.map((sprint) => (
//                   <tr key={sprint._id} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="text-center px-6 py-4 text-lg font-medium">{sprint.studentName}</td>
//                     <td className="text-center px-6 py-4">
//                       <select
//                         value={sprint.topic || ''}
//                         onChange={(e) => handleTopicChange(sprint._id, e.target.value)}
//                         className="p-2 border rounded focus:outline-none"
//                       >
//                         {TOPIC_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
//                       </select>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-center gap-2">
//                         <input
//                           type="number"
//                           min="1"
//                           value={sprint.timer?.duration || 5}
//                           onChange={(e) => handleTimerDurationChange(sprint, parseInt(e.target.value) || 1)}
//                           className="w-20 p-2 text-center border rounded"
//                           disabled={sprint.timer?.isRunning}
//                         />
//                         <span className="font-mono text-lg min-w-[60px]">{formatTime(sprint.timer?.time)}</span>
//                         <button onClick={() => handleTimerToggle(sprint)} title={sprint.timer?.isRunning ? 'Stop' : 'Start'}>
//                           {sprint.timer?.isRunning ? '❚❚' : '▶'}
//                         </button>
//                       </div>
//                     </td>
//                     <td className="text-center px-6 py-4">
//                       <span
//                         className="cursor-pointer text-blue-600 hover:underline"
//                         onClick={() => handleFeedbackClick(sprint)}
//                       >
//                         View Report
//                       </span>
//                     </td>
//                     <td className="text-center px-6 py-4">
//                       <select
//                         value={sprint.status || 'pending'}
//                         onChange={(e) => handleStatusChange(sprint._id, e.target.value)}
//                         className="p-2 border rounded focus:outline-none"
//                       >
//                         {STATUS_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
//                       </select>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {sprints.length === 0 && !isLoading && (
//           <div className="text-center py-20">
//             <h3 className="text-2xl font-bold text-gray-800">No students in your active session</h3>
//             <p className="text-gray-600">Students will appear here automatically when their session starts.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TutorSprint;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

// --- START OF FIX ---

// 1. Define the correct TimerState interface
interface TimerState {
  isRunning: boolean;
  startTime?: Date | string;
  duration: number; // in minutes
  elapsedSeconds: number;
}

// 2. Define the new, correct SprintData interface
interface SprintData {
  _id: string;
  sessionId: string; // The property that was missing from the old type
  studentId: string;
  tutorId: string;
  topic?: string;
  status?: string;
  timer?: TimerState;
  studentName?: string; // Added by the controller
  subject?: string;
  chapter?: string;
}

// --- END OF FIX ---

// Map subjects to their topic options
const SUBJECT_TOPICS: Record<string, string[]> = {
  // Foundation
  "Principles and Practice of Accounting": [
    "Theoretical Framework of Accounting",
    "Accounting Process",
    "Financial Statements",
    "Bank Reconciliation & Depreciation",
  ],
  "Business Laws and BCR": [
    "Business Laws Basics",
    "Sale of Goods & Contracts",
    "Correspondence & Reporting",
  ],
  "Business Mathematics, LR & Statistics": [
    "Business Mathematics",
    "Logical Reasoning",
    "Statistics",
  ],
  "Business Economics & BCK": [
    "Micro & Macro Economics",
    "Business & Commercial Knowledge",
  ],
  // Intermediate
  "Advanced Accounting": [
    "Ind AS Framework",
    "Presentation & Disclosures",
    "Consolidation",
    "Amalgamation & Reconstruction",
  ],
  "Corporate and Other Laws": [
    "Companies Act",
    "LLP Act",
    "Other Laws",
  ],
  "Taxation": [
    "Income Tax",
    "GST",
  ],
  "Cost & Management Accounting": [
    "Cost Sheet",
    "Process & Service Costing",
    "Standard & Budgetary Control",
    "Marginal & ABC",
  ],
  "Auditing & Ethics": [
    "Standards on Auditing",
    "Audit Process",
    "Internal Control",
    "Professional Ethics",
  ],
  "Financial Management & Strategic Management": [
    "FM Basics",
    "Working Capital",
    "Investment Decisions",
    "Strategic Analysis",
  ],
  // Final
  "Financial Reporting": [
    "Ind AS & Framework",
    "Consolidation",
    "Schedule III Disclosures",
  ],
  "Advanced Financial Management": [
    "Risk Management",
    "Valuation & M&A",
    "International Finance",
  ],
  "Advanced Auditing & Professional Ethics": [
    "Assurance & Quality Control",
    "Professional Ethics",
    "Group Audits",
  ],
  "Direct Tax Laws & International Taxation": [
    "Domestic Tax Planning",
    "Transfer Pricing & DTAA",
  ],
  "Indirect Tax Laws": [
    "GST In-Depth",
    "Customs & FTP",
  ],
  "Integrated Business Solutions": [
    "Case Studies",
    "Strategic Costing",
    "Corporate & Economic Laws",
  ],
};

const DEFAULT_TOPICS = ["Topic 1", "Topic 2", "Topic 3"];
const STATUS_OPTIONS = ["pending", "active", "paused", "completed"];

const TutorSprint = () => {
  const [sprints, setSprints] = useState<SprintData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const navigate = useNavigate();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchActiveSprints = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (!userInfo.id) {
        setIsLoading(false);
        return;
      }
      try {
        const activeSprints = await apiService.getActiveSprintsForTutor(userInfo.id);
        setSprints(activeSprints);
      } catch (error) {
        console.error("Failed to fetch active sprints:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveSprints();
    const interval = setInterval(fetchActiveSprints, 15000);
    return () => clearInterval(interval);
  }, []);

  // Tick every second so timer displays update in real time
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handleUpdateSprint = async (sprintId: string, updatedData: any) => {
    try {
      setSprints(prev => prev.map(s => s._id === sprintId ? { ...s, ...updatedData, timer: {...s.timer, ...updatedData.timer} } : s));
      await apiService.updateSprint(sprintId, updatedData);
    } catch (error) {
      console.error("Failed to update sprint:", error);
    }
  };

  const handleTopicChange = (sprintId: string, newTopic: string) => {
    handleUpdateSprint(sprintId, { topic: newTopic });
  };

  const handleStatusChange = (sprintId: string, newStatus: string) => {
    handleUpdateSprint(sprintId, { status: newStatus });
  };

  const handleTimerToggle = (sprint: SprintData) => {
    // Safely provide a default timer object if sprint.timer is undefined
    const timer = sprint.timer || { isRunning: false, duration: 5, elapsedSeconds: 0 };
    const wasRunning = !!timer.isRunning;
    let elapsedSeconds = timer.elapsedSeconds || 0;

    if (wasRunning && timer.startTime) {
      const startMs = new Date(timer.startTime).getTime();
      elapsedSeconds += Math.max(0, Math.floor((Date.now() - startMs) / 1000));
    }

    const isRunning = !wasRunning;
    const updatedTimer = {
      ...timer,
      elapsedSeconds,
      isRunning,
      startTime: isRunning ? new Date() : undefined
    };

    handleUpdateSprint(sprint._id, { timer: updatedTimer });
  };

  const handleTimerDurationChange = (sprintId: string, duration: number) => {
    handleUpdateSprint(sprintId, { timer: { duration, elapsedSeconds: 0, isRunning: false, startTime: undefined } });
  };

  const handleFeedbackClick = (sprint: SprintData) => {
    // This line will now work correctly without any errors
    navigate(`/tutor/student-report/${sprint.sessionId}`);
  };

  // --- Helpers ---
  const getTopicOptionsForSprint = (sprint: SprintData): string[] => {
    if (sprint.subject && SUBJECT_TOPICS[sprint.subject]) {
      return SUBJECT_TOPICS[sprint.subject];
    }
    return DEFAULT_TOPICS;
  };
  const formatTime = (sprint: SprintData) => {
    const timer = sprint.timer;
    if (!timer) return '00:00';

    let totalSeconds = timer.elapsedSeconds || 0;

    if (timer.isRunning && timer.startTime) {
      const timeSinceStart = Math.floor((now - new Date(timer.startTime).getTime()) / 1000);
      totalSeconds += Math.max(0, timeSinceStart);
    }

    if (timer.duration) {
      const maxTime = timer.duration * 60;
      totalSeconds = Math.min(totalSeconds, maxTime);
    }
    
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading Active Students...</div>;
  }

  // --- RENDER ---
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-sm">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Tutor Sprint Management</h1>
          <p className="text-slate-600">Managing students in the current active session.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                <tr className="bg-gray-100">
                  <th className="w-1/5 text-center px-6 py-6 text-lg font-semibold text-blue-900">Name</th>
                  <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Topic</th>
                  <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Timer</th>
                  <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Feedback</th>
                  <th className="w-1/5 text-center px-6 py-4 text-lg font-semibold text-blue-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {sprints.map((sprint, index) => (
                  <tr key={sprint._id} className={`hover:bg-gray-50 transition-colors ${index === sprints.length - 1 ? '' : 'border-b border-gray-200'}`}>
                    <td className="text-center px-6 py-4 text-lg font-medium text-gray-900">
                      {sprint.studentName}
                    </td>
                    <td className="text-center px-6 py-4">
                      <select value={sprint.topic || ''} onChange={(e) => handleTopicChange(sprint._id, e.target.value)} className="px-5 py-1 rounded focus:outline-none text-lg">
                        {getTopicOptionsForSprint(sprint).map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </td>
                    <td className="text-center px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <input type="number" min="1" value={sprint.timer?.duration || 5} onChange={(e) => handleTimerDurationChange(sprint._id, parseInt(e.target.value) || 1)} className="w-20 px-3 py-2 text-center focus:outline-none text-lg" disabled={sprint.timer?.isRunning} placeholder="mins"/>
                        <span className="text-lg font-mono text-gray-700 min-w-[60px]">{formatTime(sprint)}</span>
                        <button onClick={() => handleTimerToggle(sprint)} className={`p-2 transition-colors ${sprint.timer?.isRunning ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`} title={sprint.timer?.isRunning ? 'Pause' : 'Start'}>
                           {sprint.timer?.isRunning ? '❚❚' : '►'}
                        </button>
                      </div>
                    </td>
                    <td className="text-center px-6 py-4">
                      <span className="cursor-pointer text-blue-600 hover:underline" onClick={() => handleFeedbackClick(sprint)}>
                        View Report
                      </span>
                    </td>
                    <td className="text-center px-6 py-4">
                      <select value={sprint.status || 'pending'} onChange={(e) => handleStatusChange(sprint._id, e.target.value)} className="px-1 py-1 rounded focus:outline-none text-lg">
                        {STATUS_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {sprints.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No students in current session</h3>
            <p className="text-gray-600">Students will appear here only during their allocated session time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSprint;