import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import tutorIcon from '../../assets/tutor.png';

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
      <a href="/tutor/session" className="flex items-center gap-3 px-6 py-3 font-semibold text-white hover:bg-[#100070]">
        <span className="material-icons">event</span> Sessions
      </a>
      <a href="/tutor/sprint" className="flex items-center gap-3 px-6 py-3 font-semibold bg-white text-[#120088] border-l-4 border-green-400">
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

const Sprint = () => {
  const [rows, setRows] = useState([
    { name: 'AAA', topic: 'BBB', timer: '00:15:00', feedback: 'CCCC', status: 'Completed' },
    { name: 'AAA', topic: 'BBB', timer: '00:10:00', feedback: 'CCCC', status: 'Come to live' },
  ]);
  const topicOptions = ['BBB', 'CCC', 'DDD'];
  const timerOptions = ['00:05:00', '00:10:00', '00:15:00'];
  const statusOptions = ['Completed', 'Come to live'];

  const handleChange = (idx: number, field: string, value: string) => {
    setRows(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  return (
    <div className="flex h-screen bg-[#f7f9fc]">
      <TutorSidebar />
      <div className="flex-1 ml-60 flex flex-col relative">
        {/* Header */}
        <div className="flex justify-end items-center h-20 px-10 border-b border-gray-200 bg-transparent">
          <img src={logo} alt="FOCAS Logo" className="h-10 w-auto" />
        </div>
        {/* Table */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl mt-10">
            <table className="w-full border border-[#120088] text-sm rounded-lg overflow-hidden bg-white">
              <thead className="bg-[#f7f9fc] border-b border-[#120088]">
                <tr>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Name</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Topic</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Timer</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Feedback</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#120088] last:border-b-0">
                    <td className="py-2 px-4">{row.name}</td>
                    <td className="py-2 px-4">
                      <select
                        className="bg-transparent border-none outline-none text-[#120088] font-semibold"
                        value={row.topic}
                        onChange={e => handleChange(idx, 'topic', e.target.value)}
                      >
                        {topicOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4">
                      <select
                        className="bg-transparent border-none outline-none text-[#120088] font-semibold"
                        value={row.timer}
                        onChange={e => handleChange(idx, 'timer', e.target.value)}
                      >
                        {timerOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4">{row.feedback}</td>
                    <td className="py-2 px-4">
                      <select
                        className="bg-transparent border-none outline-none font-semibold"
                        value={row.status}
                        onChange={e => handleChange(idx, 'status', e.target.value)}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {row.status === 'Completed' ? (
                        <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold inline-flex items-center">
                          <span className="material-icons text-base align-middle mr-1">check_circle</span> Completed
                        </span>
                      ) : (
                        <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold inline-flex items-center">
                          <span className="material-icons text-base align-middle mr-1">wifi</span> Come to live
                        </span>
                      )}
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

export default Sprint; 