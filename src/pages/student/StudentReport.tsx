// import { useState, useEffect } from 'react';
// import { Download, MessageCircle, FileText } from 'lucide-react';
// import Navbar from '../../components/layout/Navbar';
// import Sidebar from '../../components/layout/Sidebar';
// import { sessionManager } from '../../utils/sessionManager';


// interface ChatMessage {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: string;
// }

// interface ChatHistory {
//   date: string;
//   session: string;
//   room: string;
//   messages: ChatMessage[];
// }

// interface StudentReportProps {
//   showSidebar?: boolean;
// }

// const StudentReport = ({ showSidebar }: StudentReportProps) => {
//   const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
//   const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
//   const [currentSession, setCurrentSession] = useState<ChatHistory | null>(null);
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeLink, setActiveLink] = useState('Report');
//   const [userType, setUserType] = useState<'student' | 'tutor' | 'admin'>('student');

//   // Determine navigation source and user type
//   useEffect(() => {
//     const navigationSource = localStorage.getItem('reportNavigationSource');
//     const userInfo = localStorage.getItem('userInfo');
    
//     if (navigationSource === 'tutor') {
//       setUserType('tutor');
//     } else if (navigationSource === 'admin') {
//       setUserType('admin');
//     } else {
//       // Default to student if no navigation source or from student context
//       setUserType('student');
//     }
    
//     // Also check userInfo to determine user type
//     if (userInfo) {
//       const user = JSON.parse(userInfo);
//       if (user.role) {
//         setUserType(user.role);
//       }
//     }
//   }, []);

//   // Determine if sidebar should be shown - default to true for student context
//   // But if we're in tutor or admin context, don't show the component's own sidebar
//   const shouldShowSidebar = showSidebar !== undefined ? showSidebar : 
//     (userType === 'student' && localStorage.getItem('showStudentReportSidebar') !== 'false');

//   useEffect(() => {
//     // Check for selected session ID first (new system)
//     const selectedSessionId = localStorage.getItem('selectedSessionId');
    
//     if (selectedSessionId) {
//       console.log('Loading session by ID:', selectedSessionId);
      
//       // Get evaluation by session ID
//       const evaluation = sessionManager.getEvaluation(selectedSessionId);
//       if (evaluation) {
//         console.log('Found evaluation for session ID:', evaluation);
        
//         // Convert to ChatHistory format
//         const chatHistoryData: ChatHistory = {
//           date: evaluation.date,
//           session: evaluation.session,
//           room: evaluation.room,
//           messages: evaluation.messages
//         };
        
//         setCurrentSession(chatHistoryData);
        
//         // Also add to chat history list
//         setChatHistory([chatHistoryData]);
        
//         // Clear the selected session ID
//         localStorage.removeItem('selectedSessionId');
//         return;
//       }
//     }
    
//     // Fallback to legacy system
//     const selectedSession = localStorage.getItem('selectedSessionForReport');
//     console.log('=== Checking for selected session (legacy) ===');
//     console.log('selectedSessionForReport in localStorage:', selectedSession);
    
//     if (selectedSession) {
//       try {
//         const sessionData = JSON.parse(selectedSession);
//         console.log('Selected session data:', sessionData);
        
//         // Validate session data
//         if (!sessionData || !sessionData.date || !sessionData.session || !sessionData.room) {
//           console.error('Invalid session data:', sessionData);
//           setCurrentSession(null);
//           return;
//         }
        
//         // Try to find the session in localStorage (legacy method)
//         const sessionKey = `studentChatHistory_${sessionData.date}_${sessionData.session}_${sessionData.room}`.replace(/[^a-zA-Z0-9_]/g, '_');
//         console.log('Looking for session with key:', sessionKey);
        
//         const savedSessionData = localStorage.getItem(sessionKey);
//         if (savedSessionData) {
//           try {
//             const currentSessionData = JSON.parse(savedSessionData);
//             console.log('Found session in localStorage:', currentSessionData);
//             setCurrentSession(currentSessionData);
//           } catch (error) {
//             console.error('Error parsing selected session data:', error);
//           }
//         } else {
//           console.log('Session not found in localStorage');
//           setCurrentSession(null);
//         }
        
//         // Clear the selected session after using it
//         localStorage.removeItem('selectedSessionForReport');
//       } catch (error) {
//         console.error('Error processing selected session:', error);
//         setCurrentSession(null);
//       }
//     } else {
//       // If no specific session selected, load all available sessions
//       console.log('No specific session selected, loading all sessions');
//       loadAllSessions();
//     }
//   }, []);

//   // Load all sessions from session manager
//   const loadAllSessions = () => {
//     const allEvaluations = sessionManager.getAllEvaluations();
//     const allHistory: ChatHistory[] = [];
    
//     console.log('=== Loading all sessions ===');
//     console.log('Found evaluations:', allEvaluations.length);
    
//     allEvaluations.forEach(evaluation => {
//       const chatHistoryData: ChatHistory = {
//         date: evaluation.date,
//         session: evaluation.session,
//         room: evaluation.room,
//         messages: evaluation.messages
//       };
//       allHistory.push(chatHistoryData);
//       console.log('Loaded session:', chatHistoryData);
//     });
    
//     // Sort by date and time (most recent first)
//     allHistory.sort((a, b) => {
//       const dateA = new Date(a.date + ' ' + a.session);
//       const dateB = new Date(b.date + ' ' + b.session);
//       return dateB.getTime() - dateA.getTime();
//     });
    
//     setChatHistory(allHistory);
//     console.log('Total sessions loaded:', allHistory.length);
//   };

//   // Clear the sidebar flag after using it
//   useEffect(() => {
//     if (localStorage.getItem('showStudentReportSidebar')) {
//       localStorage.removeItem('showStudentReportSidebar');
//     }
//   }, []);

//   // Only auto-select first session if no specific session was passed and we're in development/testing mode
//   useEffect(() => {
//     if (chatHistory.length > 0 && !currentSession && import.meta.env.DEV) {
//       console.log('Development mode: Auto-selecting first available session:', chatHistory[0]);
//       setCurrentSession(chatHistory[0]);
//     }
//   }, [chatHistory, currentSession]);

//   // Debug: Log current session state
//   useEffect(() => {
//     console.log('Current session state:', currentSession);
//     console.log('Chat history length:', chatHistory.length);
//   }, [currentSession, chatHistory]);

