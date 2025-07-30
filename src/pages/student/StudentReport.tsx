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

  // Determine if sidebar should be shown - default to true for student context
  const shouldShowSidebar = showSidebar !== undefined ? showSidebar : 
    localStorage.getItem('showStudentReportSidebar') !== 'false';

  useEffect(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('studentChatHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setChatHistory(history);
      
      // Check if there's a selected session from the sessions page
      const selectedSession = localStorage.getItem('selectedSessionForReport');
      if (selectedSession) {
        const sessionData = JSON.parse(selectedSession);
        console.log('Selected session data:', sessionData);
        console.log('Available chat history sessions:', history);
        
        // Find the specific session in chat history - match by date, session, and room
        const currentSessionData = history.find((session: ChatHistory) => {
          const dateMatch = session.date === sessionData.date;
          const sessionMatch = session.session === sessionData.session;
          const roomMatch = session.room === sessionData.room;
          
          console.log('Matching session:', {
            sessionDate: session.date,
            selectedDate: sessionData.date,
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
        
        console.log('Found session in history:', currentSessionData);
        setCurrentSession(currentSessionData || null);
        
        // Clear the selected session after using it
        localStorage.removeItem('selectedSessionForReport');
      } else {
        // If no specific session selected, show the most recent session
        if (history.length > 0) {
          setCurrentSession(history[history.length - 1]);
        }
      }
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
    localStorage.removeItem('studentAllocationData');
    localStorage.removeItem('studentAllocationCompleted');
    localStorage.removeItem('studentSkipAllocation');
    localStorage.removeItem('studentActiveLink');
    window.location.href = '/login';
  };

  const handleSidebarClick = (link: string) => {
    setActiveLink(link);
    if (link === 'Dashboard') {
      window.location.href = '/student';
    } else if (link === 'AI Assistant') {
      window.location.href = '/student';
    } else if (link === 'Sessions') {
      window.location.href = '/student';
    } else if (link === 'Allocation') {
      window.location.href = '/student';
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
          variant="student" 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          activeLink={activeLink} 
          setActiveLink={handleSidebarClick} 
          onLogout={handleLogout}
        />
      )}
      
      <div className={`flex-1 transition-all duration-500 ${shouldShowSidebar ? (collapsed ? 'ml-20' : 'ml-72') : ''} relative`}>
        {/* Back Button - positioned on top of navbar */}
        <button
          onClick={handleBackToSessions}
          className="absolute top-2 left-4 z-20 bg-white/90 backdrop-blur-lg border border-white/20 rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200"
          aria-label="Back to Sessions"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        {shouldShowSidebar && <Navbar userType="student" activeLink={activeLink} />}
        
        <main className="overflow-auto h-full bg-white/60 backdrop-blur-md relative">
          
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Header
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
                <h1 className="text-3xl font-bold text-blue-700 mb-2">Student Report</h1>
                <p className="text-slate-600">View your AI assistant interactions and chat history</p>
              </div> */}

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
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Chat Report Available</h3>
                      <p className="text-gray-500">
                        Start a conversation with the AI Assistant to generate a report for your current session.
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
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Chat History</h3>
                        <p className="text-gray-500">
                          {currentSession ? 
                            "No messages found for this session. Start a conversation with the AI Assistant to see chat history." :
                            "Select a session to view its chat history."
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