import { useState } from 'react';
import { CalendarDays, PlusCircle, MapPin, Users, Clock, ChevronRight, Filter, Star, TrendingUp } from 'lucide-react';

const SprintsComponent = () => {
  const [sprints] = useState([
    { id: 1, topic: "Algebra Basics", venue: "Room 201", date: "2025-07-22", students: 25, time: "10:00 AM", status: "upcoming", category: "Mathematics", difficulty: "Beginner" },
    { id: 2, topic: "Business Ethics", venue: "Auditorium", date: "2025-07-23", students: 40, time: "2:00 PM", status: "upcoming", category: "Business", difficulty: "Intermediate" },
    { id: 3, topic: "AI Fundamentals", venue: "Lab 3", date: "2025-07-24", students: 18, time: "11:30 AM", status: "upcoming", category: "Technology", difficulty: "Advanced" },
    { id: 4, topic: "Microeconomics", venue: "Room 104", date: "2025-07-25", students: 30, time: "3:15 PM", status: "upcoming", category: "Economics", difficulty: "Intermediate" },
    { id: 5, topic: "English Grammar", venue: "Room 105", date: "2025-07-26", students: 22, time: "9:00 AM", status: "upcoming", category: "Language", difficulty: "Beginner" }
  ]);

  const [filter, setFilter] = useState('all');


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mathematics': return '🔢';
      case 'Business': return '💼';
      case 'Technology': return '💻';
      case 'Economics': return '📊';
      case 'Language': return '📚';
      default: return '📖';
    }
  };

  const filteredSprints = sprints.filter(sprint =>
    filter === 'all' || sprint.status === filter
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Analytics Dashboard */}
        {filteredSprints.length > 0 && (
          <div className="mb-8 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-bold text-slate-800">Analytics Dashboard</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-lg">
                  <div className="text-2xl font-bold text-blue-700 mb-1">{filteredSprints.length}</div>
                  <div className="text-blue-600 font-medium text-sm">Active Sessions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200 shadow-lg">
                  <div className="text-2xl font-bold text-green-700 mb-1">
                    {filteredSprints.reduce((sum, s) => sum + s.students, 0)}
                  </div>
                  <div className="text-green-600 font-medium text-sm">Total Students</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200 shadow-lg">
                  <div className="text-2xl font-bold text-purple-700 mb-1">
                    {Math.round(filteredSprints.reduce((sum, s) => sum + s.students, 0) / filteredSprints.length)}
                  </div>
                  <div className="text-purple-600 font-medium text-sm">Avg per Session</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200 shadow-lg">
                  <div className="text-2xl font-bold text-orange-700 mb-1">
                    {new Set(filteredSprints.map(s => s.venue)).size}
                  </div>
                  <div className="text-orange-600 font-medium text-sm">Unique Venues</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Header with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-700 mb-1">
                  Tutor Sprints Calendar
                </h1>
                <p className="text-slate-600">Plan and manage your tutoring sessions with style</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent border-none cursor-pointer outline-none text-sm font-medium text-slate-700"
                >
                  <option value="all">All Sessions</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold">
            <PlusCircle className="w-5 h-5" />
            Assign New Sprint
          </button>
        </div>

        {/* Enhanced Sprint Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredSprints.map((sprint, index) => (
            <div
              key={sprint.id}
              className="group bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Header */}
              <div className="bg-slate-50 p-4 border-b border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(sprint.category)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-lg`}>
                      {sprint.status.toUpperCase()}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(sprint.difficulty)}`}>
                    {sprint.difficulty}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">
                  {sprint.topic}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{sprint.category}</p>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {new Date(sprint.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{sprint.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{sprint.venue}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{sprint.students} Students</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-100">
                <button className="w-full text-blue-600 cursor-pointer hover:text-blue-700 font-semibold flex items-center justify-center gap-2 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm">
                  View Details
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredSprints.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-xl">
              <CalendarDays className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">No sprints found</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
              {filter === 'all'
                ? "Ready to create your first amazing tutoring session?"
                : `No ${filter} sessions match your current filter.`
              }
            </p>
            {filter === 'all' && (
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold">
                <PlusCircle className="w-5 h-5" />
                Create Your First Sprint
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintsComponent;