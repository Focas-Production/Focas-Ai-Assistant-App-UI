import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Session {
  id: number;
  date: string;
  session: string;
  room: string;
}

interface Person {
  id: number;
  name: string;
  phoneNumber: string;
  role: string;
}


const AdminTutorview = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Person | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Get tutor details from adminPeopleData
    const adminPeopleData = localStorage.getItem('adminPeopleData');
    if (adminPeopleData && tutorId) {
      const allPeople: Person[] = JSON.parse(adminPeopleData);
      const selectedTutor = allPeople.find(person => person.id === parseInt(tutorId));
      setTutor(selectedTutor || null);
    }

    // Get session data from tutorSessions localStorage
    const tutorSessions = JSON.parse(localStorage.getItem('tutorSessions') || '[]');
    setSessions(tutorSessions);
  }, [tutorId]);

  
  if (!tutor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500">Tutor not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-8">
      <div className="max-w-7xl mx-auto">
        
        

        {/* Tutor Info */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tutor Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 font-medium">Name:</label>
              <p className="text-gray-800 font-semibold">{tutor.name}</p>
            </div>
            <div>
              <label className="text-gray-600 font-medium">Phone Number:</label>
              <p className="text-gray-800 font-semibold">{tutor.phoneNumber}</p>
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
                            // Store navigation source before navigating
                            localStorage.setItem('sessionViewNavigationSource', 'admin');
                            navigate(`/admin/tutor-session-view/${session.id}`);
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
                      No session data found for this tutor.
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

export default AdminTutorview;
