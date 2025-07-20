import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import tutorIcon from '../../assets/tutor.png';
import backarrow from '../../assets/backarrow.png';

const TutorSidebar: React.FC = () => (
  <div className="bg-[#120088] text-white w-60 h-screen flex flex-col justify-between fixed font-poppins">
    {/* Top Profile */}
    <div className="p-4 flex items-center gap-3">
      <img src={tutorIcon} alt="Tutor" className="w-10 h-10 rounded-full" />
      <div>
        <p className="text-[20px] font-semibold leading-5">Srihari</p>
        <p className="text-sm text-gray-300">Tutor</p>
      </div>
    </div>
    {/* Navigation Menu */}
    <nav className="flex flex-col gap-2 text-[16px] mt-[-600px]">
      <a href="/tutor/session" className="flex items-center gap-3 px-6 py-3 font-semibold bg-white text-[#120088] border-l-4 border-green-400">
        <span className="material-icons">event</span> Sessions
      </a>
      <a href="/tutor/sprint" className="flex items-center gap-3 px-6 py-3 font-semibold text-white hover:bg-[#100070]">
        <span className="material-icons">directions_run</span> Sprint
      </a>
    </nav>
    {/* Bottom Logout */}
    <div className="mb-6 pl-6">
      <button className="flex items-center gap-3 text-[16px] text-gray-300 hover:text-white">
        <span className="material-icons">logout</span> Log Out
      </button>
    </div>
  </div>
);

const TutorSession = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState('');
  const [session, setSession] = useState('');
  const [room, setRoom] = useState('');

  const sessions = [
    { date: '10-07-2025', session: '6am-9am', room: '1' },
    { date: '10-07-2025', session: '2pm-5pm', room: '2' },
    { date: '10-07-2025', session: '7pm-10pm', room: '2' },
  ];

  return (
    <div className="flex h-screen bg-[#f7f9fc]">
      <TutorSidebar />
      <div className="flex-1 ml-60 flex flex-col relative">
        {/* Header */}
        <div className="flex justify-end items-center h-20 px-10 border-b border-gray-200 bg-transparent">
          <img src={logo} alt="FOCAS Logo" className="h-10 w-auto" />
        </div>
        {/* Add Sessions Button */}
        <div className="flex justify-end mt-8 mr-10">
          <button
            className="bg-[#120088] text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#100070] transition"
            onClick={() => setShowModal(true)}
          >
            Add Sessions +
          </button>
        </div>
        {/* Table */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl mt-4">
            <table className="w-full border border-[#120088] text-sm rounded-lg overflow-hidden bg-white">
              <thead className="bg-[#f7f9fc] border-b border-[#120088]">
                <tr>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Date</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Sessions</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Room</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((row, idx) => (
                  <tr key={idx} className={`border-b border-[#120088] last:border-b-0 ${idx === 2 ? 'bg-[#120088] text-white' : ''}`}>
                    <td className="py-2 px-4">{row.date}</td>
                    <td className="py-2 px-4">{row.session}</td>
                    <td className="py-2 px-4">{row.room}</td>
                    <td className="py-2 px-4">
                      <button
                        className={`px-6 py-2 rounded-lg font-semibold transition ${idx === 2 ? 'bg-white text-[#120088]' : 'bg-[#120088] text-white'}`}
                        onClick={() => navigate('/tutor/student-details')}
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
        {/* Modal Popup */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
            <div className="bg-white rounded-xl shadow-2xl p-10 min-w-[500px] max-w-[520px] mx-4 flex flex-col items-center relative">
              {/* Back Button */}
              <button
                className="absolute left-4 top-4 w-8 h-8 flex items-center justify-center rounded-full border border-[#120088] text-[#120088] hover:bg-[#120088] hover:text-white transition"
                onClick={() => setShowModal(false)}
                aria-label="Back"
              >
                <img src={backarrow} alt="Back" className="w-5 h-5" />
              </button>
              <div className="text-[#120088] text-lg font-bold mb-8 mt-2 text-center w-full">Choose the date, session, and room to schedule a new class</div>
              <form className="w-full flex flex-col items-center gap-6">
                <div className="flex gap-6 w-full">
                  <div className="flex-1">
                    <select
                      className="w-full border-2 border-[#120088] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#120088] appearance-none"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    >
                      <option value="" disabled>Date</option>
                      <option value="10-07-2025">10-07-2025</option>
                      <option value="11-07-2025">11-07-2025</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      className="w-full border-2 border-[#120088] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#120088] appearance-none"
                      value={session}
                      onChange={e => setSession(e.target.value)}
                    >
                      <option value="" disabled>Session</option>
                      <option value="6am-9am">6am-9am</option>
                      <option value="2pm-5pm">2pm-5pm</option>
                      <option value="7pm-10pm">7pm-10pm</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      className="w-full border-2 border-[#120088] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#120088] appearance-none"
                      value={room}
                      onChange={e => setRoom(e.target.value)}
                    >
                      <option value="" disabled>Room</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-1/2 bg-[#120088] hover:bg-[#100070] text-white font-semibold py-3 rounded-lg text-lg mt-4 shadow-md transition flex items-center justify-center gap-2"
                >
                  Add +
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSession; 