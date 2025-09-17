import { useState, useEffect } from 'react';
import { Download, MessageCircle, FileText } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { sessionManager } from '../../utils/sessionManager';


interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatHistory {
  date: string;
  session: string;
  room: string;
  messages: ChatMessage[];
}

interface StudentReportProps {
  showSidebar?: boolean;
}

const StudentReport = ({ showSidebar }: StudentReportProps) => {
  const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatHistory | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('Report');
  const [userType, setUserType] = useState<'student' | 'tutor' | 'admin'>('student');

  // Determine navigation source and user type
  useEffect(() => {
    const navigationSource = localStorage.getItem('reportNavigationSource');
    const userInfo = localStorage.getItem('userInfo');
    
    if (navigationSource === 'tutor') {
      setUserType('tutor');
    } else if (navigationSource === 'admin') {
      setUserType('admin');
    } else {
      // Default to student if no navigation source or from student context
      setUserType('student');
    }
    
    // Also check userInfo to determine user type
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.role) {
        setUserType(user.role);
      }
    }
  }, []);

  // Determine if sidebar should be shown - default to true for student context
  // But if we're in tutor or admin context, don't show the component's own sidebar
  const shouldShowSidebar = showSidebar !== undefined ? showSidebar : 
    (userType === 'student' && localStorage.getItem('showStudentReportSidebar') !== 'false');

  useEffect(() => {
    // Check for selected session ID first (new system)
    const selectedSessionId = localStorage.getItem('selectedSessionId');
    
    if (selectedSessionId) {
      console.log('Loading session by ID:', selectedSessionId);
      
      // Get evaluation by session ID
      const evaluation = sessionManager.getEvaluation(selectedSessionId);
      if (evaluation) {
        console.log('Found evaluation for session ID:', evaluation);
        
        // Convert to ChatHistory format
        const chatHistoryData: ChatHistory = {
          date: evaluation.date,
          session: evaluation.session,
          room: evaluation.room,
          messages: evaluation.messages
        };
        
        setCurrentSession(chatHistoryData);
        
        // Also add to chat history list
        setChatHistory([chatHistoryData]);
        
        // Clear the selected session ID
        localStorage.removeItem('selectedSessionId');
        return;
      }
    }
    
    // Fallback to legacy system
    const selectedSession = localStorage.getItem('selectedSessionForReport');
    console.log('=== Checking for selected session (legacy) ===');
    console.log('selectedSessionForReport in localStorage:', selectedSession);
    
    if (selectedSession) {
      try {
        const sessionData = JSON.parse(selectedSession);
        console.log('Selected session data:', sessionData);
        
        // Validate session data
        if (!sessionData || !sessionData.date || !sessionData.session || !sessionData.room) {
          console.error('Invalid session data:', sessionData);
          setCurrentSession(null);
          return;
        }
        
        // Try to find the session in localStorage (legacy method)
        const sessionKey = `studentChatHistory_${sessionData.date}_${sessionData.session}_${sessionData.room}`.replace(/[^a-zA-Z0-9_]/g, '_');
        console.log('Looking for session with key:', sessionKey);
        
        const savedSessionData = localStorage.getItem(sessionKey);
        if (savedSessionData) {
          try {
            const currentSessionData = JSON.parse(savedSessionData);
            console.log('Found session in localStorage:', currentSessionData);
            setCurrentSession(currentSessionData);
          } catch (error) {
            console.error('Error parsing selected session data:', error);
          }
        } else {
          console.log('Session not found in localStorage');
          setCurrentSession(null);
        }
        
        // Clear the selected session after using it
        localStorage.removeItem('selectedSessionForReport');
      } catch (error) {
        console.error('Error processing selected session:', error);
        setCurrentSession(null);
      }
    } else {
      // If no specific session selected, load all available sessions
      console.log('No specific session selected, loading all sessions');
      loadAllSessions();
    }
  }, []);

  // Load all sessions from session manager
  const loadAllSessions = () => {
    const allEvaluations = sessionManager.getAllEvaluations();
    const allHistory: ChatHistory[] = [];
    
    console.log('=== Loading all sessions ===');
    console.log('Found evaluations:', allEvaluations.length);
    
    allEvaluations.forEach(evaluation => {
      const chatHistoryData: ChatHistory = {
        date: evaluation.date,
        session: evaluation.session,
        room: evaluation.room,
        messages: evaluation.messages
      };
      allHistory.push(chatHistoryData);
      console.log('Loaded session:', chatHistoryData);
    });
    
    // Sort by date and time (most recent first)
    allHistory.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.session);
      const dateB = new Date(b.date + ' ' + b.session);
      return dateB.getTime() - dateA.getTime();
    });
    
    setChatHistory(allHistory);
    console.log('Total sessions loaded:', allHistory.length);
  };

  // Clear the sidebar flag after using it
  useEffect(() => {
    if (localStorage.getItem('showStudentReportSidebar')) {
      localStorage.removeItem('showStudentReportSidebar');
    }
  }, []);

  // Only auto-select first session if no specific session was passed and we're in development/testing mode
  useEffect(() => {
    if (chatHistory.length > 0 && !currentSession && import.meta.env.DEV) {
      console.log('Development mode: Auto-selecting first available session:', chatHistory[0]);
      setCurrentSession(chatHistory[0]);
    }
  }, [chatHistory, currentSession]);

  // Debug: Log current session state
  useEffect(() => {
    console.log('Current session state:', currentSession);
    console.log('Chat history length:', chatHistory.length);
  }, [currentSession, chatHistory]);

  // Live update: poll for latest evaluation every 2 seconds
  useEffect(() => {
    let sessionId = localStorage.getItem('selectedSessionId');
    if (!sessionId && currentSession) {
      // Try to infer sessionId from currentSession (if available)
      const allEvaluations = sessionManager.getAllEvaluations();
      const found = allEvaluations.find(e =>
        e.date === currentSession.date &&
        e.session === currentSession.session &&
        e.room === currentSession.room
      );
      if (found) sessionId = found.sessionId;
    }
    if (!sessionId) return;
    const interval = setInterval(() => {
      const evaluation = sessionManager.getEvaluation(sessionId!);
      if (evaluation) {
        setCurrentSession({
          date: evaluation.date,
          session: evaluation.session,
          room: evaluation.room,
          messages: evaluation.messages
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currentSession]);

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
              {(currentSession || chatHistory.length > 0) && (
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-sm p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {currentSession ? 'Session Details' : 'Available Sessions'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentSession 
                          ? `Date: ${currentSession.date} | Session: ${currentSession.session} | Room: ${currentSession.room}`
                          : `${chatHistory.length} session(s) available`
                        }
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
                                              {(() => {
                          const sessionToShow = currentSession;
                          if (!sessionToShow) return null;
                          return (
                          <>
                            <div className="flex justify-between items-center mb-6 ">
                              <div>
                                <h2 className="text-2xl  font-bold text-blue-700 mb-2">AI Assistant Chat Report</h2>
                                <p className="text-gray-600">
                                  Date: {sessionToShow.date} | Session: {sessionToShow.session} | Room: {sessionToShow.room}
                                </p>
                              </div>
                              <button
                                onClick={generatePDF}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 shadow-2x;"
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
                                  {sessionToShow.messages.length > 0 ? calculateAccuracy(sessionToShow.messages) : '0'}%
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 text-center">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Score</h3>
                                <div className="text-3xl font-bold text-green-700">
                                  {sessionToShow.messages.length > 0 ? calculateScore(sessionToShow.messages) : '0'}/10
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 text-center">
                                <h3 className="text-lg font-semibold text-purple-800 mb-2">Questions</h3>
                                <div className="text-3xl font-bold text-purple-700">{sessionToShow.messages.filter(m => m.role === 'user').length}</div>
                              </div>
                            </div>

                            {/* AI Feedback Section */}
                            <div className="bg-blue-50 rounded-xl p-6 mb-6">
                              <h3 className="text-xl font-bold text-blue-700 mb-4">AI Feedback Summary</h3>
                              <div className="space-y-3">
                                {generateSpecificFeedback(sessionToShow.messages).map((feedback, index) => (
                                  <div key={index} className="flex items-start gap-3">
                                    <span className="text-lg">{feedback.emoji}</span>
                                    <p className="text-gray-700">{feedback.text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      })()}

                     
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        {!currentSession ? 'No Session Selected' : 'No Report Data Available'}
                      </h3>
                      <p className="text-gray-500">
                        {!currentSession 
                          ? 'Please select a specific session from the sessions page to view its report. Click "View" on a session to see its data.'
                          : 'This session does not have any report data available. Start a conversation with the AI Assistant to generate a report.'
                        }
                      </p>
                      {!currentSession && chatHistory.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 mb-2">Available sessions in localStorage:</p>
                          <div className="space-y-2">
                            {chatHistory.slice(0, 3).map((session, index) => (
                              <div key={index} className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                                {session.date} - {session.session} - {session.room} ({session.messages.length} messages)
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* History Tab */
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">Chat History</h2>
                    
                    {currentSession && currentSession.messages.length > 0 ? (
                      <div className="space-y-6">
                        {(() => {
                          const sessionToShow = currentSession;
                          if (!sessionToShow) return null;
                          return (
                            <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    Session: {sessionToShow.session} | Room: {sessionToShow.room}
                                  </h3>
                                  <p className="text-sm text-gray-600">Date: {sessionToShow.date}</p>
                                </div>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  {sessionToShow.messages.length} messages
                                </span>
                              </div>
                              
                              {/* Full Chat Conversation */}
                              <div className="space-y-10 max-h-125 overflow-y-auto">
                                {sessionToShow.messages.map((message, msgIndex) => (
                                  <div
                                    key={msgIndex}
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
                                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                                    </div>
                                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{message.content}</p>
                                    {message.role === 'user' && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {(() => {
                                          // Support legacy messages without inputMode
                                          const inputMode = (message as any).inputMode;
                                          let label = 'Text';
                                          if (inputMode) {
                                            label = inputMode.charAt(0).toUpperCase() + inputMode.slice(1);
                                          } else if ((message as any).file) {
                                            // If file exists, guess type
                                            label = (message as any).file.type && (message as any).file.type.startsWith('image/') ? 'Image' : 'File';
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
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          {!currentSession ? 'No Session Selected' : 'No Chat History Available'}
                        </h3>
                        <p className="text-gray-500">
                          {!currentSession 
                            ? 'Please select a specific session from the sessions page to view its chat history. Click "View" on a session to see its data.'
                            : 'This session does not have any chat history available. Start a conversation with the AI Assistant to see chat history.'
                          }
                        </p>
                        {!currentSession && chatHistory.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">Available sessions:</p>
                            <div className="space-y-2">
                              {chatHistory.slice(0, 3).map((session, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                                  {session.date} - {session.session} - {session.room} ({session.messages.length} messages)
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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