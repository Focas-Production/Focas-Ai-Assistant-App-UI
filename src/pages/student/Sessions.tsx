import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './Sidebar';
import logo from '../../assets/logo.png';

const StudentSessions = () => {
  const navigate = useNavigate();
  // Example session data
  const sessions = [
    { date: '15/7/25', session: '6am-9am', room: 'Room 1' },
    { date: '15/7/25', session: '6am-9am', room: 'Room 1' },
    { date: '15/7/25', session: '6am-9am', room: 'Room 1' },
    { date: '15/7/25', session: '6am-9am', room: 'Room 1' },
    { date: '15/7/25', session: '6am-9am', room: 'Room 1' },
    { date: '15/7/25', session: '6am-9am', room: 'Room 1' },
  ];

  return (
    <div className="flex h-screen bg-[#f7f9fc]">
      <StudentSidebar />
      <div className="flex-1 ml-60 flex flex-col relative">
        {/* Header */}
        <div className="flex justify-end items-center h-20 px-10 border-b border-gray-200 bg-transparent">
          <img src={logo} alt="FOCAS Logo" className="h-10 w-auto" />
        </div>
        {/* Table */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl mt-10">
            <table className="w-full border border-[#120088] text-sm rounded-lg overflow-hidden bg-white">
              <thead className="bg-[#f7f9fc] border-b border-[#120088]">
                <tr>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Date</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Session</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Room</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#120088] last:border-b-0">
                    <td className="py-2 px-4">{row.date}</td>
                    <td className="py-2 px-4">{row.session}</td>
                    <td className="py-2 px-4">{row.room}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-[#120088] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#100070] transition"
                        onClick={() => navigate('/student/report')}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button className="w-8 h-8 flex items-center justify-center border-2 border-[#120088] rounded-full text-[#120088] text-lg hover:bg-[#120088] hover:text-white transition">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center border-2 border-[#120088] rounded-full text-[#120088] text-lg hover:bg-[#120088] hover:text-white transition">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSessions; 