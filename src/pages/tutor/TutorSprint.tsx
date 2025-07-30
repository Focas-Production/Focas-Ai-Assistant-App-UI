
import { useState, useEffect } from 'react';
import Pagination from '../../components/common/Pagination';

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
  const [sprints, setSprints] = useState<SprintData[]>([]);
  const [sessionStudents, setSessionStudents] = useState<SessionStudent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const TOPIC_OPTIONS = ["Topic 1", "Topic 2", "Topic 3"];
  const STATUS_OPTIONS = ["pending", "completed", "come to live"];

  // Load students from localStorage
  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
    setSessionStudents(students);
    
    // Initialize sprints for each student
    const initialSprints = students.map((student: SessionStudent) => ({
      id: student.id,
      name: student.name,
      topic: "Topic 1",
      timer: { isRunning: false, time: 0, startTime: null, duration: 5 },
      feedback: "Session in progress",
      status: "pending"
    }));
    
    setSprints(initialSprints);
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

  // Load AI scores from localStorage and update feedback
  useEffect(() => {
    const updateScores = () => {
      const savedScores = localStorage.getItem('studentScores');
      if (savedScores) {
        const scores = JSON.parse(savedScores);
        console.log('Loading scores from localStorage:', scores);
        
        setSprints(prevSprints => 
          prevSprints.map(sprint => {
            // Find the latest score for this student
            const studentScores = scores.filter((score: any) => score.studentName === sprint.name);
            console.log(`Scores for student ${sprint.name}:`, studentScores);
            
            if (studentScores.length > 0) {
              // Get the most recent score
              const latestScore = studentScores.sort((a: any, b: any) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )[0];
              
              console.log(`Latest score for ${sprint.name}:`, latestScore);
              
              return {
                ...sprint,
                feedback: `Score: ${latestScore.score}/10`
              };
            }
            
            return sprint;
          })
        );
      }
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

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Tutor Sprint Management</h1>
          <p className="text-slate-600">Monitor and manage student sprint sessions</p>
        </div> */}

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Topic</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Timer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Feedback</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {sprints.map((sprint, index) => (
                  <tr 
                    key={sprint.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index === sprints.length - 1 ? '' : 'border-b border-gray-200'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {sprint.name}
                    </td>
                    <td className="px-6 py-4">
                <select
                        value={sprint.topic}
                        onChange={(e) => handleTopicChange(sprint.id, e.target.value)}
                        className="w-full px-2 py-1 focus:outline-none"
                >
                        {TOPIC_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                </select>
                    </td>
                                        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <input
                          type="number"
                          min="1"
                          value={sprint.timer.duration}
                          onChange={(e) => handleTimerDurationChange(sprint.id, parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          disabled={sprint.timer.isRunning}
                          placeholder="mins"
                        />
                        <span className="text-sm text-gray-500">mins</span>
                        <span className="text-sm font-mono text-gray-700 min-w-[60px]">
                          {formatTime(sprint.timer.time)}
                        </span>
                        <button
                          onClick={() => handleTimerToggle(sprint.id)}
                          className={`p-2 transition-colors ${
                            sprint.timer.isRunning
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-green-500 hover:text-green-600'
                          }`}
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
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {sprint.feedback}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={sprint.status}
                        onChange={(e) => handleStatusChange(sprint.id, e.target.value)}
                        className="w-full px-2 py-1 focus:outline-none"
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </div>

        {sprints.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No students allocated yet</h3>
            <p className="text-gray-600">Students will appear here once they complete their allocation and match with tutor sessions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSprint;