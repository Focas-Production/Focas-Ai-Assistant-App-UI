import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';

interface AllocationData {
  subject: string;
  chapter: string;
  session: string;
  room: string;
  date?: string;
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

const StudentSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionStudent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    // Load ALL session students from localStorage (all students who completed allocation)
    const sessionStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
    console.log('Raw session students from localStorage:', sessionStudents);
    
    if (sessionStudents.length > 0) {
      // Remove duplicates based on date, session, and room combination
      const uniqueSessions = new Map();
      
      sessionStudents.forEach((student: SessionStudent) => {
        const key = `${student.date}-${student.session}-${student.room}`;
        console.log('Processing student:', student.name, 'with key:', key, 'date:', student.date);
        if (!uniqueSessions.has(key)) {
          uniqueSessions.set(key, {
            id: student.id,
            name: student.name,
            subject: student.subject,
            chapter: student.chapter,
            session: student.session,
            room: student.room,
            date: student.date || new Date().toLocaleDateString('en-GB')
          });
        } else {
          console.log('Duplicate found for key:', key, 'skipping...');
        }
      });

      // Convert to array and sort by date (newest first)
      const formattedSessions = Array.from(uniqueSessions.values())
        .sort((a: SessionStudent, b: SessionStudent) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });

      console.log('Final formatted sessions:', formattedSessions);
      setSessions(formattedSessions);
    } else {
      // Fallback to current user's allocation data if no session students exist
      const allocationData = localStorage.getItem('studentAllocationData');
      if (allocationData) {
        const data = JSON.parse(allocationData);
        const sessionData = {
          id: Date.now(),
          name: 'Current Student',
          subject: data.subject,
          chapter: data.chapter,
          session: data.session,
          room: data.room,
          date: data.date || new Date().toLocaleDateString('en-GB')
        };
        setSessions([sessionData]);
      }
    }
  }, []);

  const handleViewReport = (session: SessionStudent) => {
    const key = `${session.date}_${session.session}`;
    localStorage.setItem('selectedSessionForReport', key);
    navigate('/student/report');
  };
  

  // Pagination logic
  const totalItems = sessions.length;
  const paginatedSessions = sessions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-7xl mx-auto  flex-col">
        
        {/* Table Container */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden flex-1">
          <div className="overflow-x-auto h-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Date</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Session</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Room</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSessions.length > 0 ? (
                  paginatedSessions.map((session, index) => (
                    <tr 
                      key={session.id} 
                      className={`${index < paginatedSessions.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200 cursor-pointer`}
                    >
                      <td className="py-3 px-4 text-gray-800 font-medium">{session.date}</td>
                      <td className="py-3 px-4 text-gray-700">{session.session}</td>
                      <td className="py-3 px-4 text-gray-700">{session.room}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewReport(session)}
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
                      No session data found. Please complete your allocation first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentSessions;