// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Pagination from '../../components/common/Pagination';

// interface Session {
//   id: number;
//   date: string;
//   session: string;
//   room: string;
// }

// const SESSION_OPTIONS = [
//   '6am - 9am',
//   '10am - 1pm',
//   '2pm - 5pm',
//   '7pm - 10pm',
// ];
// const ROOM_OPTIONS = ['Room 1', 'Room 2'];

// const LOCAL_STORAGE_KEY = 'tutorSessions';

// const TutorSessions: React.FC = () => {
//   const navigate = useNavigate();
//   const [sessions, setSessions] = useState<Session[]>(() => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     if (saved) return JSON.parse(saved);
//     return [
//       { id: 1, date: new Date().toLocaleDateString('en-GB'), session: '6am - 9am', room: 'Room 1' },
//       // { id: 2, date: new Date().toLocaleDateString('en-GB'), session: '10am - 1pm', room: 'Room 2' },
//       // { id: 3, date: new Date().toLocaleDateString('en-GB'), session: '2pm - 5pm', room: 'Room 1' },
//     ];
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingSession, setEditingSession] = useState<Session | null>(null);
//   const [form, setForm] = useState({
//     session: '',
//     room: '',
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage] = useState(8); // Only rowsPerPage is used

//   const handleViewSession = (sessionId: number) => {
//     navigate(`/tutor/session-view/${sessionId}`);
//   };

//   const handleEditSession = (session: Session) => {
//     setEditingSession(session);
//     setForm({ session: session.session, room: session.room });
//     setShowEditModal(true);
//   };

//   const handleDeleteSession = (sessionId: number) => {
//     if (window.confirm('Are you sure you want to delete this session?')) {
//       setSessions(prev => prev.filter(s => s.id !== sessionId));
//     }
//   };

//   useEffect(() => {
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
//   }, [sessions]);

//   const handleAddSession = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.session || !form.room) return;
//     const newSession = {
//       id: Date.now(),
//       date: new Date().toLocaleDateString('en-GB'),
//       session: form.session,
//       room: form.room,
//     };
//     setSessions((prev: Session[]) => [
//       ...prev,
//       newSession,
//     ]);

//     // --- AUTO-UPDATE STUDENT ALLOCATION DATA ---
//     // Get all sessionStudents
//     const sessionStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
//     // For each student, if their last allocation matches this session/room, update their allocationData
//     interface Student {
//       name: string;
//       phoneNumber: string;
//       subject: string;
//       chapter: string;
//       session: string;
//       room: string;
//     }
//     sessionStudents.forEach((student: Student) => {
//       if (student.session === newSession.session && student.room === newSession.room) {
        
//         const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//         if (student.name === userInfo.name && student.phoneNumber === userInfo.phoneNumber) {
//           localStorage.setItem('studentAllocationData', JSON.stringify({
//             subject: student.subject,
//             chapter: student.chapter,
//             session: newSession.session,
//             room: newSession.room,
//             date: newSession.date
//           }));
//         }
//       }
//     });
//     // --- END AUTO-UPDATE ---

//     setShowModal(false);
//     setForm({ session: '', room: '' });
//   };

//   const handleEditSessionSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingSession || !form.session || !form.room) return;
    
//     setSessions(prev => prev.map(s => 
//       s.id === editingSession.id 
//         ? { ...s, session: form.session, room: form.room }
//         : s
//     ));
    
//     setShowEditModal(false);
//     setEditingSession(null);
//     setForm({ session: '', room: '' });
//   };