//   // Live update: poll for latest evaluation every 2 seconds
//   useEffect(() => {
//     let sessionId = localStorage.getItem('selectedSessionId');
//     if (!sessionId && currentSession) {
//       // Try to infer sessionId from currentSession (if available)
//       const allEvaluations = sessionManager.getAllEvaluations();
//       const found = allEvaluations.find(e =>
//         e.date === currentSession.date &&
//         e.session === currentSession.session &&
//         e.room === currentSession.room
//       );
//       if (found) sessionId = found.sessionId;
//     }
//     if (!sessionId) return;
//     const interval = setInterval(() => {
//       const evaluation = sessionManager.getEvaluation(sessionId!);
//       if (evaluation) {
//         setCurrentSession({
//           date: evaluation.date,
//           session: evaluation.session,
//           room: evaluation.room,
//           messages: evaluation.messages
//         });
//       }
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [currentSession]);

  // const generatePDF = () => {
  //   if (!currentSession) return;

  //   // Create PDF content
  //   const pdfContent = `
  //     AI Assistant Chat Report
  //     Date: ${currentSession.date}
  //     Session: ${currentSession.session}
  //     Room: ${currentSession.room}
      
  //     ${currentSession.messages.map(msg => `
  //       ${msg.role === 'user' ? 'Student' : 'AI Assistant'} (${msg.timestamp}):
  //       ${msg.content}
  //     `).join('\n\n')}
  //   `;

  //   // Create blob and download
  //   const blob = new Blob([pdfContent], { type: 'application/pdf' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `AI_Chat_Report_${currentSession.date}_${currentSession.session}.pdf`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };

  
//   const handleLogout = () => {
//     localStorage.removeItem('userInfo');
    
//     // Clear user-specific data based on user type
//     if (userType === 'student') {
//       localStorage.removeItem('studentAllocationData');
//       localStorage.removeItem('studentAllocationCompleted');
//       localStorage.removeItem('studentSkipAllocation');
//       localStorage.removeItem('studentActiveLink');
//     } else if (userType === 'tutor') {
//       localStorage.removeItem('tutorActiveLink');
//     } else if (userType === 'admin') {
//       localStorage.removeItem('adminActiveLink');
//     }
    
//     // Clear navigation source
//     localStorage.removeItem('reportNavigationSource');
    
//     window.location.href = '/login';
//   };

//   const handleSidebarClick = (link: string) => {
//     setActiveLink(link);
    
//     // Navigate based on user type
//     if (userType === 'tutor') {
//       if (link === 'Dashboard') {
//         window.location.href = '/tutor';
//       } else if (link === 'Sprint') {
//         window.location.href = '/tutor/sprint';
//       } else if (link === 'Sessions') {
//         window.location.href = '/tutor/sessions';
//       } else if (link === 'Students') {
//         window.location.href = '/tutor/students';
//       }
//     } else if (userType === 'admin') {
//       if (link === 'Dashboard') {
//         window.location.href = '/admin';
//       } else if (link === 'Manage People') {
//         window.location.href = '/admin/manage-people';
//       } else if (link === 'Reports') {
//         window.location.href = '/admin/reports';
//       }
//     } else {
//       // Student navigation
//       if (link === 'Dashboard') {
//         window.location.href = '/student';
//       } else if (link === 'AI Assistant') {
//         window.location.href = '/student';
//       } else if (link === 'Sessions') {
//         window.location.href = '/student';
//       } else if (link === 'Allocation') {
//         window.location.href = '/student';
//       }
//     }
//   };

  

//   const calculateAccuracy = (messages: ChatMessage[]) => {
//     const userMessages = messages.filter(msg => msg.role === 'user');
//     const aiMessages = messages.filter(msg => msg.role === 'assistant');
    
//     if (userMessages.length === 0) return '0';
    
//     // Count questions that received detailed responses
//     let detailedResponses = 0;
//     let respondedQuestions = 0;
    
//     userMessages.forEach((_, index) => {
//       const correspondingAI = aiMessages[index];
//       if (correspondingAI && correspondingAI.content) {
//         respondedQuestions++;
//         if (correspondingAI.content.length > 100) {
//           detailedResponses++;
//         }
//       }
//     });
    
//     if (respondedQuestions === 0) return '0';
//     return Math.round((detailedResponses / respondedQuestions) * 100).toString();
//   };

//   const calculateScore = (messages: ChatMessage[]) => {
//     const userMessages = messages.filter(msg => msg.role === 'user');
//     const aiMessages = messages.filter(msg => msg.role === 'assistant');
    
//     if (userMessages.length === 0) return '0';
    
//     let totalScore = 0;
//     let scoredQuestions = 0;
    
//     userMessages.forEach((_, index) => {
//       const correspondingAI = aiMessages[index];
//       if (correspondingAI && correspondingAI.content) {
//         scoredQuestions++;
//         // Score based on response quality
//         if (correspondingAI.content.length > 200) totalScore += 2; 
//         else if (correspondingAI.content.length > 100) totalScore += 1.5; 
//         else totalScore += 1; 
//       }
//     });
    
//     if (scoredQuestions === 0) return '0';
//     const averageScore = totalScore / scoredQuestions;
//     return Math.min(10, Math.round(averageScore * 2)).toString(); 
//   };

//   const generateSpecificFeedback = (messages: ChatMessage[]) => {
//     const feedback: { emoji: string; text: string }[] = [];
//     const userMessages = messages.filter(msg => msg.role === 'user');
//     const aiMessages = messages.filter(msg => msg.role === 'assistant');

//     if (userMessages.length === 0) {
//       feedback.push({ emoji: '💡', text: 'No questions were asked in this session.' });
//       return feedback;
//     }

//     // Analyze question types and response quality
//     let detailedQuestions = 0;
//     let shortQuestions = 0;
//     let detailedResponses = 0;
//     let genericResponses = 0;

//     userMessages.forEach((userMsg, index) => {
//       const correspondingAI = aiMessages[index];
      
//       // Analyze question complexity
//       if (userMsg.content && userMsg.content.length > 50) {
//         detailedQuestions++;
//       } else {
//         shortQuestions++;
//       }
      
//       // Analyze response quality
//       if (correspondingAI && correspondingAI.content) {
//         if (correspondingAI.content.length > 200) {
//           detailedResponses++;
//         } else if (correspondingAI.content.length < 50) {
//           genericResponses++;
//         }
//       }
//     });

//     // Generate specific feedback based on analysis
//     if (detailedQuestions > shortQuestions) {
//       feedback.push({ 
//         emoji: '✅', 
//         text: `Asked ${detailedQuestions} detailed questions, showing good engagement with complex topics.` 
//       });
//     }

//     if (detailedResponses > genericResponses) {
//       feedback.push({ 
//         emoji: '🎯', 
//         text: `Received ${detailedResponses} detailed responses from AI, indicating thorough explanations were provided.` 
//       });
//     }

//     if (genericResponses > 0) {
//       feedback.push({ 
//         emoji: '⚠️', 
//         text: `${genericResponses} responses were brief - consider asking more specific questions for better guidance.` 
//       });
//     }

