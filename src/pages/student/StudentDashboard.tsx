import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaRobot, FaColumns, FaCalendarAlt } from "react-icons/fa";
import { MdAssignmentTurnedIn } from "react-icons/md";

const StudentDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-blue-900 text-white flex flex-col justify-between py-6 px-4">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <FaUserCircle size={30} />
            <div>
              <div className="text-sm font-semibold">Supriya</div>
              <div className="text-xs text-gray-300">Student</div>
            </div>
          </div>

          <nav className="space-y-4 text-sm">
            <Link to="#" className="flex items-center space-x-2 hover:text-gray-300">
              <MdAssignmentTurnedIn />
              <span>Allocation</span>
            </Link>
            <Link to="#" className="flex items-center space-x-2 text-green-400 font-bold">
              <FaColumns />
              <span>Dashboard</span>
            </Link>
            <Link to="#" className="flex items-center space-x-2 hover:text-gray-300">
              <FaRobot />
              <span>AI_Assistant</span>
            </Link>
            <Link to="#" className="flex items-center space-x-2 hover:text-gray-300">
              <FaCalendarAlt />
              <span>Sessions</span>
            </Link>
          </nav>
        </div>

        <Link to="#" className="flex items-center space-x-2 text-red-400 hover:text-red-600">
          <FaSignOutAlt />
          <span>Logout</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-10 relative">
        {/* Timer Circle */}
        <div className="absolute top-5 left-5 w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center text-green-600 font-bold">
          00:08
        </div>

        {/* FOCAS Logo */}
        <div className="absolute top-5 right-10 text-right">
          <div className="text-2xl font-extrabold text-blue-900 tracking-tight">FOCAS</div>
          <div className="text-sm text-gray-600">YOUR LAST ATTEMPT</div>
        </div>

        {/* Table */}
        <div className="mt-20">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Subject</th>
                <th className="py-2 px-4 text-left">Chapter</th>
                <th className="py-2 px-4 text-left">Topic</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { subject: "Accounts", chapter: "Chapter 4", topic: "Topic 2", status: "Pending" },
                { subject: "Accounts", chapter: "Chapter 3", topic: "Topic 1.2", status: "Come to live" },
                { subject: "Accounts", chapter: "Chapter 2", topic: "Topic 1.1", status: "Completed" },
                { subject: "Accounts", chapter: "Chapter 1", topic: "Topic 1", status: "Completed" },
                { subject: "Tax", chapter: "Chapter 2", topic: "Topic 1.1", status: "Completed" },
                { subject: "Tax", chapter: "Chapter 1", topic: "Topic 1", status: "Completed" }
              ].map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{row.subject}</td>
                  <td className="py-2 px-4">{row.chapter}</td>
                  <td className="py-2 px-4">{row.topic}</td>
                  <td className={`py-2 px-4 font-semibold ${
                    row.status === "Completed"
                      ? "text-green-600"
                      : row.status === "Come to live"
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}>
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;