//   // Pagination logic
//   const totalItems = sessions.length;
//   const paginatedSessions = sessions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Add Session Button */}
//         <div className="flex justify-between items-center mb-6">
//                     <button
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
//             onClick={() => setShowModal(true)}
//           >
//             Add Session +
//                     </button>
//         </div>
//         {/* Table Container */}
//         <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//             <thead>
//   <tr className="border-b border-white/30 bg-gray-100">
//     <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Date</th>
//     <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Sessions</th>
//     <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Room</th>
//     <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Status</th>
//     <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Action</th>
//   </tr>
// </thead>
// <tbody>
//   {paginatedSessions.map((session: Session, index: number) => (
//     <tr
//       key={session.id}
//       className={`${index < paginatedSessions.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200`}
//     >
//       <td className="w-1/5 text-center py-4 px-4 text-gray-800 font-medium">{session.date}</td>
//       <td className="w-1/5 text-center py-4 px-4 text-gray-700">{session.session}</td>
//       <td className="w-1/5 text-center py-4 px-4 text-gray-700">{session.room}</td>
//       <td className="w-1/5 text-center py-4 px-4">
//         <button 
//           onClick={() => handleViewSession(session.id)}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
//         >
//           View
//         </button>
//       </td>
//       <td className="w-1/5 text-center py-4 px-4">
//         <div className="flex justify-center gap-2">
//           <button
//             onClick={() => handleEditSession(session)}
//             className="text-blue-500 hover:text-blue-600 p-2 transition-colors duration-200"
//             title="Edit"
//           >
//             <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//             </svg>
//           </button>
//           <button
//             onClick={() => handleDeleteSession(session.id)}
//             className="text-red-500 hover:text-red-600 p-2 transition-colors duration-200"
//             title="Delete"
//           >
//             <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 2 0 00-1 1v3M4 7h16" />
//             </svg>
//           </button>
//         </div>
//       </td>
//     </tr>
//   ))}
// </tbody>
//             </table>
//           </div>
//           <Pagination
//             totalItems={totalItems}
//             rowsPerPage={rowsPerPage}
//             currentPage={currentPage}
//             onPageChange={setCurrentPage}
//             // onRowsPerPageChange={rows => { setRowsPerPage(rows); setCurrentPage(1); }}
//           />
//         </div>
        
//         {/* Add Session Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
//               <button
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
//                 onClick={() => setShowModal(false)}
//                 aria-label="Close"
//               >
//                 ×
//               </button>
//               <h2 className="text-xl font-bold text-gray-800 mb-6">Add Session</h2>
//               <form onSubmit={handleAddSession} className="space-y-5">
//               <div className="relative">
//   <select
//     value={form.session}
//     onChange={e => setForm(f => ({ ...f, session: e.target.value }))}
//     className="w-full appearance-none px-3 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
//     required
//   >
//     <option value="">Select session</option>
//     {SESSION_OPTIONS.map(opt => (
//       <option key={opt} value={opt}>{opt}</option>
//     ))}
//   </select>
//      <div className="pointer-events-none absolute top-6 right-5 transform -translate-y-1/2 text-gray-700">
//      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//      </svg>
//    </div>
// </div>

//                 <div className="relative">
//                   <label className="block text-gray-700 font-medium mb-2">Room</label>
//                   <select
//                     value={form.room}
//                     onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
//                     className="w-full appearance-none px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
//                     required
//                   >
//                     <option value="">Select room</option>
//                     {ROOM_OPTIONS.map(opt => (
//                       <option key={opt} value={opt}>{opt}</option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute top-14 right-5 transform -translate-y-1/2 text-gray-700">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               <button 
//                   type="submit"
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
//               >
//                   Add
//               </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Edit Session Modal */}
//         {showEditModal && editingSession && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
//               <button
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
//                 onClick={() => setShowEditModal(false)}
//                 aria-label="Close"
//               >
//                 ×
//               </button>
//               <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Session</h2>
//               <form onSubmit={handleEditSessionSubmit} className="space-y-5">
//                 <div className="relative">
//                   <label className="block text-gray-700 font-medium mb-2">Session</label>
//                   <select
//                     value={form.session}
//                     onChange={e => setForm(f => ({ ...f, session: e.target.value }))}
//                     className="w-full appearance-none px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
//                     required
//                   >
//                     <option value="">Select session</option>
//                     {SESSION_OPTIONS.map(opt => (
//                       <option key={opt} value={opt}>{opt}</option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute top-14 right-5 transform -translate-y-1/2 text-gray-700">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//           </div>
//                 <div className="relative">
//                   <label className="block text-gray-700 font-medium mb-2">Room</label>
//                   <select
//                     value={form.room}
//                     onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
//                     className="w-full appearance-none px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
//                     required
//                   >
//                     <option value="">Select room</option>
//                     {ROOM_OPTIONS.map(opt => (
//                       <option key={opt} value={opt}>{opt}</option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute top-14 right-5 transform -translate-y-1/2 text-gray-700">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//                 <button 
//                     type="submit"
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
//                 >
//                     Update
//                 </button>
//               </form>
//           </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TutorSessions;

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiService } from '../../services/api';
// import Pagination from '../../components/common/Pagination';
// import type { AllocationData as Session } from '../../types';