//     // Analyze specific topics if mentioned
//     const content = messages.map(m => m.content ? m.content.toLowerCase() : '').join(' ');
//     if (content.includes('accounting') || content.includes('financial')) {
//       feedback.push({ 
//         emoji: '📊', 
//         text: 'Discussed accounting and financial topics - good focus on core CA subjects.' 
//       });
//     }

//     if (content.includes('tax') || content.includes('taxation')) {
//       feedback.push({ 
//         emoji: '💰', 
//         text: 'Covered taxation concepts - essential for CA exam preparation.' 
//       });
//     }

//     if (content.includes('audit') || content.includes('auditing')) {
//       feedback.push({ 
//         emoji: '🔍', 
//         text: 'Explored auditing procedures - important for practical understanding.' 
//       });
//     }

//     if (userMessages.length >= 5) {
//       feedback.push({ 
//         emoji: '💪', 
//         text: `Active session with ${userMessages.length} questions - excellent engagement!` 
//       });
//     } else if (userMessages.length >= 2) {
//       feedback.push({ 
//         emoji: '👍', 
//         text: `Good participation with ${userMessages.length} questions asked.` 
//       });
//     }

//     return feedback;
//   };

//   return (
//     <div className={`${shouldShowSidebar ? 'flex h-screen' : 'h-full'} `}>
//       {shouldShowSidebar && (
//         <Sidebar 
//           variant={userType} 
//           collapsed={collapsed} 
//           setCollapsed={setCollapsed} 
//           activeLink={activeLink} 
//           setActiveLink={handleSidebarClick} 
//           onLogout={handleLogout}
//         />
//       )}
      
//       <div className={`flex-1 transition-all duration-500 ${shouldShowSidebar ? (collapsed ? 'ml-20' : 'ml-72') : ''} relative`}>
        
        
//         {shouldShowSidebar && <Navbar userType={userType} activeLink={activeLink} />}
        
//         <main className="overflow-auto h-full bg-white/60 backdrop-blur-md relative">
          
//           <div className="p-8">
//             <div className="max-w-7xl mx-auto">
              
              

//               {/* Session Info Display */}
//               {(currentSession || chatHistory.length > 0) && (
//                 <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-sm p-4 mb-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                         {currentSession ? 'Session Details' : 'Available Sessions'}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {currentSession 
//                           ? `Date: ${currentSession.date} | Session: ${currentSession.session} | Room: ${currentSession.room}`
//                           : `${chatHistory.length} session(s) available`
//                         }
//                       </p>
//                     </div>
                    
//                   </div>
//                 </div>
//               )}

//               {/* Tab Navigation */}
//               <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden mb-6">
//                 <div className="flex">
//                   <button
//                     onClick={() => setActiveTab('report')}
//                     className={`flex-1 px-6 py-4 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
//                       activeTab === 'report'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-white text-gray-600 hover:bg-blue-50'
//                     }`}
//                   >
//                     <FileText className="w-5 h-5" />
//                     Report
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('history')}
//                     className={`flex-1 px-6 py-4 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
//                       activeTab === 'history'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-white text-gray-600 hover:bg-blue-50'
//                     }`}
//                   >
//                     <MessageCircle className="w-5 h-5" />
//                     History
//                   </button>
//                 </div>
//               </div>

//               {/* Content */}
//               {activeTab === 'report' ? (
//                 /* Report Tab */
//                 <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden max-h-[800px] overflow-y-auto shadow-xl">
//                   {currentSession ? (
//                     <div className="p-6">
//                                               {(() => {
//                           const sessionToShow = currentSession;
//                           if (!sessionToShow) return null;
//                           return (
//                           <>
//                             <div className="flex justify-between items-center mb-6 ">
//                               <div>
//                                 <h2 className="text-2xl  font-bold text-blue-700 mb-2">AI Assistant Chat Report</h2>
//                                 <p className="text-gray-600">
//                                   Date: {sessionToShow.date} | Session: {sessionToShow.session} | Room: {sessionToShow.room}
//                                 </p>
//                               </div>
//                               <button
//                                 onClick={generatePDF}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 shadow-2x;"
//                               >
//                                 <Download className="w-5 h-5" />
//                                 Download PDF
//                               </button>
//                             </div>

//                             {/* Performance Metrics */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                               <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 text-center">
//                                 <h3 className="text-lg font-semibold text-blue-800 mb-2">Accuracy</h3>
//                                 <div className="text-3xl font-bold text-blue-700">
//                                   {sessionToShow.messages.length > 0 ? calculateAccuracy(sessionToShow.messages) : '0'}%
//                                 </div>
//                               </div>
//                               <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 text-center">
//                                 <h3 className="text-lg font-semibold text-green-800 mb-2">Score</h3>
//                                 <div className="text-3xl font-bold text-green-700">
//                                   {sessionToShow.messages.length > 0 ? calculateScore(sessionToShow.messages) : '0'}/10
//                                 </div>
//                               </div>
//                               <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 text-center">
//                                 <h3 className="text-lg font-semibold text-purple-800 mb-2">Questions</h3>
//                                 <div className="text-3xl font-bold text-purple-700">{sessionToShow.messages.filter(m => m.role === 'user').length}</div>
//                               </div>
//                             </div>

//                             {/* AI Feedback Section */}
//                             <div className="bg-blue-50 rounded-xl p-6 mb-6">
//                               <h3 className="text-xl font-bold text-blue-700 mb-4">AI Feedback Summary</h3>
//                               <div className="space-y-3">
//                                 {generateSpecificFeedback(sessionToShow.messages).map((feedback, index) => (
//                                   <div key={index} className="flex items-start gap-3">
//                                     <span className="text-lg">{feedback.emoji}</span>
//                                     <p className="text-gray-700">{feedback.text}</p>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </>
//                         );
//                       })()}

                     
//                     </div>
//                   ) : (
//                     <div className="p-12 text-center">
//                       <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                         {!currentSession ? 'No Session Selected' : 'No Report Data Available'}
//                       </h3>
//                       <p className="text-gray-500">
//                         {!currentSession 
//                           ? 'Please select a specific session from the sessions page to view its report. Click "View" on a session to see its data.'
//                           : 'This session does not have any report data available. Start a conversation with the AI Assistant to generate a report.'
//                         }
//                       </p>
//                       {!currentSession && chatHistory.length > 0 && (
//                         <div className="mt-4">
//                           <p className="text-sm text-gray-500 mb-2">Available sessions in localStorage:</p>
//                           <div className="space-y-2">
//                             {chatHistory.slice(0, 3).map((session, index) => (
//                               <div key={index} className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
//                                 {session.date} - {session.session} - {session.room} ({session.messages.length} messages)
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 /* History Tab */
//                 <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl">
//                   <div className="p-6">
//                     <h2 className="text-2xl font-bold text-blue-700 mb-6">Chat History</h2>
                    
//                     {currentSession && currentSession.messages.length > 0 ? (
//                       <div className="space-y-6">
//                         {(() => {
//                           const sessionToShow = currentSession;
//                           if (!sessionToShow) return null;
//                           return (
//                             <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200">
//                               <div className="flex justify-between items-start mb-4">
//                                 <div>
//                                   <h3 className="text-lg font-semibold text-gray-800">
//                                     Session: {sessionToShow.session} | Room: {sessionToShow.room}
//                                   </h3>
//                                   <p className="text-sm text-gray-600">Date: {sessionToShow.date}</p>
//                                 </div>
//                                 <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                                   {sessionToShow.messages.length} messages
//                                 </span>
//                               </div>
                              
//                               {/* Full Chat Conversation */}
//                               <div className="space-y-10 max-h-125 overflow-y-auto">
//                                 {sessionToShow.messages.map((message, msgIndex) => (
//                                   <div
//                                     key={msgIndex}
//                                     className={`p-3 rounded-lg ${
//                                       message.role === 'user'
//                                         ? 'bg-blue-100 ml-4'
//                                         : 'bg-gray-100 mr-4'
//                                     }`}
//                                   >
//                                     <div className="flex justify-between items-start mb-1">
//                                       <span className={`font-semibold text-sm ${
//                                         message.role === 'user' ? 'text-blue-700' : 'text-gray-700'
//                                       }`}>
//                                         {message.role === 'user' ? 'Student' : 'AI Assistant'}
//                                       </span>
//                                       <span className="text-xs text-gray-500">{message.timestamp}</span>
//                                     </div>
//                                     <p className="text-gray-800 text-sm whitespace-pre-wrap">{message.content}</p>
//                                     {message.role === 'user' && (
//                                       <div className="text-xs text-gray-500 mt-1">
//                                         {(() => {
//                                           // Support legacy messages without inputMode
//                                           const inputMode = (message as any).inputMode;
//                                           let label = 'Text';
//                                           if (inputMode) {
//                                             label = inputMode.charAt(0).toUpperCase() + inputMode.slice(1);
//                                           } else if ((message as any).file) {
//                                             // If file exists, guess type
//                                             label = (message as any).file.type && (message as any).file.type.startsWith('image/') ? 'Image' : 'File';
//                                           }
//                                           return `Input Mode: ${label}`;
//                                         })()}
//                                       </div>
//                                     )}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           );
//                         })()}
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                           {!currentSession ? 'No Session Selected' : 'No Chat History Available'}
//                         </h3>
//                         <p className="text-gray-500">
//                           {!currentSession 
//                             ? 'Please select a specific session from the sessions page to view its chat history. Click "View" on a session to see its data.'
//                             : 'This session does not have any chat history available. Start a conversation with the AI Assistant to see chat history.'
//                           }
//                         </p>
//                         {!currentSession && chatHistory.length > 0 && (
//                           <div className="mt-4">
//                             <p className="text-sm text-gray-500 mb-2">Available sessions:</p>
//                             <div className="space-y-2">
//                               {chatHistory.slice(0, 3).map((session, index) => (
//                                 <div key={index} className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
//                                   {session.date} - {session.session} - {session.room} ({session.messages.length} messages)
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StudentReport;


// import  { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { apiService } from '../../services/api'; 
// import { Download, MessageCircle, FileText } from 'lucide-react';
// import Navbar from '../../components/layout/Navbar';
// import Sidebar from '../../components/layout/Sidebar';


// interface ChatMessage {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: string;
//   // Support for legacy message format
//   inputMode?: 'text' | 'voice' | 'file';
//   file?: { type: string };
// }

// interface SessionData {
//   _id: string; 
//   date: string;
//   session: string;
//   room: string;
//   messages: ChatMessage[]; 
// }

// interface StudentReportProps {
//   showSidebar?: boolean;
// }

// const StudentReport = ({ showSidebar }: StudentReportProps) => {
//   const { sessionId } = useParams<{ sessionId: string }>();

//   // --- STATE MANAGEMENT ---
//   const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // UI State from original component
//   const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
//   const [collapsed, setCollapsed] = useState(false);
//   // const [activeLink, setActiveLink] = useState('Report');
//   const [userType, setUserType] = useState<'student' | 'tutor' | 'admin'>('student');

//   useEffect(() => {
//     if (!sessionId) {
//       setIsLoading(false);
//       setError("No session ID was provided in the URL. Please go back and select a session to view.");
//       return;
//     }

//     const fetchSessionData = async () => {
//       setIsLoading(true);
//       setError(null);
//       console.log(`STEP 1: Attempting to fetch data for sessionId: ${sessionId}`);

//       try {
//         const sessionData = await apiService.getSessionById(sessionId);
        
//         console.log("STEP 2: Raw data received from API:", sessionData);

//         // This is the critical check. Does the data have an _id?
//         if (sessionData && sessionData._id) {
//           console.log("STEP 3: Session data looks valid. Setting component state.");
//           setCurrentSession({
//             ...sessionData,
//             messages: sessionData.messages || [], // Ensure messages is always an array
//           });
//         } else {
//           // This block runs if the API returns null, undefined, or an empty object
//           console.error("STEP 3 FAILED: API returned empty or invalid data.");
//           setError("Failed to load report because the session data received from the server was empty or invalid.");
//         }

//       } catch (err) {
//         console.error("STEP 3 FAILED: An error was caught during the API call.", err);
//         setError("A network or server error occurred while trying to load the report. Please check the console for details.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchSessionData();
//   }, [sessionId]); 

//   useEffect(() => {
//     const navigationSource = localStorage.getItem('reportNavigationSource');
//     const userInfo = localStorage.getItem('userInfo');
    
//     if (navigationSource === 'tutor') {
//       setUserType('tutor');
//     } else if (navigationSource === 'admin') {
//       setUserType('admin');
//     } else {
//       setUserType('student');
//     }
    
//     if (userInfo) {
//       const user = JSON.parse(userInfo);
//       if (user.role) {
//         setUserType(user.role);
//       }
//     }
//   }, []);

//   const shouldShowSidebar = showSidebar !== undefined ? showSidebar : (userType === 'student');

//   const generatePDF = () => {
//     if (!currentSession) return;

//     // Simple text-based PDF content
//     const pdfContent = `
//       AI Assistant Chat Report
//       --------------------------
//       Date: ${new Date(currentSession.date).toLocaleDateString()}
//       Session: ${currentSession.session}
//       Room: ${currentSession.room}
      
//       --------------------------
//       Chat Transcript
//       --------------------------
      
//       ${currentSession.messages.map(msg => `
//         [${msg.timestamp}] ${msg.role === 'user' ? 'Student' : 'AI Assistant'}:
//         ${msg.content}
//       `).join('\n\n')}
//     `;

//     // Create blob and trigger download
//     const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     // Sanitize filename
//     const sessionName = currentSession.session.replace(/[^a-zA-Z0-9]/g, '_');
//     link.download = `AI_Chat_Report_${new Date(currentSession.date).toISOString().split('T')[0]}_${sessionName}.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   const handleLogout = () => {
//     localStorage.clear(); // A more robust way to clear all session-related data
//     window.location.href = '/login';
//   };

//   // const handleSidebarClick = (link: string) => {
//   //   setActiveLink(link);
//   //   const basePaths = {
//   //     student: '/student',
//   //     tutor: '/tutor',
//   //     admin: '/admin'
//   //   };
//   //   const basePath = basePaths[userType] || '/';
//   //   const linkMap = {
//   //     Dashboard: '',
//   //     'AI Assistant': '',
//   //     Sprint: '/sprint',
//   //     Sessions: '/sessions',
//   //     Students: '/students',
//   //     'Manage People': '/manage-people',
//   //     Reports: '/reports',
//   //     Allocation: ''
//   //   };
//   //   const path = linkMap[link as keyof typeof linkMap] ?? '';
//   //   window.location.href = `${basePath}${path}`;
//   // };

//   const calculateAccuracy = (messages: ChatMessage[]) => {
//     const userMessages = messages.filter(msg => msg.role === 'user');
//     const aiMessages = messages.filter(msg => msg.role === 'assistant');
//     if (userMessages.length === 0) return '0';

//     let detailedResponses = 0;
//     let respondedQuestions = 0;

//     userMessages.forEach((_, index) => {
//       if (aiMessages[index]?.content) {
//         respondedQuestions++;
//         if (aiMessages[index].content.length > 100) { 
//           detailedResponses++;
//         }
//       }
//     });

//     if (respondedQuestions === 0) return '0';
//     return Math.round((detailedResponses / respondedQuestions) * 100).toString();
//   };

//   const calculateScore = (messages: ChatMessage[]) => {
//     const userMessages = messages.filter(msg => msg.role === 'user');
//     const aiMessages = messages.filter(msg => msg.role === 'assistant');
//     if (userMessages.length === 0) return '0';
    
//     let totalScore = 0;
//     let scoredQuestions = 0;

//     userMessages.forEach((_, index) => {
//       const aiResponse = aiMessages[index];
//       if (aiResponse?.content) {
//         scoredQuestions++;
//         // Score based on response length
//         if (aiResponse.content.length > 200) totalScore += 2;
//         else if (aiResponse.content.length > 100) totalScore += 1.5;
//         else totalScore += 1;
//       }
//     });

//     if (scoredQuestions === 0) return '0';
//     const averageScore = totalScore / scoredQuestions;
//     return Math.min(10, Math.round(averageScore * 2.5)).toString(); // Scaled to 10
//   };

//   const generateSpecificFeedback = (messages: ChatMessage[]) => {
//     const feedback: { emoji: string; text: string }[] = [];
//     const userMessages = messages.filter(msg => msg.role === 'user');
//     if (userMessages.length === 0) {
//       feedback.push({ emoji: '💡', text: 'No questions were asked in this session. Start a conversation to get feedback!' });
//       return feedback;
//     }

//     let detailedQuestions = userMessages.filter(m => m.content.length > 50).length;
//     let detailedResponses = messages.filter(m => m.role === 'assistant' && m.content.length > 200).length;

//     if (detailedQuestions > userMessages.length / 2) {
//       feedback.push({ emoji: '✅', text: `Asked ${detailedQuestions} detailed questions, showing great engagement.` });
//     }
//     if (detailedResponses > userMessages.length / 2) {
//       feedback.push({ emoji: '🎯', text: `Received ${detailedResponses} thorough responses from the AI.` });
//     }

//     const content = messages.map(m => m.content.toLowerCase()).join(' ');
//     if (content.includes('tax')) feedback.push({ emoji: '💰', text: 'Covered taxation concepts, essential for CA prep.' });
//     if (content.includes('audit')) feedback.push({ emoji: '🔍', text: 'Explored auditing procedures, great for practical understanding.' });
    
//     if (userMessages.length >= 5) {
//       feedback.push({ emoji: '💪', text: `Excellent engagement with ${userMessages.length} questions asked!` });
//     } else {
//       feedback.push({ emoji: '👍', text: 'Good start! Try asking more follow-up questions in the next session.' });
//     }

//     return feedback;
//   };

//   if (isLoading) {
//     return <div className="flex h-screen items-center justify-center">Loading Session Report...</div>;
//   }
  
//   if (error) {
//     return <div className="flex h-screen items-center justify-center p-12 text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className={`${shouldShowSidebar ? 'flex h-screen' : 'h-full'}`}>
//       {shouldShowSidebar && (
//        <Sidebar 
//           variant={userType} 
//           collapsed={collapsed} 
//           setCollapsed={setCollapsed} 
//           activeLink={"Sessions"} 
//           setActiveLink={() => {}} 
//           onLogout={handleLogout}
//         />
//       )}
      
//       <div className={`flex-1 transition-all duration-500 ${shouldShowSidebar ? (collapsed ? 'ml-20' : 'ml-72') : ''} relative`}>
//         {shouldShowSidebar && <Navbar userType={userType} activeLink={"Sessions"} />}
        
//         <main className="overflow-auto h-full bg-white/60 backdrop-blur-md relative">
//           <div className="p-8">
//             <div className="max-w-7xl mx-auto">
              
//               {currentSession && (
//                 <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-sm p-4 mb-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Details</h3>
//                       <p className="text-sm text-gray-600">
//                         Date: {new Date(currentSession.date).toLocaleDateString()} | Session: {currentSession.session} | Room: {currentSession.room}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden mb-6">
//                 <div className="flex">
//                   <button
//                     onClick={() => setActiveTab('report')}
//                     className={`flex-1 px-6 py-4 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'report' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-blue-50'}`}
//                   >
//                     <FileText className="w-5 h-5" />Report
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('history')}
//                     className={`flex-1 px-6 py-4 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-blue-50'}`}
//                   >
//                     <MessageCircle className="w-5 h-5" />History
//                   </button>
//                 </div>
//               </div>

//               {activeTab === 'report' ? (
//                 <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden max-h-[800px] overflow-y-auto shadow-xl">
//                   {currentSession ? (
//                     <div className="p-6">
//                       <div className="flex justify-between items-center mb-6">
//                         <div>
//                           <h2 className="text-2xl font-bold text-blue-700 mb-2">AI Assistant Chat Report</h2>
//                           <p className="text-gray-600">
//                             Session: {currentSession.session} | Room: {currentSession.room}
//                           </p>
//                         </div>
//                         <button
//                           onClick={generatePDF}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md"
//                         >
//                           <Download className="w-5 h-5" />
//                           Download Report
//                         </button>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                         <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 text-center shadow-sm">
//                           <h3 className="text-lg font-semibold text-blue-800 mb-2">Response Accuracy</h3>
//                           <div className="text-3xl font-bold text-blue-700">
//                             {calculateAccuracy(currentSession.messages)}%
//                           </div>
//                         </div>
//                         <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 text-center shadow-sm">
//                           <h3 className="text-lg font-semibold text-green-800 mb-2">Engagement Score</h3>
//                           <div className="text-3xl font-bold text-green-700">
//                             {calculateScore(currentSession.messages)}/10
//                           </div>
//                         </div>
//                         <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 text-center shadow-sm">
//                           <h3 className="text-lg font-semibold text-purple-800 mb-2">Questions Asked</h3>
//                           <div className="text-3xl font-bold text-purple-700">
//                             {currentSession.messages.filter(m => m.role === 'user').length}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-blue-50 rounded-xl p-6 mb-6">
//                         <h3 className="text-xl font-bold text-blue-700 mb-4">AI Feedback Summary</h3>
//                         <div className="space-y-3">
//                           {generateSpecificFeedback(currentSession.messages).map((feedback, index) => (
//                             <div key={index} className="flex items-start gap-3">
//                               <span className="text-lg pt-1">{feedback.emoji}</span>
//                               <p className="text-gray-700">{feedback.text}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="p-12 text-center">
//                       <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-xl font-semibold text-gray-600">No Report Data Available</h3>
//                       <p className="text-gray-500">The selected session does not have any report data to display.</p>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl">
//                   {currentSession && currentSession.messages.length > 0 ? (
//                     <div className="p-6">
//                       <h2 className="text-2xl font-bold text-blue-700 mb-6">Chat History</h2>
//                       <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4">
//                         {currentSession.messages.map((message, msgIndex) => (
//                           <div key={msgIndex}
//                             className={`p-4 rounded-lg shadow-sm ${message.role === 'user' ? 'bg-blue-100 ml-auto w-11/12' : 'bg-gray-100 mr-auto w-11/12'}`}>
//                             <div className="flex justify-between items-center mb-2">
//                               <span className={`font-semibold text-sm ${message.role === 'user' ? 'text-blue-800' : 'text-gray-800'}`}>
//                                 {message.role === 'user' ? 'You' : 'AI Assistant'}
//                               </span>
//                               <span className="text-xs text-gray-500">{message.timestamp}</span>
//                             </div>
//                             <p className="text-gray-800 text-sm whitespace-pre-wrap">{message.content}</p>
//                             {message.role === 'user' && (
//                               <div className="text-xs text-gray-500 mt-2">
//                                 Input Mode: {message.inputMode ? (message.inputMode.charAt(0).toUpperCase() + message.inputMode.slice(1)) : (message.file ? 'File' : 'Text')}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-xl font-semibold text-gray-600">No Chat History Available</h3>
//                       <p className="text-gray-500">There are no messages recorded for this session.</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StudentReport;


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../../services/api'; 
import { Download, MessageCircle, FileText } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  // Support for legacy message format
  inputMode?: 'text' | 'voice' | 'file';
  file?: { type: string };
}

interface SessionData {
  _id: string; 
  date: string;
  session: string;
  room: string;
  messages: ChatMessage[];
  studentId?: string | { _id: string } | any; // Can be string, populated object, or ObjectId
  student_id?: string; // Legacy field
}

interface StudentReportProps {
  showSidebar?: boolean;
}

