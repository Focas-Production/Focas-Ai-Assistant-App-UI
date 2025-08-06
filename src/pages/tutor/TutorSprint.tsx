
import { useState, useEffect } from 'react';
import Pagination from '../../components/common/Pagination';
import { sessionManager } from '../../utils/sessionManager';

interface SprintData {
  id: number;
  name: string;
  topic: string;
  timer: {
    isRunning: boolean;
    time: number;
    startTime: number | null;
    duration: number; // in minutes
  };
  feedback: string;
  status: string;
}

interface SessionStudent {
  id: number;
  name: string;
  subject: string;
  chapter: string;
  session: string;
  room: string;
  date: string;
}

const TutorSprint = () => {
  const [sessionStudents, setSessionStudents] = useState<SessionStudent[]>([]);
  const [sprints, setSprints] = useState<SprintData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const TOPIC_OPTIONS = ["Company Accounts", "Profit and Loss", "Accouting standards"];
  const STATUS_OPTIONS = ["pending", "completed", "come to live"];

  // Check if current time falls within a session time slot
  const isCurrentTimeAndDateInSession = (sessionTime: string, sessionDate: string): boolean => {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-GB');
    
    // Check if date matches
    if (currentDate !== sessionDate) {
      return false;
    }
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes
    
    // Parse session time
    const timeMatch = sessionTime.match(/(\d+)(?::\d+)?\s*(am|pm)\s*-\s*(\d+)(?::\d+)?\s*(am|pm)/i);
    if (!timeMatch) return false;
    
    const startHour = parseInt(timeMatch[1]);
    const startPeriod = timeMatch[2].toLowerCase();
    const endHour = parseInt(timeMatch[3]);
    const endPeriod = timeMatch[4].toLowerCase();
    
    // Convert to 24-hour format
    const startTime24 = startPeriod === 'pm' && startHour !== 12 ? startHour + 12 : startHour;
    const endTime24 = endPeriod === 'pm' && endHour !== 12 ? endHour + 12 : endHour;
    
    const sessionStartMinutes = startTime24 * 60;
    const sessionEndMinutes = endTime24 * 60;
    
    return currentTime >= sessionStartMinutes && currentTime <= sessionEndMinutes;
  };

  // Load students from localStorage and filter by current session time
  useEffect(() => {
    // First try to get students from session manager
    const allSessions = sessionManager.getAllSessions();
    
    if (allSessions.length > 0) {
      // Filter sessions based on current time and date
      const currentSessions = allSessions.filter(session => 
        isCurrentTimeAndDateInSession(session.session, session.date)
      );
      
      // Convert to SessionStudent format
      const currentStudents: SessionStudent[] = currentSessions.map(session => ({
        id: parseInt(session.sessionId.split('_')[1]), // Use timestamp part as ID
        name: session.studentName,
        subject: session.subject,
        chapter: session.chapter,
        session: session.session,
        room: session.room,
        date: session.date
      }));
      
      setSessionStudents(currentStudents);
      
      // Initialize sprints for current students
      const initialSprints = currentStudents.map(student => ({
        id: student.id,
        name: student.name,
        topic: "Topic 1",
        timer: { isRunning: false, time: 0, startTime: null, duration: 5 },
        feedback: "Session in progress",
        status: "pending"
      }));
      
      setSprints(initialSprints);
    } else {
      // Fallback to legacy session students data
      const students = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
      
      // Filter students based on current time and date matching their session
      const filteredStudents = students.filter((student: SessionStudent) => {
        return isCurrentTimeAndDateInSession(student.session, student.date);
      });
      
      setSessionStudents(filteredStudents);
      
      // Initialize sprints only for students in current session time
      const initialSprints = filteredStudents.map((student: SessionStudent) => ({
        id: student.id,
        name: student.name,
        topic: "Topic 1",
        timer: { isRunning: false, time: 0, startTime: null, duration: 5 },
        feedback: "Session in progress",
        status: "pending"
      }));
      
      setSprints(initialSprints);
    }
  }, []);

  // Timer functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setSprints(prevSprints => 
        prevSprints.map(sprint => {
          if (sprint.timer.isRunning && sprint.timer.startTime) {
            const elapsed = Math.floor((Date.now() - sprint.timer.startTime) / 1000);
            const maxTime = sprint.timer.duration * 60; // Convert minutes to seconds
            
            // Stop timer if it reaches the set duration
            if (elapsed >= maxTime) {
              return {
                ...sprint,
                timer: {
                  ...sprint.timer,
                  isRunning: false,
                  startTime: null,
                  time: maxTime
                }
              };
            }
            
            return {
              ...sprint,
              timer: {
                ...sprint.timer,
                time: elapsed
              }
            };
          }
          return sprint;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save sprint data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sprintData', JSON.stringify(sprints));
  }, [sprints]);

  // Load AI scores from session manager and update feedback
  useEffect(() => {
    const updateScores = () => {
      // Get all evaluations from session manager
      const allEvaluations = sessionManager.getAllEvaluations();
      console.log('Loading evaluations from session manager:', allEvaluations);
      
      setSprints(prevSprints => 
        prevSprints.map(sprint => {
          // Find evaluations for this student
          const studentEvaluations = allEvaluations.filter(evaluation => 
            evaluation.studentName === sprint.name
          );
          console.log(`Evaluations for student ${sprint.name}:`, studentEvaluations);
          
          if (studentEvaluations.length > 0) {
            // Get the most recent evaluation
            const latestEvaluation = studentEvaluations.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )[0];
            
            console.log(`Latest evaluation for ${sprint.name}:`, latestEvaluation);
            
            return {
              ...sprint,
              feedback: `Score: ${latestEvaluation.score}/10`
            };
          }
          
          return sprint;
        })
      );
    };

    // Initial load
    updateScores();

    // Set up interval to check for updates every 2 seconds
    const interval = setInterval(updateScores, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleTimerToggle = (id: number) => {
    setSprints(prevSprints =>
      prevSprints.map(sprint => {
        if (sprint.id === id) {
          if (sprint.timer.isRunning) {
            // Stop timer
            return {
              ...sprint,
              timer: {
                ...sprint.timer,
                isRunning: false,
                startTime: null
              }
            };
          } else {
            // Start timer
            return {
              ...sprint,
              timer: {
                ...sprint.timer,
                isRunning: true,
                startTime: Date.now(),
                time: 0 // Reset time when starting
              }
            };
          }
        }
        return sprint;
      })
    );
  };

  const handleTimerDurationChange = (id: number, duration: number) => {
    setSprints(prevSprints =>
      prevSprints.map(sprint => {
        if (sprint.id === id) {
          return {
            ...sprint,
            timer: {
              ...sprint.timer,
              duration: duration,
              time: 0, // Reset time when changing duration
              isRunning: false,
              startTime: null
            }
          };
        }
        return sprint;
      })
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTopicChange = (id: number, newTopic: string) => {
    setSprints(prevSprints =>
      prevSprints.map(sprint =>
        sprint.id === id ? { ...sprint, topic: newTopic } : sprint
      )
    );
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setSprints(prevSprints =>
      prevSprints.map(sprint =>
        sprint.id === id ? { ...sprint, status: newStatus } : sprint
      )
  );
  };

  // Get current session time and date for display
  const getCurrentSessionInfo = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const currentDate = now.toLocaleDateString('en-GB');

    const sessionRanges: { [key: string]: { start: number; end: number } } = {
      '6am - 9am': { start: 6 * 60, end: 9 * 60 },
      '10am - 1pm': { start: 10 * 60, end: 13 * 60 },
      '2pm - 5pm': { start: 14 * 60, end: 17 * 60 },
      '7pm - 10pm': { start: 19 * 60, end: 22 * 60 },
    };

    for (const [session, range] of Object.entries(sessionRanges)) {
      if (currentTimeInMinutes >= range.start && currentTimeInMinutes <= range.end) {
        return { session, date: currentDate };
      }
    }
    return { session: 'No active session', date: currentDate };
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Tutor Sprint Management</h1>
          <p className="text-slate-600">Current Session: <span className="font-semibold text-blue-600">{getCurrentSessionInfo().session}</span> | Date: <span className="font-semibold text-blue-600">{getCurrentSessionInfo().date}</span></p>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
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
                  <tr 
                    key={sprint.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index === sprints.length - 1 ? '' : 'border-b border-gray-200'}`}
                  >
                    <td className="w-1/5 text-center px-6 py-4 text-lg text-gray-900 font-medium">
                      {sprint.name}
                    </td>
                    <td className="w-1/5 text-center px-6 py-4">
  <div className="inline-flex items-center justify-center gap-1">
    <span className="text-gray-900 font-medium"></span>
    <select
      value={sprint.topic}
      onChange={(e) => handleTopicChange(sprint.id, e.target.value)}
      className="px-5 py-1  rounded focus:outline-none text-lg"
      style={{ minWidth: 0 }}
    >
      {TOPIC_OPTIONS.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
</td>
                    <td className="w-1/5 text-center px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <input
                          type="number"
                          min="1"
                          value={sprint.timer.duration}
                          onChange={(e) => handleTimerDurationChange(sprint.id, parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2 text-center focus:outline-none  text-lg"
                          disabled={sprint.timer.isRunning}
                          placeholder="mins"
                        />
                        <span className="text-lg text-gray-500">mins</span>
                        <span className="text-lg font-mono text-gray-700 min-w-[60px]">
                          {formatTime(sprint.timer.time)}
                        </span>
                        <button
                          onClick={() => handleTimerToggle(sprint.id)}
                          className={`p-2 transition-colors ${sprint.timer.isRunning ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                          title={sprint.timer.isRunning ? 'Stop' : 'Start'}
                        >
                          {sprint.timer.isRunning ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                              <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="w-1/5 text-center px-6 py-4 text-lg text-gray-700">
                      {sprint.feedback}
                    </td>
                    <td className="w-1/5 text-center px-6 py-4">
                    <div className="inline-flex items-center justify-center gap-1">
  <select
    value={sprint.status}
    onChange={(e) => handleStatusChange(sprint.id, e.target.value)}
    className="px-1 py-1  rounded focus:outline-none text-lg"
    style={{ minWidth: 0 }}
  >
    {STATUS_OPTIONS.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
</div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </div>

        {sprints.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No students in current session</h3>
            <p className="text-gray-600">Students will appear here only during their allocated session time and date.</p>
            <p className="text-gray-500 mt-2">Current time: {new Date().toLocaleTimeString()} | Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSprint;