import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import adminIcon from '../../assets/admin.png';

const AdminSidebar: React.FC = () => (
  <div className="bg-[#120088] text-white w-60 h-screen flex flex-col justify-between fixed font-poppins">
    {/* Top Profile */}
    <div className="p-4 flex items-center gap-3">
      <img src={adminIcon} alt="Admin" className="w-10 h-10 rounded-full" />
      <div>
        <p className="text-[20px] font-semibold leading-5">karthik</p>
        <p className="text-sm text-gray-300">Admin</p>
      </div>
    </div>
    {/* Navigation Menu */}
    <nav className="flex flex-col gap-2 text-[16px] mt-[-600px]">
      <a href="/admin/dashboard" className="flex items-center gap-3 px-6 py-3 font-semibold text-white hover:bg-[#100070]">
        <span className="material-icons">group</span> Manage People
      </a>
      <a href="/admin/student-details" className="flex items-center gap-3 px-6 py-3 font-semibold text-white hover:bg-[#100070]">
        <span className="material-icons">groups</span> Students
      </a>
      <a href="/admin/tutor-details" className="flex items-center gap-3 px-6 py-3 font-semibold bg-white text-[#120088] border-l-4 border-green-400">
        <span className="material-icons">supervisor_account</span> Tutors
      </a>
      <a href="/admin/admin-details" className="flex items-center gap-3 px-6 py-3 font-semibold text-white hover:bg-[#100070]">
        <span className="material-icons">security</span> Admin
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

const TutorDetails = () => {
  const navigate = useNavigate();
  const tutors = [
    { name: 'AAA', phone: 'XXXX' },
    { name: 'BBB', phone: 'XXXX' },
    { name: 'CCC', phone: 'XXXX' },
  ];
  return (
    <div className="flex h-screen bg-[#f7f9fc]">
      <AdminSidebar />
      <div className="flex-1 ml-60 flex flex-col relative">
        {/* Header */}
        <div className="flex justify-end items-center h-20 px-10 border-b border-gray-200 bg-transparent">
          <img src={logo} alt="FOCAS Logo" className="h-10 w-auto" />
        </div>
        {/* Search Bar */}
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-xl flex items-center border-2 border-[#120088] rounded-xl px-4 py-2 bg-white">
            <input
              type="text"
              className="flex-1 outline-none border-none text-lg bg-transparent"
              placeholder="Search Tutor"
            />
            <span className="material-icons text-[#120088] text-2xl ml-2">search</span>
          </div>
        </div>
        {/* Heading */}
        <div className="w-full max-w-3xl mt-8 text-[#120088] text-xl font-bold">Tutor’s List:</div>
        {/* Table */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl mt-2">
            <table className="w-full border border-[#120088] text-sm rounded-lg overflow-hidden bg-white">
              <thead className="bg-[#f7f9fc] border-b border-[#120088]">
                <tr>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Name</th>
                  <th className="py-2 px-4 text-[#120088] text-lg font-bold">Phone Number</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {tutors.map((row, idx) => (
                  <tr key={idx} className={`border-b border-[#120088] last:border-b-0 ${idx === 2 ? 'bg-[#120088] text-white' : ''}`}>
                    <td className="py-2 px-4">{row.name}</td>
                    <td className="py-2 px-4">{row.phone}</td>
                    <td className="py-2 px-4">
                      <button
                        className={`px-6 py-2 rounded-lg font-semibold transition ${idx === 2 ? 'bg-white text-[#120088]' : 'bg-[#120088] text-white'}`}
                        onClick={() => navigate('/student/sessions')}
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

export default TutorDetails; 