import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import manageIcon from '../../assets/manage_std.png';
import studentIcon from '../../assets/student.png';
import tutorIcon from '../../assets/tutor.png';
import adminIcon from '../../assets/admin.png';
import logoutIcon from '../../assets/logout.png';

const StudentSidebar: React.FC = () => {
  const location = useLocation();

  const getLinkClass = (path: string): string => {
    const current = location.pathname;
    if (path === '/students' && current.startsWith('/student')) {
      return 'bg-white text-[#120088] border-l-4 border-green-400';
    }
    if (path === '/tutors' && current.startsWith('/tutor')) {
      return 'bg-white text-[#120088] border-l-4 border-green-400';
    }
    if (current === path) {
      return 'bg-white text-[#120088] border-l-4 border-green-400';
    }
    return 'text-white hover:bg-[#100070]';
  };

  const profileActive =
    location.pathname === '/profile'
      ? 'bg-white text-[#120088] border-l-4 border-green-400'
      : 'text-white hover:bg-[#100070]';

  return (
    <div className="bg-[#120088] text-white w-60 h-screen flex flex-col justify-between fixed font-poppins">
      {/* ✅ Top Profile */}
      <Link
        to="/profile"
        className={`p-4 flex items-center gap-3 cursor-pointer ${profileActive}`}
      >
        <FaUserCircle className="text-[32px]" />
        <div>
          <p className="text-[20px] font-semibold leading-5">Supriya</p>
          <p className="text-sm text-gray-300">Student</p>
        </div>
      </Link>

      {/* ✅ Navigation Menu */}
      <nav className="mt-[-600px] flex flex-col gap-2 text-[16px]">
        <Link
          to="/student/allocation"
          className={`flex items-center gap-3 px-6 py-3 font-semibold ${getLinkClass('/student/allocation')}`}
        >
          <img src={manageIcon} alt="Allocation" className="w-5 h-4" />
          Allocation
        </Link>

        <Link
          to="/student/dashboard"
          className={`flex items-center gap-3 px-6 py-3 font-semibold ${getLinkClass('/student/dashboard')}`}
        >
          <img src={studentIcon} alt="Dashboard" className="w-5 h-5" />
          Dashboard
        </Link>

        <Link
          to="/student/ai_assistant"
          className={`flex items-center gap-3 px-6 py-3 font-semibold ${getLinkClass('/student/ai_assistant')}`}
        >
          <img src={tutorIcon} alt="AI Assistant" className="w-5 h-5" />
          AI Assistant
        </Link>

        <Link
          to="/student/sessions"
          className={`flex items-center gap-3 px-6 py-3 font-semibold ${getLinkClass('/student/sessions')}`}
        >
          <img src={adminIcon} alt="Sessions" className="w-5 h-5" />
          Sessions
        </Link>
      </nav>

      {/* ✅ Bottom Logout */}
      <div className="mb-6 pl-6">
        <button className="flex items-center gap-3 text-[16px] text-gray-300 hover:text-white">
          <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