// // These can be moved to a config file later
// const SESSION_OPTIONS = [
//   '6am - 9am',
//   '10am - 1pm',
//   '2pm - 5pm',
//   '7pm - 10pm',
// ];
// const ROOM_OPTIONS = ['Room 1', 'Room 2'];

// const TutorSessions: React.FC = () => {
//   const navigate = useNavigate();
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // State for modals and forms
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingSession, setEditingSession] = useState<Session | null>(null);
//   const [form, setForm] = useState({ session: '', room: '' });
  
//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 8;

//   // --- Data Fetching ---
//   // useEffect(() => {
//   //   const fetchTutorSessions = async () => {
//   //     const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//   //     if (!userInfo.id) {
//   //       setIsLoading(false);
//   //     }
//   //     try {
//   //       setIsLoading(true);
//   //       // Assumes an endpoint like GET /api/sessions/tutor/:tutorId
//   //       // You'll need to create this in your ApiService and backend
//   //       const tutorSessions = await apiService.getSessionsByTutorId(userInfo.id);
//   //       setSessions(tutorSessions);
//   //     } catch (error) {
//   //       console.error("Failed to fetch tutor sessions:", error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };
//   //   fetchTutorSessions();
//   // }, []);

// // useEffect(() => {
// //   const fetchTutorSessions = async () => {
// //     const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
// //     if (!userInfo.id) {
// //       setIsLoading(false);
// //       return;
// //     }
// //     try {
// //       setIsLoading(true);
// //       // Ensure you are calling the correct, single function name
// //       const tutorSessions = await apiService.getSessionsByTutor(userInfo.id);
// //       setSessions(tutorSessions);
// //     } catch (error) {
// //       console.error("Failed to fetch tutor sessions:", error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };
// //   fetchTutorSessions();
// // }, []);
  
// useEffect(() => {
//   const fetchTutorSessions = async () => {
//     console.log("1. Component is ready. Starting to fetch sessions...");

//     const userInfoString = localStorage.getItem('userInfo');
//     console.log("2. Raw data from localStorage for 'userInfo':", userInfoString);

//     if (!userInfoString) {
//       console.error("ERROR: No 'userInfo' found in localStorage. Cannot fetch sessions.");
//       setIsLoading(false);
//       return;
//     }

//     const userInfo = JSON.parse(userInfoString);
//     console.log("3. Parsed userInfo object:", userInfo);
//     console.log("4. Trying to find the user ID using 'userInfo.id':", userInfo.id);

//     // This is the most important check
//     if (!userInfo.id) {
//       console.error("ERROR: User ID not found in the userInfo object! Halting API call.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       console.log(`5. User ID is ${userInfo.id}. Calling the API to get sessions...`);
//       const tutorSessions = await apiService.getSessionsByTutor(userInfo.id);
//       console.log("6. SUCCESS: Received sessions from API:", tutorSessions);
//       setSessions(tutorSessions);
//     } catch (error) {
//       console.error("7. API ERROR: The request to the database failed.", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchTutorSessions();
// }, []);