const StudentReport = ({ showSidebar }: StudentReportProps) => {
  const { sessionId } = useParams<{ sessionId: string }>();

  // --- STATE MANAGEMENT ---
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allChatHistories, setAllChatHistories] = useState<any[]>([]); // All chat histories for the student
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null); // Store studentId for fetching all histories

  // UI State from original component
  const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Report');
  const [userType, setUserType] = useState<'student' | 'tutor' | 'admin'>('student');

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      setError("No session ID was provided in the URL. Please go back and select a session to view.");
      return;
    }

    const fetchSessionData = async () => {
      setIsLoading(true);
      setError(null);
      console.log(`STEP 1: Attempting to fetch data for sessionId: ${sessionId}`);

      try {
        // Fetch session data first to get the studentId from the session
        const sessionData = await apiService.getSessionById(sessionId);
        
        console.log("STEP 2: Raw data received from API:", sessionData);

        if (sessionData && sessionData._id) {
          console.log("STEP 3: Session data looks valid. Fetching chat history from database.");
          
          // Get studentId from session data (not from logged-in user, as tutors need to see student's history)
          // The sessionData should have studentId field
          const sessionDataWithStudent = sessionData as any; // Type assertion to access studentId
          const extractedStudentId = sessionDataWithStudent.studentId?._id || sessionDataWithStudent.studentId || sessionDataWithStudent.student_id;
          setStudentId(extractedStudentId); // Store for fetching all histories
          
          // Fetch chat history from database for this specific student and session
          try {
            const chatHistory: any = await apiService.getChatHistoryBySession(sessionId, extractedStudentId);
            console.log("STEP 4: Chat history fetched from database:", chatHistory);
            
            setCurrentSession({
              ...sessionData,
              messages: (chatHistory?.messages || sessionData.messages || []) as ChatMessage[],
            });
          } catch (chatError) {
            console.warn("Could not fetch chat history from database, using session messages:", chatError);
            // Fallback to messages from session data if chat history fetch fails
            setCurrentSession({
              ...sessionData,
              messages: sessionData.messages || [],
            });
          }
        } else {
          console.error("STEP 3 FAILED: API returned empty or invalid data.");
          setError("Failed to load report because the session data received from the server was empty or invalid.");
        }

      } catch (err) {
        console.error("STEP 3 FAILED: An error was caught during the API call.", err);
        setError("A network or server error occurred while trying to load the report. Please check the console for details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessionData();
  }, [sessionId]); 

  // Determine navigation source and user type
  useEffect(() => {
    const navigationSource = localStorage.getItem('reportNavigationSource');
    const userInfo = localStorage.getItem('userInfo');
    
    if (navigationSource === 'tutor') {
      setUserType('tutor');
    } else if (navigationSource === 'admin') {
      setUserType('admin');
    } else {
      setUserType('student');
    }
    
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.role) {
        setUserType(user.role);
      }
    }
  }, []);

  // Determine if sidebar should be shown - default to true for student context
  const shouldShowSidebar = showSidebar !== undefined ? showSidebar : 
    (userType === 'student' && localStorage.getItem('showStudentReportSidebar') !== 'false');

  // Clear the sidebar flag after using it
  useEffect(() => {
    if (localStorage.getItem('showStudentReportSidebar')) {
      localStorage.removeItem('showStudentReportSidebar');
    }
  }, []);

  // Fetch all chat histories for the student when History tab is active
  useEffect(() => {
    const fetchAllChatHistories = async () => {
      if (activeTab !== 'history') return;
      if (!studentId) return; // Don't fetch if we don't have a studentId
      
      try {
        setIsLoadingHistory(true);
        console.log('Fetching all chat histories for student:', studentId);
        
        const histories = await apiService.getChatHistoriesByStudent(studentId);
        console.log('All chat histories received:', histories);
        
        // Ensure we have an array and filter to only include histories with messages
        const validHistories = Array.isArray(histories) 
          ? histories.filter((h: any) => h.messages && h.messages.length > 0)
          : [];
        
        // Sort by date (most recent first)
        validHistories.sort((a: any, b: any) => {
          const dateA = new Date(a.date || a.createdAt || 0).getTime();
          const dateB = new Date(b.date || b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        
        setAllChatHistories(validHistories);
        console.log('Processed chat histories:', validHistories.length);
      } catch (error) {
        console.error('Error fetching all chat histories:', error);
        setAllChatHistories([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    fetchAllChatHistories();
  }, [activeTab, studentId]);

  const generatePDF = () => {
    if (!currentSession) return;

    // Create PDF content
    const pdfContent = `
      AI Assistant Chat Report
      Date: ${currentSession.date}
      Session: ${currentSession.session}
      Room: ${currentSession.room}
      
      ${currentSession.messages.map(msg => `
        ${msg.role === 'user' ? 'Student' : 'AI Assistant'} (${msg.timestamp}):
        ${msg.content}
      `).join('\n\n')}
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Chat_Report_${currentSession.date}_${currentSession.session}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    
    // Clear user-specific data based on user type
    if (userType === 'student') {
      localStorage.removeItem('studentAllocationData');
      localStorage.removeItem('studentAllocationCompleted');
      localStorage.removeItem('studentSkipAllocation');
      localStorage.removeItem('studentActiveLink');
    } else if (userType === 'tutor') {
      localStorage.removeItem('tutorActiveLink');
    } else if (userType === 'admin') {
      localStorage.removeItem('adminActiveLink');
    }
    
    // Clear navigation source
    localStorage.removeItem('reportNavigationSource');
    
    window.location.href = '/login';
  };

  const handleSidebarClick = (link: string) => {
    setActiveLink(link);
    
    // Navigate based on user type
    if (userType === 'tutor') {
      if (link === 'Dashboard') {
        window.location.href = '/tutor';
      } else if (link === 'Sprint') {
        window.location.href = '/tutor/sprint';
      } else if (link === 'Sessions') {
        window.location.href = '/tutor/sessions';
      } else if (link === 'Students') {
        window.location.href = '/tutor/students';
      }
    } else if (userType === 'admin') {
      if (link === 'Dashboard') {
        window.location.href = '/admin';
      } else if (link === 'Manage People') {
        window.location.href = '/admin/manage-people';
      } else if (link === 'Reports') {
        window.location.href = '/admin/reports';
      }
    } else {
      // Student navigation
      if (link === 'Dashboard') {
        window.location.href = '/student';
      } else if (link === 'AI Assistant') {
        window.location.href = '/student';
      } else if (link === 'Sessions') {
        window.location.href = '/student';
      } else if (link === 'Allocation') {
        window.location.href = '/student';
      }
    }
  };

  const calculateAccuracy = (messages: ChatMessage[]) => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    const aiMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (userMessages.length === 0) return '0';
    
    // Count questions that received detailed responses
    let detailedResponses = 0;
    let respondedQuestions = 0;
    
    userMessages.forEach((_, index) => {
      const correspondingAI = aiMessages[index];
      if (correspondingAI && correspondingAI.content) {
        respondedQuestions++;
        if (correspondingAI.content.length > 100) {
          detailedResponses++;
        }
      }
    });
    
    if (respondedQuestions === 0) return '0';
    return Math.round((detailedResponses / respondedQuestions) * 100).toString();
  };

  const calculateScore = (messages: ChatMessage[]) => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    const aiMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (userMessages.length === 0) return '0';
    
    let totalScore = 0;
    let scoredQuestions = 0;
    
    userMessages.forEach((_, index) => {
      const correspondingAI = aiMessages[index];
      if (correspondingAI && correspondingAI.content) {
        scoredQuestions++;
        // Score based on response quality
        if (correspondingAI.content.length > 200) totalScore += 2; 
        else if (correspondingAI.content.length > 100) totalScore += 1.5; 
        else totalScore += 1; 
      }
    });
    
    if (scoredQuestions === 0) return '0';
    const averageScore = totalScore / scoredQuestions;
    return Math.min(10, Math.round(averageScore * 2)).toString(); 
  };

  const generateSpecificFeedback = (messages: ChatMessage[]) => {
    const feedback: { emoji: string; text: string }[] = [];
    const userMessages = messages.filter(msg => msg.role === 'user');
    const aiMessages = messages.filter(msg => msg.role === 'assistant');

    if (userMessages.length === 0) {
      feedback.push({ emoji: '💡', text: 'No questions were asked in this session.' });
      return feedback;
    }

    // Analyze question types and response quality
    let detailedQuestions = 0;
    let shortQuestions = 0;
    let detailedResponses = 0;
    let genericResponses = 0;

    userMessages.forEach((userMsg, index) => {
      const correspondingAI = aiMessages[index];
      
      // Analyze question complexity
      if (userMsg.content && userMsg.content.length > 50) {
        detailedQuestions++;
      } else {
        shortQuestions++;
      }
      
      // Analyze response quality
      if (correspondingAI && correspondingAI.content) {
        if (correspondingAI.content.length > 200) {
          detailedResponses++;
        } else if (correspondingAI.content.length < 50) {
          genericResponses++;
        }
      }
    });

    // Generate specific feedback based on analysis
    if (detailedQuestions > shortQuestions) {
      feedback.push({ 
        emoji: '✅', 
        text: `Asked ${detailedQuestions} detailed questions, showing good engagement with complex topics.` 
      });
    }

    if (detailedResponses > genericResponses) {
      feedback.push({ 
        emoji: '🎯', 
        text: `Received ${detailedResponses} detailed responses from AI, indicating thorough explanations were provided.` 
      });
    }

    if (genericResponses > 0) {
      feedback.push({ 
        emoji: '⚠️', 
        text: `${genericResponses} responses were brief - consider asking more specific questions for better guidance.` 
      });
    }

    // Analyze specific topics if mentioned
    const content = messages.map(m => m.content ? m.content.toLowerCase() : '').join(' ');
    if (content.includes('accounting') || content.includes('financial')) {
      feedback.push({ 
        emoji: '📊', 
        text: 'Discussed accounting and financial topics - good focus on core CA subjects.' 
      });
    }

    if (content.includes('tax') || content.includes('taxation')) {
      feedback.push({ 
        emoji: '💰', 
        text: 'Covered taxation concepts - essential for CA exam preparation.' 
      });
    }

    if (content.includes('audit') || content.includes('auditing')) {
      feedback.push({ 
        emoji: '🔍', 
        text: 'Explored auditing procedures - important for practical understanding.' 
      });
    }

    if (userMessages.length >= 5) {
      feedback.push({ 
        emoji: '💪', 
        text: `Active session with ${userMessages.length} questions - excellent engagement!` 
      });
    } else if (userMessages.length >= 2) {
      feedback.push({ 
        emoji: '👍', 
        text: `Good participation with ${userMessages.length} questions asked.` 
      });
    }

    return feedback;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Session Report...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-12 text-center">
        <div className="max-w-md">
          <MessageCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Report</h3>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${shouldShowSidebar ? 'flex h-screen' : 'h-full'} `}>
      {shouldShowSidebar && (
        <Sidebar 
          variant={userType} 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          activeLink={activeLink} 
          setActiveLink={handleSidebarClick} 
          onLogout={handleLogout}
        />
      )}
      
      <div className={`flex-1 transition-all duration-500 ${shouldShowSidebar ? (collapsed ? 'ml-20' : 'ml-72') : ''} relative`}>
        {shouldShowSidebar && <Navbar userType={userType} activeLink={activeLink} />}
        
        <main className="overflow-auto h-full bg-white/60 backdrop-blur-md relative">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">

              {/* Session Info Display */}
              {currentSession && (
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-sm p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Details</h3>
                      <p className="text-sm text-gray-600">
                        Date: {currentSession.date} | Session: {currentSession.session} | Room: {currentSession.room}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`flex-1 px-6 py-4 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                      activeTab === 'report'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    Report
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 px-6 py-4 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                      activeTab === 'history'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    History
                  </button>
                </div>
              </div>

              {/* Content */}
              {activeTab === 'report' ? (
                /* Report Tab */
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden max-h-[800px] overflow-y-auto shadow-xl">
                  {currentSession ? (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-blue-700 mb-2">AI Assistant Chat Report</h2>
                          <p className="text-gray-600">
                            Date: {currentSession.date} | Session: {currentSession.session} | Room: {currentSession.room}
                          </p>
                        </div>
                        <button
                          onClick={generatePDF}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 shadow-lg"
                        >
                          <Download className="w-5 h-5" />
                          Download PDF
                        </button>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 text-center">
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">Accuracy</h3>
                          <div className="text-3xl font-bold text-blue-700">
                            {currentSession.messages.length > 0 ? calculateAccuracy(currentSession.messages) : '0'}%
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 text-center">
                          <h3 className="text-lg font-semibold text-green-800 mb-2">Score</h3>
                          <div className="text-3xl font-bold text-green-700">
                            {currentSession.messages.length > 0 ? calculateScore(currentSession.messages) : '0'}/10
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 text-center">
                          <h3 className="text-lg font-semibold text-purple-800 mb-2">Questions</h3>
                          <div className="text-3xl font-bold text-purple-700">
                            {currentSession.messages.filter(m => m.role === 'user').length}
                          </div>
                        </div>
                      </div>

                      {/* AI Feedback Section */}
                      <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-blue-700 mb-4">AI Feedback Summary</h3>
                        <div className="space-y-3">
                          {generateSpecificFeedback(currentSession.messages).map((feedback, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-lg">{feedback.emoji}</span>
                              <p className="text-gray-700">{feedback.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Session Selected</h3>
                      <p className="text-gray-500">
                        Please select a specific session from the sessions page to view its report. Click "View" on a session to see its data.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* History Tab - Shows ALL chat history across all sessions for this student */
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-2">Complete Chat History</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      All conversations for this student across all sessions and time slots
                    </p>
                    
                    {isLoadingHistory ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading chat history...</p>
                      </div>
                    ) : allChatHistories.length > 0 ? (
                      <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4">
                        {allChatHistories.map((chatHistory, historyIndex) => {
                          // Combine all messages from this chat history
                          const allMessages = chatHistory.messages || [];
                          
                          if (allMessages.length === 0) return null;
                          
                          // Format date for display
                          const historyDate = chatHistory.date 
                            ? new Date(chatHistory.date).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'Date not available';
                          
                          return (
                            <div key={chatHistory._id || historyIndex} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    Session: {chatHistory.session || 'N/A'} | Room: {chatHistory.room || 'N/A'}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Date: {historyDate}
                                  </p>
                                </div>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  {allMessages.length} messages
                                </span>
                              </div>
                              
                              {/* Messages from this session */}
                              <div className="space-y-4">
                                {allMessages.map((message: any, msgIndex: number) => (
                                  <div
                                    key={message.id || msgIndex}
                                    className={`p-3 rounded-lg ${
                                      message.role === 'user'
                                        ? 'bg-blue-100 ml-4'
                                        : 'bg-gray-100 mr-4'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span className={`font-semibold text-sm ${
                                        message.role === 'user' ? 'text-blue-700' : 'text-gray-700'
                                      }`}>
                                        {message.role === 'user' ? 'Student' : 'AI Assistant'}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {message.timestamp 
                                          ? (typeof message.timestamp === 'string' 
                                              ? new Date(message.timestamp).toLocaleString() 
                                              : message.timestamp)
                                          : 'N/A'}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{message.content}</p>
                                    {message.role === 'user' && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {(() => {
                                          const inputMode = message.inputMode;
                                          let label = 'Text';
                                          if (inputMode) {
                                            label = inputMode.charAt(0).toUpperCase() + inputMode.slice(1);
                                          } else if (message.file) {
                                            label = message.file.type && message.file.type.startsWith('image/') ? 'Image' : 'File';
                                          }
                                          return `Input Mode: ${label}`;
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Chat History Available</h3>
                        <p className="text-gray-500">
                          No chat history found for this student. Start a conversation with the AI Assistant to see chat history.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentReport;