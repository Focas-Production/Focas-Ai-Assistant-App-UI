import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface SessionStudent {
  id: number;
  name: string;
  phoneNumber?: string;
  subject: string;
  chapter: string;
  session: string;
  room: string;
  date: string;
}

interface Session {
  id: number;
  date: string;
  session: string;
  room: string;
}

const TutorSessionview = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [matchingStudents, setMatchingStudents] = useState<SessionStudent[]>([]);

  useEffect(() => {
    // Get session details from tutorSessions localStorage
    const tutorSessions = JSON.parse(localStorage.getItem('tutorSessions') || '[]');
    if (sessionId) {
      const selectedSession = tutorSessions.find((s: Session) => s.id === parseInt(sessionId));
      setSession(selectedSession || null);
    }
  }, [sessionId]);

  useEffect(() => {
    // Get students who have chosen the same session and room
    if (session) {
      const sessionStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
      
      const students = sessionStudents.filter((student: SessionStudent) => 
        student.session === session.session && student.room === session.room
      );
      
      setMatchingStudents(students);
    }
  }, [session]);

  const handleBack = () => {
    // Check navigation source
    const navigationSource = localStorage.getItem('sessionViewNavigationSource');
    if (navigationSource === 'admin') {
      // If we're in admin route, go back to admin
      window.history.back();
      localStorage.removeItem('sessionViewNavigationSource');
    } else {
      navigate('/tutor');
      localStorage.removeItem('sessionViewNavigationSource');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500">Session not found</div>
        </div>
      </div>
    );
  }

  const uniqueStudents = [];
  const seen = new Set();
  for (const s of matchingStudents) {
    const key = `${s.name}-${s.phoneNumber}`;
    if (!seen.has(key)) {
      uniqueStudents.push(s);
      seen.add(key);
    }
  }
  // Use uniqueStudents for rendering

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Arrow
        <button 
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-lg border border-white/20 rounded-full p-3 shadow-lg hover:bg-white/90 transition-all duration-200"
          aria-label="Back to Sessions"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button> */}

        {/* Session Info */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-gray-600 font-medium">Date:</label>
              <p className="text-gray-800 font-semibold">{session.date}</p>
            </div>
            <div>
              <label className="text-gray-600 font-medium">Session:</label>
              <p className="text-gray-800 font-semibold">{session.session}</p>
            </div>
            <div>
              <label className="text-gray-600 font-medium">Room:</label>
              <p className="text-gray-800 font-semibold">{session.room}</p>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100">
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Name</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Phone Number</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {uniqueStudents.length > 0 ? (
                  uniqueStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`${index < uniqueStudents.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200 cursor-pointer bg-white`}
                    >
                      <td className="py-4 px-4 text-gray-800 font-medium">{student.name}</td>
                      <td className="py-4 px-4 text-gray-700">{student.phoneNumber || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => {
                            // Store the selected session data for the report page
                            localStorage.setItem('selectedSessionForReport', JSON.stringify({
                              date: session.date,
                              session: session.session,
                              room: session.room,
                              studentName: student.name,
                              studentPhone: student.phoneNumber
                            }));
                            
                            // Since we're in TutorSessionview, we're in tutor context
                            // Set navigation source for tutor
                            localStorage.setItem('reportNavigationSource', 'tutor');
                            navigate('/tutor/student-report');
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 px-4 text-center text-gray-500">
                      No students found for this session.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TutorSessionview;