//   // --- Event Handlers ---
//   const handleViewSession = (sessionId: string) => {
//     navigate(`/tutor/session-view/${sessionId}`);
//   };

//   const handleOpenEditModal = (session: Session) => {
//     setEditingSession(session);
//     setForm({ session: session.session, room: session.room });
//     setShowEditModal(true);
//   };

//   const handleDeleteSession = async (sessionId: string) => {
//     if (window.confirm('Are you sure you want to delete this session?')) {
//       try {
//         await apiService.deleteSession(sessionId);
//         setSessions(prev => prev.filter(s => s._id !== sessionId));
//       } catch (error) {
//         console.error("Failed to delete session:", error);
//         alert("Error: Could not delete session.");
//       }
//     }
//   };

//   const handleAddSession = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.session || !form.room) return alert("Please select a session and room.");
    
//     const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//     const newSessionData = {
//       tutorId: userInfo.id,
//       tutorName: userInfo.name,
//       date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
//       session: form.session,
//       room: form.room,
//       // Add other required fields if your backend needs them
//       studentName: 'N/A',
//       subject: 'N/A',    
//       chapter: 'N/A',     
//     };

//     try {
//       const newSession = await apiService.createSession(newSessionData);
//       setSessions(prev => [...prev, newSession]);
//       setShowAddModal(false);
//       setForm({ session: '', room: '' });
//     } catch (error) {
//       console.error("Failed to create session:", error);
//       alert("Error: Could not create session.");
//     }
//   };

//   const handleEditSessionSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingSession || !form.session || !form.room) return;
    
//     const updatedData = { session: form.session, room: form.room };
    
//     try {
//         const updatedSession = await apiService.updateSession(editingSession._id, updatedData);
//         setSessions(prev => prev.map(s => s._id === editingSession._id ? updatedSession : s));
//         setShowEditModal(false);
//         setEditingSession(null);
//         setForm({ session: '', room: '' });
//     } catch (error) {
//         console.error("Failed to update session:", error);
//         alert("Error: Could not update session.");
//     }
//   };

//   // --- Pagination Logic ---
//   const paginatedSessions = sessions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   if (isLoading) {
//     return <div className="p-8 text-center">Loading sessions...</div>;
//   }

//   return (
//     <div className="min-h-screen p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Add Session Button */}
//         <div className="flex justify-between items-center mb-6">
//             <button
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
//                 onClick={() => setShowAddModal(true)}
//             >
//                 Add Session +
//             </button>
//         </div>

//         {/* Table Container */}
//         <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/30 bg-gray-100">
//                   <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Date</th>
//                   <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Session</th>
//                   <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Room</th>
//                   <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Status</th>
//                   <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedSessions.map((session, index) => (
//                   <tr key={session._id} className={`${index < paginatedSessions.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20`}>
//                     <td className="w-1/5 text-center py-4 px-4">{new Date(session.date).toLocaleDateString('en-GB')}</td>
//                     <td className="w-1/5 text-center py-4 px-4">{session.session}</td>
//                     <td className="w-1/5 text-center py-4 px-4">{session.room}</td>
//                     <td className="w-1/5 text-center py-4 px-4">
//                       <button 
//                         onClick={() => handleViewSession(session._id)}
//                         className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
//                       >
//                         View
//                       </button>
//                     </td>
//                     <td className="w-1/5 text-center py-4 px-4">
//                       <div className="flex justify-center gap-2">
//                         <button onClick={() => handleOpenEditModal(session)} className="text-blue-500 hover:text-blue-600 p-2" title="Edit">
//                           <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
//                         </button>
//                         <button onClick={() => handleDeleteSession(session._id)} className="text-red-500 hover:text-red-600 p-2" title="Delete">
//                           <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <Pagination
//             totalItems={sessions.length}
//             rowsPerPage={rowsPerPage}
//             currentPage={currentPage}
//             onPageChange={setCurrentPage}
//           />
//         </div>
        
