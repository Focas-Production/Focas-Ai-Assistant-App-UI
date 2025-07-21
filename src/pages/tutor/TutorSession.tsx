import { useState } from "react";
import { Eye, ClipboardList, BarChart2, PlusCircle, Users, Calendar, Clock, CheckCircle, FileText, Award, TrendingUp, BookOpen, Star, Target, ArrowLeft } from "lucide-react";

const TutorSessions = () => {
  const [sessions, setSessions] = useState([
    { 
      id: 1, 
      topic: "Algebra Basics", 
      date: "2025-07-18", 
      time: "10:00 AM", 
      duration: "2 hours",
      attendees: 20,
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
      students: [
        { id: 1, name: "Alice Johnson", testAssigned: false, report: "Completed", score: 85, attendance: "Present", avatar: "AJ" },
        { id: 2, name: "Bob Smith", testAssigned: true, report: "Pending", score: null, attendance: "Present", avatar: "BS" },
        { id: 3, name: "Eva Brown", testAssigned: false, report: "Completed", score: 92, attendance: "Present", avatar: "EB" },
        { id: 4, name: "David Wilson", testAssigned: true, report: "In Progress", score: null, attendance: "Present", avatar: "DW" },
        { id: 5, name: "Sarah Davis", testAssigned: false, report: "Not Started", score: null, attendance: "Present", avatar: "SD" }
      ]
    },
    { 
      id: 2, 
      topic: "Microeconomics", 
      date: "2025-07-19", 
      time: "2:00 PM", 
      duration: "1.5 hours",
      attendees: 15,
      color: "from-green-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-green-50 to-teal-50",
      students: [
        { id: 6, name: "Mike Johnson", testAssigned: true, report: "Completed", score: 78, attendance: "Present", avatar: "MJ" },
        { id: 7, name: "Lisa Chen", testAssigned: false, report: "Pending", score: null, attendance: "Present", avatar: "LC" },
        { id: 8, name: "Tom Anderson", testAssigned: false, report: "Completed", score: 88, attendance: "Present", avatar: "TA" },
        { id: 9, name: "Emma White", testAssigned: true, report: "In Progress", score: null, attendance: "Present", avatar: "EW" }
      ]
    },
    { 
      id: 3, 
      topic: "AI Fundamentals", 
      date: "2025-07-20", 
      time: "11:00 AM", 
      duration: "3 hours",
      attendees: 18,
      color: "from-orange-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-pink-50",
      students: [
        { id: 10, name: "Alex Turner", testAssigned: false, report: "Completed", score: 95, attendance: "Present", avatar: "AT" },
        { id: 11, name: "Sophie Brown", testAssigned: true, report: "Pending", score: null, attendance: "Present", avatar: "SB" },
        { id: 12, name: "Ryan Clark", testAssigned: false, report: "Not Started", score: null, attendance: "Present", avatar: "RC" },
        { id: 13, name: "Maya Patel", testAssigned: false, report: "Completed", score: 90, attendance: "Present", avatar: "MP" }
      ]
    }
  ]);

  const [activeSession, setActiveSession] = useState(null);
  const [viewMode, setViewMode] = useState('students');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [notification, setNotification] = useState(null);

  const assignTest = (studentId, studentName) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSession.id) {
        const updatedStudents = session.students.map(student => 
          student.id === studentId ? { ...student, testAssigned: true, report: "Pending" } : student
        );
        return { ...session, students: updatedStudents };
      }
      return session;
    });
    
    setSessions(updatedSessions);
    setActiveSession(updatedSessions.find(s => s.id === activeSession.id));
    
    setNotification(`Test assigned to ${studentName}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const viewTest = (studentId) => {
    alert(`Viewing test for student ID: ${studentId}`);
  };

  const getReportStatusStyle = (status) => {
    switch(status) {
      case 'Completed': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-200';
      case 'Pending': return 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-yellow-200';
      case 'In Progress': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200';
      case 'Not Started': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const renderStudentsView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-800">Student Management</h4>
          <p className="text-gray-600">{activeSession.students.length} students attended this session</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {activeSession.students.map((student, index) => (
          <div 
            key={student.id} 
            className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            style={{animationDelay: `${index * 100}ms`}}
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
                    {student.avatar}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h5 className="font-bold text-lg text-gray-800 mb-1">{student.name}</h5>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.testAssigned 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-md'
                    }`}>
                      {student.testAssigned ? '✓ Test Assigned' : '○ No Test'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReportStatusStyle(student.report)}`}>
                      {student.report}
                    </span>
                  </div>
                  
                  {student.score && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className={`px-2 py-1 rounded-lg text-sm font-bold ${getScoreColor(student.score)}`}>
                        {student.score}% Score
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  {!student.testAssigned ? (
                    <button
                      onClick={() => assignTest(student.id, student.name)}
                      className="group/btn bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      aria-label={`Assign test to ${student.name}`}
                    >
                      <PlusCircle className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                      Assign Test
                    </button>
                  ) : (
                    <button 
                      onClick={() => viewTest(student.id)}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      aria-label={`View test for ${student.name}`}
                    >
                      <FileText className="w-4 h-4" />
                      View Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttendanceView = () => {
    const attendanceRate = activeSession.students.length > 0
      ? Math.round((activeSession.students.filter(s => s.attendance === 'Present').length / activeSession.students.length) * 100)
      : 0;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-800">Attendance Analytics</h4>
            <p className="text-gray-600">Comprehensive attendance insights</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 shadow-lg shadow-emerald-100/50">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Present</span>
              </div>
              <div className="text-3xl font-bold text-emerald-700 mb-1">{activeSession.students.filter(s => s.attendance === 'Present').length}</div>
              <div className="text-sm text-emerald-600">Students Attended</div>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/50">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-blue-700 font-medium">Expected</span>
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-1">{activeSession.students.length}</div>
              <div className="text-sm text-blue-600">Total Students</div>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 shadow-lg shadow-amber-100/50">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-amber-600" />
                <span className="text-amber-700 font-medium">Rate</span>
              </div>
              <div className="text-3xl font-bold text-amber-700 mb-1">{attendanceRate}%</div>
              <div className="text-sm text-amber-600">Attendance Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <h5 className="text-lg font-bold text-gray-800">Individual Attendance</h5>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {activeSession.students.map((student, index) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100"
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {student.avatar}
                    </div>
                    <span className="font-semibold text-gray-800">{student.name}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200">
                    <CheckCircle className="w-4 h-4" />
                    Present
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportView = () => {
    const completedTests = activeSession.students.filter(s => s.report === 'Completed' && s.score);
    const averageScore = completedTests.length > 0 
      ? Math.round(completedTests.reduce((sum, s) => sum + s.score, 0) / completedTests.length)
      : 0;
    const testAssigned = activeSession.students.filter(s => s.testAssigned).length;
    const testsCompleted = activeSession.students.filter(s => s.report === 'Completed').length;

    const stats = [
      { label: 'Students', value: activeSession.students.length, icon: Users, color: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50' },
      { label: 'Tests Assigned', value: testAssigned, icon: Target, color: 'from-emerald-500 to-green-600', bg: 'from-emerald-50 to-green-50' },
      { label: 'Completed', value: testsCompleted, icon: CheckCircle, color: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50' },
      { label: 'Avg Score', value: `${averageScore}%`, icon: Award, color: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50' }
    ];

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-800">Performance Analytics</h4>
            <p className="text-gray-600">Detailed session insights and metrics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className={`relative overflow-hidden bg-gradient-to-br ${stat.bg} p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group cursor-pointer`}
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:scale-105 transition-transform duration-300">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-blue-600" />
                <h5 className="text-lg font-bold text-blue-800">Top Performers</h5>
              </div>
            </div>
            <div className="p-6">
              {completedTests.length > 0 ? (
                <div className="space-y-4">
                  {completedTests
                    .sort((a, b) => b.score - a.score)
                    .map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
                            'bg-gradient-to-r from-blue-400 to-indigo-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-semibold text-gray-800">{student.name}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getScoreColor(student.score)}`}>
                          {student.score}%
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No completed tests yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <div className="flex items-center gap-3">
                <BarChart2 className="w-5 h-5 text-purple-600" />
                <h5 className="text-lg font-bold text-purple-800">Progress Overview</h5>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {['Completed', 'Pending', 'In Progress', 'Not Started'].map((status, index) => {
                  const count = activeSession.students.filter(s => s.report === status).length;
                  const percentage = (count / activeSession.students.length) * 100;
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{status}</span>
                        <span className="text-sm font-bold text-gray-600">{count} ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ease-out ${getReportStatusStyle(status)}`}
                          style={{ 
                            width: `${percentage}%`,
                            animationDelay: `${index * 200}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="p-8">
        {notification && (
          <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transform transition-all duration-500 animate-slide-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{notification}</span>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {activeSession && (
              <button 
                onClick={() => setActiveSession(null)}
                className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                aria-label="Back to sessions list"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            )}
            <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl shadow-blue-200">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {activeSession ? activeSession.topic : 'Tutor Sessions'}
              </h1>
              <p className="text-gray-600 text-lg">
                {activeSession ? 'Manage student progress and analytics' : 'Manage your sessions with style and efficiency'}
              </p>
            </div>
          </div>
        </div>

        {activeSession && (
          <div className="flex gap-4 mb-8">
            {['students', 'attendance', 'report'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={`Switch to ${mode} view`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        )}

        {!activeSession ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {sessions.map((session, index) => (
              <div 
                key={session.id}
                className={`group relative overflow-hidden ${session.bgColor} rounded-3xl border border-white/50 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 cursor-pointer`}
                style={{animationDelay: `${index * 200}ms`}}
                onMouseEnter={() => setHoveredCard(session.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {setActiveSession(session); setViewMode('students');}}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && setActiveSession(session)}
                aria-label={`View details for ${session.topic}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${session.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-500`}>
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {session.topic}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{session.time} • {session.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{session.attendees} students attended</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`px-4 py-2 bg-gradient-to-r ${session.color} text-white rounded-xl font-semibold text-sm shadow-lg`}>
                      {session.attendees} Students
                    </div>
                    <div className={`p-3 bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                      hoveredCard === session.id ? 'scale-110 bg-white/30' : ''
                    }`}>
                      <Eye className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {viewMode === 'students' && renderStudentsView()}
            {viewMode === 'attendance' && renderAttendanceView()}
            {viewMode === 'report' && renderReportView()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSessions;