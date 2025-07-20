import React from 'react';
import { FiUsers, FiBookOpen, FiShield, FiActivity, FiArrowRight } from 'react-icons/fi';
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

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen font-inter">

      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
          Welcome, Admin 👋
        </h1>
        <p className="text-gray-500">Here’s what’s happening across your academy today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <GlassCard icon={FiUsers} label="Students" value="245" color="blue" />
        <GlassCard icon={FiBookOpen} label="Tutors" value="32" color="green" />
        <GlassCard icon={FiShield} label="Admins" value="5" color="purple" />
        <GlassCard icon={FiActivity} label="Pending Requests" value="7" color="orange" />
      </div>

      {/* Quick Links */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ActionCard label="Manage Students" icon={FiUsers} link="/admin/student-details" />
          <ActionCard label="Manage Tutors" icon={FiBookOpen} link="/admin/tutor-details" />
          <ActionCard label="Manage Admins" icon={FiShield} link="/admin/admin-details" />
          <ActionCard label="Courses" icon={FiBookOpen} link="/admin/courses" />
          <ActionCard label="Reports" icon={FiActivity} link="/admin/reports" />
          <ActionCard label="Settings" icon={FiShield} link="/admin/settings" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200 text-sm text-gray-600">
          {[
            '📥 New student registered: Alice Johnson.',
            '📊 Tutor John Smith conducted 5 sessions today.',
            '🛡️ New admin added: admin_mark@example.com.',
            '✏️ Student Eva Brown updated profile info.',
          ].map((activity, index) => (
            <li key={index} className="py-3">{activity}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default AdminDashboard;
