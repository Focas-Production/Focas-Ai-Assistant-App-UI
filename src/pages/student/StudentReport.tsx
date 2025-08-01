import { useState, useEffect } from 'react';
import { Download, MessageCircle, FileText, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

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
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(-1);

  // Helper function to generate unique session key
  const generateSessionKey = (date: string, session: string, room: string) => {
    return `studentChatHistory_${date}_${session}_${room}`.replace(/[^a-zA-Z0-9_]/g, '_');
  };

  // Helper function to get all session keys
  const getAllSessionKeys = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('studentChatHistory_')) {
        keys.push(key);
      }
    }
    return keys;
  };

  // Helper function to parse session data from key
  const parseSessionFromKey = (key: string) => {
    const parts = key.replace('studentChatHistory_', '').split('_');
    if (parts.length >= 3) {
      const date = parts[0];
      const session = parts[1];
      const room = parts.slice(2).join('_'); // Room might contain underscores
      return { date, session, room };
    }
    return null;
  };

  // Debug function to list all available sessions
  const debugListAllSessions = () => {
    const sessionKeys = getAllSessionKeys();
    console.log('=== DEBUG: All Available Sessions ===');
    sessionKeys.forEach((key, index) => {
      const sessionData = localStorage.getItem(key);
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          console.log(`${index + 1}. Key: ${key}`);
          console.log(`   Date: ${parsed.date}`);
          console.log(`   Session: ${parsed.session}`);
          console.log(`   Room: ${parsed.room}`);
          console.log(`   Messages: ${parsed.messages?.length || 0}`);
          console.log('---');
        } catch (error) {
          console.error(`Error parsing session ${key}:`, error);
        }
      }
    });
    console.log('=== END DEBUG ===');
  };

  // Test function to create sample sessions for testing
  const createTestSessions = () => {
    const testSessions = [
      {
        date: '2024-01-15',
        session: '9:00 AM - 12:00 PM',
        room: 'Room 101',
        messages: [
          { role: 'user', content: 'What is accounting?', timestamp: '2024-01-15 9:30:00' },
          { role: 'assistant', content: 'Accounting is the process of recording financial transactions...', timestamp: '2024-01-15 9:30:05' }
        ]
      },
      {
        date: '2024-01-16',
        session: '2:00 PM - 5:00 PM',
        room: 'Room 102',
        messages: [
          { role: 'user', content: 'Explain taxation', timestamp: '2024-01-16 2:30:00' },
          { role: 'assistant', content: 'Taxation is the process of collecting taxes...', timestamp: '2024-01-16 2:30:05' }
        ]
      }
    ];

    testSessions.forEach((session, index) => {
      const key = generateSessionKey(session.date, session.session, session.room);
      localStorage.setItem(key, JSON.stringify(session));
      console.log(`Created test session ${index + 1}:`, key);
    });

    // Reload the component
    window.location.reload();
  };

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
    // Load all chat history sessions from localStorage
    const sessionKeys = getAllSessionKeys();
    const allHistory: ChatHistory[] = [];
    
    sessionKeys.forEach(key => {
      const sessionData = localStorage.getItem(key);
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          if (parsedData && parsedData.messages) {
            allHistory.push(parsedData);
          }
        } catch (error) {
          console.error('Error parsing session data:', error);
        }
      }
    });
    
    // Sort by date and time (most recent first)
    allHistory.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.session);
      const dateB = new Date(b.date + ' ' + b.session);
      return dateB.getTime() - dateA.getTime();
    });
    
    setChatHistory(allHistory);
    
    // Debug: List all available sessions
    debugListAllSessions();
    
    // Check if there's a selected session from the sessions page
    const selectedSession = localStorage.getItem('selectedSessionForReport');
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
        
        // Generate the unique key for this session
        const sessionKey = generateSessionKey(sessionData.date, sessionData.session, sessionData.room);
        console.log('Looking for session with key:', sessionKey);
        
        // Try to find the session in localStorage
        const savedSessionData = localStorage.getItem(sessionKey);
        if (savedSessionData) {
          try {
            const currentSessionData = JSON.parse(savedSessionData);
            console.log('Found session in localStorage:', currentSessionData);
            setCurrentSession(currentSessionData);
            // Find the index in chatHistory for the dropdown
            const index = allHistory.findIndex(session => 
              session.date === currentSessionData.date && 
              session.session === currentSessionData.session && 
              session.room === currentSessionData.room
            );
            setSelectedSessionIndex(index);
          } catch (error) {
            console.error('Error parsing selected session data:', error);
          }
        } else {
          console.log('Session not found in localStorage, checking all history...');
          // Fallback: try to find in allHistory with more flexible matching
          const foundSession = allHistory.find((session: ChatHistory) => {
            // Normalize date formats for comparison
            const normalizeDate = (dateStr: string | undefined) => {
              // Handle undefined or null values
              if (!dateStr) return '';
              
              // Handle different date formats (DD/MM/YYYY, YYYY-MM-DD, etc.)
              if (dateStr.includes('/')) {
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                  // Convert DD/MM/YYYY to YYYY-MM-DD
                  return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
              }
              return dateStr;
            };
            
            const normalizedSessionDate = normalizeDate(session.date);
            const normalizedSelectedDate = normalizeDate(sessionData.date);
            
            const dateMatch = normalizedSessionDate === normalizedSelectedDate;
            const sessionMatch = session.session === sessionData.session;
            const roomMatch = session.room === sessionData.room;
            
            // Additional safety checks
            if (!session.date || !sessionData.date) {
              console.log('Missing date in session data:', { session, sessionData });
              return false;
            }
            
            console.log('Matching session:', {
              sessionDate: session.date,
              normalizedSessionDate,
              selectedDate: sessionData.date,
              normalizedSelectedDate,
              dateMatch,
              sessionTime: session.session,
              selectedTime: sessionData.session,
              sessionMatch,
              sessionRoom: session.room,
              selectedRoom: sessionData.room,
              roomMatch
            });
            
            return dateMatch && sessionMatch && roomMatch;
          });
          
          console.log('Found session in history:', foundSession);
          setCurrentSession(foundSession || null);
          if (foundSession) {
            // Find the index in chatHistory for the dropdown
            const index = allHistory.findIndex(session => 
              session.date === foundSession.date && 
              session.session === foundSession.session && 
              session.room === foundSession.room
            );
            setSelectedSessionIndex(index);
          }
        }
        
        // Clear the selected session after using it
        localStorage.removeItem('selectedSessionForReport');
      } catch (error) {
        console.error('Error processing selected session:', error);
        setCurrentSession(null);
      }
    } else {
      // If no specific session selected, DON'T show any session by default
      // This prevents showing the wrong session
      console.log('No specific session selected, not showing any session by default');
      setCurrentSession(null);
    }
  }, []);

  // Clear the sidebar flag after using it
  useEffect(() => {
    if (localStorage.getItem('showStudentReportSidebar')) {
      localStorage.removeItem('showStudentReportSidebar');
    }
  }, []);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
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

  const handleBackToSessions = () => {
    // Check navigation source
    const navigationSource = localStorage.getItem('reportNavigationSource');
    if (navigationSource === 'tutor') {
      window.location.href = '/tutor';
      localStorage.removeItem('reportNavigationSource');
    } else if (navigationSource === 'admin') {
      // If we're in admin route, go back to admin
      window.history.back();
      localStorage.removeItem('reportNavigationSource');
    } else {
      // For student context, go back to student sessions
      window.history.back();
      localStorage.removeItem('reportNavigationSource');
    }
  };

  const calculateAccuracy = (messages: ChatMessage[]) => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    const aiMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (userMessages.length === 0) return '0';
    
    // Count questions that received detailed responses
    let detailedResponses = 0;
    userMessages.forEach((userMsg, index) => {
      const correspondingAI = aiMessages[index];
      if (correspondingAI && correspondingAI.content.length > 100) {
        detailedResponses++;
      }
    });
    
    return Math.round((detailedResponses / userMessages.length) * 100).toString();
  };

  const calculateScore = (messages: ChatMessage[]) => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    const aiMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (userMessages.length === 0) return '0';
    
    let totalScore = 0;
    userMessages.forEach((userMsg, index) => {
      const correspondingAI = aiMessages[index];
      if (correspondingAI) {
        // Score based on response quality
        if (correspondingAI.content.length > 200) totalScore += 2; // Detailed response
        else if (correspondingAI.content.length > 100) totalScore += 1.5; // Good response
        else totalScore += 1; // Basic response
      }
    });
    
    const averageScore = totalScore / userMessages.length;
    return Math.min(10, Math.round(averageScore * 2)).toString(); // Scale to 10
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
      if (userMsg.content.length > 50) {
        detailedQuestions++;
      } else {
        shortQuestions++;
      }
      
      // Analyze response quality
      if (correspondingAI) {
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
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
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

    // Overall engagement feedback
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
    <div className={`${shouldShowSidebar ? 'flex h-screen' : 'h-full'} bg-gradient-to-br from-gray-100 via-white to-blue-50 font-inter`}>
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
        {/* Back Button - positioned on top of navbar
        <button
          onClick={handleBackToSessions}
          className="absolute top-2 left-4 z-20 bg-white/90 backdrop-blur-lg border border-white/20 rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200"
          aria-label="Back to Sessions"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button> */}
        
        {shouldShowSidebar && <Navbar userType={userType} activeLink={activeLink} />}
        
        <main className="overflow-auto h-full bg-white/60 backdrop-blur-md relative">
          
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Header
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
                <h1 className="text-3xl font-bold text-blue-700 mb-2">Student Report</h1>
                <p className="text-slate-600">View your AI assistant interactions and chat history</p>
              </div> */}

              {/* Session Selector */}
              {chatHistory.length > 0 && (
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Session</h3>
                      <p className="text-sm text-gray-600">Choose which session to view</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={selectedSessionIndex}
                        onChange={(e) => {
                          const index = parseInt(e.target.value);
                          setSelectedSessionIndex(index);
                          if (index >= 0 && index < chatHistory.length) {
                            setCurrentSession(chatHistory[index]);
                          } else {
                            setCurrentSession(null);
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={-1}>Select a session...</option>
                        {chatHistory.map((session, index) => (
                          <option key={index} value={index}>
                            {session.date} - {session.session} - {session.room} ({session.messages.length} messages)
                          </option>
                        ))}
                      </select>
                      
                      {/* Debug button - only show in development */}
                      {import.meta.env.DEV && (
                        <button
                          onClick={createTestSessions}
                          className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg"
                          title="Create test sessions for debugging"
                        >
                          Test Sessions
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden mb-6">
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
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden max-h-[800px] overflow-y-auto">
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
                          <div className="text-3xl font-bold text-purple-700">{currentSession.messages.filter(m => m.role === 'user').length}</div>
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

                      {/* Spoken Chat Summary */}
                      {/* <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Spoken Chat Summary</h3>
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Topics Discussed:</h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              <li>Accounting principles and standards</li>
                              <li>Financial statement analysis</li>
                              <li>Taxation concepts</li>
                              <li>Auditing procedures</li>
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Key Insights:</h4>
                            <p className="text-gray-600">
                              The student demonstrated strong theoretical knowledge but needs more practice with practical applications. 
                              Voice recognition accuracy was good, and the AI provided detailed explanations for complex topics.
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        {chatHistory.length > 0 ? 'No Session Selected' : 'No Chat Report Available'}
                      </h3>
                      <p className="text-gray-500">
                        {chatHistory.length > 0 
                          ? 'Please select a session from the dropdown above to view its report.'
                          : 'Start a conversation with the AI Assistant to generate a report for your current session.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* History Tab */
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">Chat History</h2>
                    
                    {currentSession && currentSession.messages.length > 0 ? (
                      <div className="space-y-6">
                        <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                Session: {currentSession.session} | Room: {currentSession.room}
                              </h3>
                              <p className="text-sm text-gray-600">Date: {currentSession.date}</p>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {currentSession.messages.length} messages
                            </span>
                          </div>
                          
                          {/* Full Chat Conversation */}
                          <div className="space-y-10 max-h-125 overflow-y-auto">
                            {currentSession.messages.map((message, msgIndex) => (
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
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          {chatHistory.length > 0 ? 'No Session Selected' : 'No Chat History'}
                        </h3>
                        <p className="text-gray-500">
                          {chatHistory.length > 0 
                            ? 'Please select a session from the dropdown above to view its chat history.'
                            : (currentSession ? 
                                "No messages found for this session. Start a conversation with the AI Assistant to see chat history." :
                                "Select a session to view its chat history."
                              )
                          }
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