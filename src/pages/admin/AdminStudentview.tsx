import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface SessionStudent {
  id: number;
  name: string;
  subject: string;
  chapter: string;
  session: string;
  room: string;
  date: string;
}

interface Person {
  id: number;
  name: string;
  phoneNumber: string;
  role: string;
}

interface AdminStudentviewProps {
  setActiveLink: (link: string) => void;
}

const AdminStudentview = ({ setActiveLink }: AdminStudentviewProps) => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Person | null>(null);
  const [sessions, setSessions] = useState<SessionStudent[]>([]);

  useEffect(() => {
    // Get student details from adminPeopleData
    const adminPeopleData = localStorage.getItem('adminPeopleData');
    if (adminPeopleData && studentId) {
      const allPeople: Person[] = JSON.parse(adminPeopleData);
      const selectedStudent = allPeople.find(person => person.id === parseInt(studentId));
      setStudent(selectedStudent || null);
    }
  }, [studentId]);

  useEffect(() => {
    // Get session data for this specific student
    if (student) {
      const sessionStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
      if (sessionStudents.length > 0) {
        const studentSessions = sessionStudents.filter((session: SessionStudent) => 
          session.name.toLowerCase() === student.name.toLowerCase()
        );
        setSessions(studentSessions);
      }
    }
  }, [student]);

  const handleBack = () => {
    setActiveLink('Students');
    navigate('/admin');
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500">Student not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Arrow
        <button 
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-lg border border-white/20 rounded-full p-3 shadow-lg hover:bg-white/90 transition-all duration-200"
          aria-label="Back to Students"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button> */}

        {/* Student Info */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 font-medium">Name:</label>
              <p className="text-gray-800 font-semibold">{student.name}</p>
            </div>
            <div>
              <label className="text-gray-600 font-medium">Phone Number:</label>
              <p className="text-gray-800 font-semibold">{student.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100">
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Date</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Session</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Room</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length > 0 ? (
                  sessions.map((session, index) => (
                    <tr 
                      key={session.id} 
                      className={`${index < sessions.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200 cursor-pointer bg-white`}
                    >
                      <td className="py-4 px-4 text-gray-800 font-medium">{session.date}</td>
                      <td className="py-4 px-4 text-gray-700">{session.session}</td>
                      <td className="py-4 px-4 text-gray-700">{session.room}</td>
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
                            // Set navigation source for admin
                            localStorage.setItem('reportNavigationSource', 'admin');
                            navigate('/admin/student-report');
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
                    <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                      No session data found for this student.
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

export default AdminStudentview;