//         {/* Add Session Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
//               <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowAddModal(false)}>×</button>
//               <h2 className="text-xl font-bold mb-6">Add Session</h2>
//               <form onSubmit={handleAddSession} className="space-y-5">
//                 <div>
//                   <label className="block mb-2">Session</label>
//                   <select value={form.session} onChange={e => setForm(f => ({ ...f, session: e.target.value }))} className="w-full p-3 border rounded-xl" required>
//                     <option value="">Select session</option>
//                     {SESSION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block mb-2">Room</label>
//                   <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="w-full p-3 border rounded-xl" required>
//                     <option value="">Select room</option>
//                     {ROOM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                   </select>
//                 </div>
//                 <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">Add</button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Edit Session Modal */}
//         {showEditModal && editingSession && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
//               <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowEditModal(false)}>×</button>
//               <h2 className="text-xl font-bold mb-6">Edit Session</h2>
//               <form onSubmit={handleEditSessionSubmit} className="space-y-5">
//                 <div>
//                   <label className="block mb-2">Session</label>
//                   <select value={form.session} onChange={e => setForm(f => ({ ...f, session: e.target.value }))} className="w-full p-3 border rounded-xl" required>
//                     <option value="">Select session</option>
//                     {SESSION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block mb-2">Room</label>
//                   <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="w-full p-3 border rounded-xl" required>
//                     <option value="">Select room</option>
//                     {ROOM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                   </select>
//                 </div>
//                 <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">Update</button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TutorSessions;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import Pagination from '../../components/common/Pagination';
import type { AllocationData as Session } from '../../types';

// These can be moved to a config file later
const SESSION_OPTIONS = ['6am - 9am', '10am - 1pm', '2pm - 5pm', '7pm - 10pm'];
const ROOM_OPTIONS = ['Room 1', 'Room 2'];

// Define a type for your user info object
interface UserInfo {
  id: string;
  _id?: string; // Keep _id optional for transition
  name: string;
}

const TutorSessions: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Store user info in state
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // State for modals and forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [form, setForm] = useState({ session: '', room: '' });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Effect to load user info first
  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userData = JSON.parse(userInfoString);
      // Ensure the id field is consistent
      userData.id = userData.id || userData._id;
      setUserInfo(userData);
    } else {
      console.error("No user info found, cannot fetch sessions.");
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch sessions AFTER user info is loaded
  useEffect(() => {
    if (!userInfo) return;

    const fetchTutorSessions = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching sessions for tutor ID: ${userInfo.id}`);
        const tutorSessions = await apiService.getSessionsByTutor(userInfo.id);
        
        if (Array.isArray(tutorSessions)) {
          setSessions(tutorSessions);
        } else {
          console.error("API returned non-array response:", tutorSessions);
          setSessions([]);
        }
      } catch (error) {
        console.error("API ERROR fetching sessions:", error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutorSessions();
  }, [userInfo]);

  // --- Event Handlers ---

  const handleViewSession = (sessionId: string) => {
    navigate(`/tutor/session-view/${sessionId}`);
  };

  const handleOpenEditModal = (session: Session) => {
    setEditingSession(session);
    setForm({ session: session.session, room: session.room });
    setShowEditModal(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await apiService.deleteSession(sessionId);
        setSessions(prev => prev.filter(s => s._id !== sessionId));
      } catch (error) {
        console.error("Failed to delete session:", error);
        alert("Error: Could not delete session.");
      }
    }
  };
  
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.session || !form.room) return alert("Please select a session and room.");
    
    if (!userInfo) {
      alert("Error: User information not found. Please log in again.");
      return;
    }

    const newSessionData = {
      tutorId: userInfo.id,
      tutorName: userInfo.name,
      date: new Date().toISOString().split('T')[0], 
      session: form.session,
      room: form.room,
      studentName: 'N/A',
      subject: 'N/A',    
      chapter: 'N/A',     
    };

    try {
      const newSession = await apiService.createSession(newSessionData);
      setSessions(prev => [newSession, ...prev]);
      setShowAddModal(false);
      setForm({ session: '', room: '' });
    } catch (error: any) {
      console.error("Failed to create session:", error);
      const errorMessage = error?.message || "Error: Could not create session.";
      alert(errorMessage);
    }
  };

  const handleEditSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !form.session || !form.room) return;
    
    const updatedData = { session: form.session, room: form.room };
    
    try {
        const updatedSession = await apiService.updateSession(editingSession._id, updatedData);
        setSessions(prev => prev.map(s => s._id === editingSession._id ? updatedSession : s));
        setShowEditModal(false);
        setEditingSession(null);
        setForm({ session: '', room: '' });
    } catch (error: any) {
        console.error("Failed to update session:", error);
        const errorMessage = error?.message || "Error: Could not update session.";
        alert(errorMessage);
    }
  };

  // --- Pagination Logic ---
  const paginatedSessions = sessions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (isLoading) {
    return <div className="p-8 text-center">Loading sessions...</div>;
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen p-8">
       <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
                onClick={() => setShowAddModal(true)}
            >
                Add Session +
            </button>
            <div className="text-sm text-gray-500">
              Total Sessions: {sessions.length}
            </div>
        </div>

        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100">
                  <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Date</th>
                  <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Session</th>
                  <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Room</th>
                  <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Status</th>
                  <th className="w-1/5 text-center py-4 px-4 text-blue-900 font-semibold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                      No sessions found. Click "Add Session +" to create your first session.
                    </td>
                  </tr>
                ) : (
                  paginatedSessions.map((session, index) => (
                    <tr key={session._id} className={`${index < paginatedSessions.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20`}>
                      <td className="w-1/5 text-center py-4 px-4">{new Date(session.date).toLocaleDateString('en-GB')}</td>
                      <td className="w-1/5 text-center py-4 px-4">{session.session}</td>
                      <td className="w-1/5 text-center py-4 px-4">{session.room}</td>
                      <td className="w-1/5 text-center py-4 px-4">
                        <button 
                          onClick={() => handleViewSession(session._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                        >
                          View
                        </button>
                      </td>
                      <td className="w-1/5 text-center py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenEditModal(session)} className="text-blue-500 hover:text-blue-600 p-2" title="Edit">
                            <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => handleDeleteSession(session._id)} className="text-red-500 hover:text-red-600 p-2" title="Delete">
                            <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {sessions.length > 0 && (
            <Pagination
              totalItems={sessions.length}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowAddModal(false)}>×</button>
              <h2 className="text-xl font-bold mb-6">Add Session</h2>
              <form onSubmit={handleAddSession} className="space-y-5">
                <div>
                  <label className="block mb-2">Session</label>
                  <select value={form.session} onChange={e => setForm(f => ({ ...f, session: e.target.value }))} className="w-full p-3 border rounded-xl" required>
                    <option value="">Select session</option>
                    {SESSION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Room</label>
                  <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="w-full p-3 border rounded-xl" required>
                    <option value="">Select room</option>
                    {ROOM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">Add</button>
              </form>
            </div>
          </div>
        )}
        
        {showEditModal && editingSession && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowEditModal(false)}>×</button>
              <h2 className="text-xl font-bold mb-6">Edit Session</h2>
              <form onSubmit={handleEditSessionSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2">Session</label>
                  <select value={form.session} onChange={e => setForm(f => ({ ...f, session: e.target.value }))} className="w-full p-3 border rounded-xl" required>
                    <option value="">Select session</option>
                    {SESSION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Room</label>
                  <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="w-full p-3 border rounded-xl" required>
                    <option value="">Select room</option>
                    {ROOM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">Update</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSessions;