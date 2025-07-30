import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';

interface Session {
  id: number;
  date: string;
  session: string;
  room: string;
}

const SESSION_OPTIONS = [
  '6am - 9am',
  '10am - 1pm',
  '2pm - 5pm',
  '7pm - 10pm',
];
const ROOM_OPTIONS = ['Room 1', 'Room 2'];

const LOCAL_STORAGE_KEY = 'tutorSessions';

const TutorSessions: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, date: new Date().toLocaleDateString('en-GB'), session: '6am - 9am', room: 'Room 1' },
      { id: 2, date: new Date().toLocaleDateString('en-GB'), session: '10am - 1pm', room: 'Room 2' },
      { id: 3, date: new Date().toLocaleDateString('en-GB'), session: '2pm - 5pm', room: 'Room 1' },
    ];
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [form, setForm] = useState({
    session: '',
    room: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleViewSession = (sessionId: number) => {
    navigate(`/tutor/session-view/${sessionId}`);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setForm({ session: session.session, room: session.room });
    setShowEditModal(true);
  };

  const handleDeleteSession = (sessionId: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.session || !form.room) return;
    const newSession = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      session: form.session,
      room: form.room,
    };
    setSessions((prev: Session[]) => [
      ...prev,
      newSession,
    ]);

    // --- AUTO-UPDATE STUDENT ALLOCATION DATA ---
    // Get all sessionStudents
    const sessionStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
    // For each student, if their last allocation matches this session/room, update their allocationData
    sessionStudents.forEach((student: any) => {
      if (student.session === newSession.session && student.room === newSession.room) {
        // Update their allocationData (simulate as if they re-allocated for this session)
        // This will only affect the currently logged-in student (in this browser)
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (student.name === userInfo.name && student.phoneNumber === userInfo.phoneNumber) {
          localStorage.setItem('studentAllocationData', JSON.stringify({
            subject: student.subject,
            chapter: student.chapter,
            session: newSession.session,
            room: newSession.room,
            date: newSession.date
          }));
        }
      }
    });
    // --- END AUTO-UPDATE ---

    setShowModal(false);
    setForm({ session: '', room: '' });
  };

  const handleEditSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !form.session || !form.room) return;
    
    setSessions(prev => prev.map(s => 
      s.id === editingSession.id 
        ? { ...s, session: form.session, room: form.room }
        : s
    ));
    
    setShowEditModal(false);
    setEditingSession(null);
    setForm({ session: '', room: '' });
  };

  // Pagination logic
  const totalItems = sessions.length;
  const paginatedSessions = sessions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add Session Button */}
        <div className="flex justify-between items-center mb-6">
                    <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
            onClick={() => setShowModal(true)}
          >
            Add Session +
                    </button>
        </div>
        {/* Table Container */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100">
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Date</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Sessions</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Room</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSessions.map((session: Session, index: number) => (
                  <tr
                    key={session.id}
                    className={`${index < paginatedSessions.length - 1 ? 'border-b border-black/10' : ''} hover:bg-white/20 transition-colors duration-200`}
                  >
                    <td className="py-4 px-4 text-gray-800 font-medium">{session.date}</td>
                    <td className="py-4 px-4 text-gray-700">{session.session}</td>
                    <td className="py-4 px-4 text-gray-700">{session.room}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => handleViewSession(session.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        >
                          View
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSession(session)}
                            className="text-blue-500 hover:text-blue-600 p-2 transition-colors duration-200"
                            title="Edit"
                          >
                            <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-red-500 hover:text-red-600 p-2 transition-colors duration-200"
                            title="Delete"
                          >
                            <svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 2 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                  </div>
                </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            // onRowsPerPageChange={rows => { setRowsPerPage(rows); setCurrentPage(1); }}
          />
        </div>
        
        {/* Add Session Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Add Session</h2>
              <form onSubmit={handleAddSession} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Session</label>
                  <select
                    value={form.session}
                    onChange={e => setForm(f => ({ ...f, session: e.target.value }))}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  >
                    <option value="">Select session</option>
                    {SESSION_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Room</label>
                  <select
                    value={form.room}
                    onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  >
                    <option value="">Select room</option>
                    {ROOM_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
              >
                  Add
              </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Session Modal */}
        {showEditModal && editingSession && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => setShowEditModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Session</h2>
              <form onSubmit={handleEditSessionSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Session</label>
                  <select
                    value={form.session}
                    onChange={e => setForm(f => ({ ...f, session: e.target.value }))}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  >
                    <option value="">Select session</option>
                    {SESSION_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
          </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Room</label>
                  <select
                    value={form.room}
                    onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  >
                    <option value="">Select room</option>
                    {ROOM_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
                >
                    Update
                </button>
              </form>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSessions;