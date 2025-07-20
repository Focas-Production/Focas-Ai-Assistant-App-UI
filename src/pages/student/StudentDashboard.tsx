import React from 'react';
import { FiCalendar, FiMessageCircle, FiLayers, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GlassCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-5 hover:scale-105 transition-transform cursor-pointer group hover:shadow-xl">
    <div className="flex items-center justify-between mb-2">
      <div className={`bg-${color}-100 text-${color}-600 p-3 rounded-xl`}>
        <Icon size={22} />
      </div>
      <span className={`text-${color}-600 text-xs font-semibold uppercase tracking-wider`}>
        {label}
      </span>
    </div>
    <div className="text-3xl font-extrabold text-gray-900 group-hover:text-black">{value}</div>
  </div>
);

const ActionCard = ({ label, icon: Icon, link }: any) => (
  <Link
    to={link}
    className="bg-gradient-to-br from-white/40 to-blue-50/50 backdrop-blur-md p-4 rounded-2xl hover:scale-105 transition-transform shadow-md hover:shadow-lg border border-white/20 flex items-center justify-between"
  >
    <div className="flex items-center gap-3">
      <div className="bg-white text-blue-600 p-2 rounded-lg shadow-sm">
        <Icon size={20} />
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    <FiArrowRight className="text-blue-400" />
  </Link>
);

const StudentDashboard: React.FC = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen font-inter">

      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
          Welcome, Student 🎓
        </h1>
        <p className="text-gray-500">Here’s your current academic snapshot.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <GlassCard icon={FiCalendar} label="Allocations" value="5 Subjects" color="blue" />
        <GlassCard icon={FiMessageCircle} label="AI Queries" value="23" color="green" />
        <GlassCard icon={FiLayers} label="Sessions" value="3 Active" color="purple" />
        <GlassCard icon={FiBarChart2} label="Report Score" value="88%" color="orange" />
      </div>

      {/* Quick Links */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ActionCard label="View Allocations" icon={FiCalendar} link="/student/allocation" />
          <ActionCard label="Launch AI Assistant" icon={FiMessageCircle} link="/student/ai-assistant" />
          <ActionCard label="My Sessions" icon={FiLayers} link="/student/student-sessions" />
          <ActionCard label="View Report" icon={FiBarChart2} link="/student/report-page" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200 text-sm text-gray-600">
          {[
            '📚 Allocated new subject: Advanced Mathematics.',
            '💬 You asked 5 questions to the AI Assistant today.',
            '🎯 Completed 2 study sessions.',
            '📈 Your report score improved by 4%.',
          ].map((activity, index) => (
            <li key={index} className="py-3">{activity}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default StudentDashboard;
