import React from 'react';
import StudentSidebar from './Sidebar';
import logo from '../../assets/logo.png';

const ReportPage = () => {
  return (
    <div className="flex h-screen bg-[#f7f9fc]">
      <StudentSidebar />
      <div className="flex-1 ml-60 flex flex-col relative">
        {/* Header */}
        <div className="flex justify-end items-center h-20 px-10 border-b border-gray-200 bg-transparent">
          <img src={logo} alt="FOCAS Logo" className="h-10 w-auto" />
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl mt-10">
            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b border-gray-200">
              <button className="text-[#120088] font-bold text-lg border-b-4 border-green-500 pb-2 px-2">Report</button>
              <button className="text-gray-400 font-bold text-lg pb-2 px-2 cursor-not-allowed">History</button>
            </div>
            {/* Report Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="text-center mb-6">
                <div className="text-xl font-bold text-[#120088] mb-2">Student Evaluation Report</div>
                <div className="text-sm text-gray-700 mb-1"><b>Date:</b> 15 July 2025</div>
                <div className="text-sm text-gray-700 mb-1"><b>Student Name:</b> Supriya</div>
                <div className="text-sm text-gray-700 mb-1"><b>Course:</b> Chartered Accountancy (Intermediate)</div>
                <div className="text-sm text-gray-700 mb-1"><b>Module:</b> Group 1 – Accounting & Taxation</div>
              </div>
              <div className="mb-2 text-[#120088] font-semibold">Performance Summary</div>
              <table className="w-full border border-[#120088] text-sm rounded-lg overflow-hidden">
                <thead className="bg-[#120088] text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">Metric</th>
                    <th className="py-2 px-4 text-left">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#120088]">
                    <td className="py-2 px-4">Total Question Given</td>
                    <td className="py-2 px-4">25</td>
                  </tr>
                  <tr className="border-b border-[#120088]">
                    <td className="py-2 px-4">Questions Attempted by student</td>
                    <td className="py-2 px-4">22</td>
                  </tr>
                  <tr className="border-b border-[#120088]">
                    <td className="py-2 px-4">Correct Answers</td>
                    <td className="py-2 px-4">17</td>
                  </tr>
                  <tr className="border-b border-[#120088]">
                    <td className="py-2 px-4">Incorrect Answers</td>
                    <td className="py-2 px-4">5</td>
                  </tr>
                  <tr className="border-b border-[#120088]">
                    <td className="py-2 px-4">Unattempted</td>
                    <td className="py-2 px-4">3</td>
                  </tr>
                  <tr className="border-b border-[#120088]">
                    <td className="py-2 px-4">Accuracy Rate</td>
                    <td className="py-2 px-4 text-blue-700 font-bold">77.3%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Overall Score</td>
                    <td className="py-2 px-4 text-blue-700 font-bold">68/100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage; 