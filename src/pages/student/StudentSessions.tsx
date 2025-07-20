import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, BookOpen, Star, TrendingUp } from 'lucide-react';

const StudentSessions = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [filterSubject, setFilterSubject] = useState('all');

  const sessions = [
    { id: 1, date: '2025-07-15', time: '6:00 AM - 9:00 AM', room: 'Room 1', subject: 'Mathematics', status: 'upcoming', progress: 85, instructor: 'Dr. Smith' },
    { id: 2, date: '2025-07-16', time: '10:00 AM - 1:00 PM', room: 'Room 2', subject: 'Science', status: 'completed', progress: 92, instructor: 'Prof. Johnson' },
    { id: 3, date: '2025-07-17', time: '2:00 PM - 5:00 PM', room: 'Room 1', subject: 'English', status: 'upcoming', progress: 78, instructor: 'Ms. Davis' },
    { id: 4, date: '2025-07-18', time: '9:00 AM - 12:00 PM', room: 'Room 3', subject: 'History', status: 'upcoming', progress: 88, instructor: 'Dr. Wilson' },
    { id: 5, date: '2025-07-22', time: '6:00 AM - 9:00 AM', room: 'Room 1', subject: 'Mathematics', status: 'scheduled', progress: 85, instructor: 'Dr. Smith' },
    { id: 6, date: '2025-07-20', time: '11:00 AM - 2:00 PM', room: 'Room 4', subject: 'Science', status: 'upcoming', progress: 90, instructor: 'Prof. Johnson' },
    { id: 7, date: '2025-07-25', time: '3:00 PM - 6:00 PM', room: 'Room 2', subject: 'English', status: 'scheduled', progress: 82, instructor: 'Ms. Davis' },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const subjects = ['all', ...new Set(sessions.map(s => s.subject))];

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-400 to-green-600 shadow-lg shadow-green-400/30';
      case 'upcoming': return 'bg-blue-600 shadow-lg shadow-blue-400/30';
      case 'scheduled': return 'bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg shadow-orange-400/30';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600 shadow-lg shadow-gray-400/30';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics': return '🧮';
      case 'science': return '🔬';
      case 'english': return '📚';
      case 'history': return '🏛️';
      default: return '📖';
    }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(session => session.date === dateStr);
  };

  const filteredSessions = filterSubject === 'all' 
    ? sessions 
    : sessions.filter(session => session.subject === filterSubject);

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">
              Learning Dashboard
            </h1>
            <p className="text-blue-700">Manage your study sessions and track progress</p>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-xl shadow-blue-200/40 flex items-center gap-3 flex-1 lg:flex-initial">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg shadow-lg shadow-green-400/30">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Progress</p>
                <p className="text-xl font-bold text-blue-900">86%</p>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-xl shadow-blue-200/40 flex items-center gap-3 flex-1 lg:flex-initial">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg shadow-lg shadow-yellow-400/30">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Streak</p>
                <p className="text-xl font-bold text-blue-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/70 backdrop-blur-lg text-blue-700 hover:bg-white/90 shadow-lg shadow-blue-200/30'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/70 backdrop-blur-lg text-blue-700 hover:bg-white/90 shadow-lg shadow-blue-200/30'
              }`}
            >
              List View
            </button>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/70 backdrop-blur-lg text-blue-700 shadow-lg shadow-blue-200/30 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              style={{
                backgroundImage: 'none',
                appearance: 'none'
              }}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject} className="bg-white text-blue-700">
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Calendar Section */}
          <div className="xl:col-span-2">
            {viewMode === 'calendar' ? (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl shadow-blue-200/40">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-blue-100/70 rounded-lg transition-all duration-300 shadow-lg shadow-blue-200/30"
                  >
                    <ChevronLeft className="w-5 h-5 text-blue-700" />
                  </button>
                  <h2 className="text-xl font-semibold text-blue-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-blue-100/70 rounded-lg transition-all duration-300 shadow-lg shadow-blue-200/30"
                  >
                    <ChevronRight className="w-5 h-5 text-blue-700" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 mb-4">
                    {dayNames.map(day => (
                      <div key={day} className="text-center text-sm font-medium text-blue-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {getCalendarDays().map((day, index) => {
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                      const isToday = day.toDateString() === new Date().toDateString();
                      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                      const daysSessions = getSessionsForDate(day);
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(day)}
                          className={`relative p-2 h-20 rounded-lg hover:scale-105 transition-all duration-300 ${
                            !isCurrentMonth ? 'text-blue-300 bg-blue-50/50' : 'text-blue-900 bg-white/50 shadow-lg backdrop-blur-sm'
                          } ${
                            isToday ? 'bg-gradient-to-br from-blue-200/70 to-blue-300/70 shadow-xl shadow-blue-300/20' : ''
                          } ${
                            isSelected ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/40 scale-105' : ''
                          }`}
                        >
                          <span className="text-sm font-medium">{day.getDate()}</span>
                          
                          {/* Session Indicators */}
                          {daysSessions.length > 0 && (
                            <div className="absolute bottom-1 left-1 right-1">
                              <div className="flex gap-1 justify-center">
                                {daysSessions.slice(0, 3).map((session, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full ${getStatusColor(session.status)} ${
                                      isSelected ? 'opacity-80' : ''
                                    }`}
                                  />
                                ))}
                                {daysSessions.length > 3 && (
                                  <span className="text-xs">+{daysSessions.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="bg-white/70 backdrop-blur-lg rounded-xl shadow-xl shadow-blue-200/40 p-6 hover:scale-105 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{getSubjectIcon(session.subject)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900">{session.subject}</h3>
                            <p className="text-sm text-blue-600">with {session.instructor}</p>
                          </div>
                          <div className={`w-3 h-3 ${getStatusColor(session.status)} rounded-full ml-auto`}></div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-blue-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(session.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {session.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {session.room}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-blue-600">Progress</span>
                            <span className="text-sm font-medium text-blue-900">{session.progress}%</span>
                          </div>
                          <div className="w-full bg-blue-100/60 rounded-full h-2 shadow-inner">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500 shadow-lg"
                              style={{ width: `${session.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex-1 sm:flex-initial shadow-lg shadow-blue-500/30 hover:scale-105">
                        View Details
                      </button>
                      <button className="bg-white/70 backdrop-blur-lg hover:bg-white/90 text-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-200/30 hover:scale-105">
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Selected Date Sessions */}
            {selectedDate && (
              <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-xl shadow-blue-200/40 p-6">
                <h3 className="font-semibold text-blue-900 mb-4">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                {selectedDateSessions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateSessions.map((session) => (
                      <div key={session.id} className="flex items-center gap-3 p-3 bg-blue-50/70 rounded-lg shadow-lg backdrop-blur-sm hover:bg-blue-100/70 transition-all duration-300">
                        <span className="text-xl">{getSubjectIcon(session.subject)}</span>
                        <div className="flex-1">
                          <p className="font-medium text-blue-900 text-sm">{session.subject}</p>
                          <p className="text-xs text-blue-600">{session.time}</p>
                        </div>
                        <div className={`w-2 h-2 ${getStatusColor(session.status)} rounded-full`}></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-600 text-sm">No sessions scheduled</p>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-xl shadow-blue-200/40 p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:scale-105">
                  Schedule New Session
                </button>
                <button className="w-full bg-white/70 backdrop-blur-lg hover:bg-white/90 text-blue-700 px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-200/30 hover:scale-105">
                  View All Reports
                </button>
                <button className="w-full bg-white/70 backdrop-blur-lg hover:bg-white/90 text-blue-700 px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-200/30 hover:scale-105">
                  Export Calendar
                </button>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-xl shadow-blue-200/40 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-blue-900">Next Sessions</h3>
              </div>
              <div className="space-y-3">
                {sessions
                  .filter(s => s.status === 'upcoming')
                  .slice(0, 3)
                  .map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/70 transition-all duration-300">
                    <span className="text-lg">{getSubjectIcon(session.subject)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 text-sm">{session.subject}</p>
                      <p className="text-xs text-blue-600">
                        {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {session.time.split(' - ')[0]}
                      </p>
                    </div>
                    <button className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSessions;