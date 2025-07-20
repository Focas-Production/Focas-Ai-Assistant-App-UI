import React from 'react';
import { FiHome, FiMessageCircle, FiLayers, FiBarChart2, FiLogOut, FiMenu } from 'react-icons/fi';
import logo from '../../assets/logo.png';

const SidebarLink = ({ icon: Icon, label, active, collapsed, onClick }: any) => (
  <div
    onClick={onClick}
    className={`group relative flex items-center rounded-3xl px-4 py-4 mb-2 cursor-pointer transform transition-transform duration-100 ${
      active
        ? 'bg-white text-blue-700 shadow-xl shadow-blue-200/50 border border-blue-100/50 scale-100'
        : 'hover:bg-white/80 hover:shadow-md hover:shadow-blue-200/30 text-gray-500 hover:text-blue-600 hover:scale-105'
    } ${collapsed ? 'justify-center' : 'gap-4'}`}
  >
    <Icon size={22} />
    {!collapsed && (
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    )}

    {collapsed && (
      <div className="absolute left-full ml-3 px-3 py-2 bg-white text-blue-700 text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg shadow-blue-300/40 border border-blue-100">
        {label}
        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-l border-b border-blue-100"></div>
      </div>
    )}
  </div>
);

const StudentSidebar: React.FC<any> = ({
  collapsed,
  setCollapsed,
  activeLink,
  setActiveLink,
  onLogout
}) => {
  const navigationItems = [
    { icon: FiHome, label: 'Dashboard' },
    // { icon: FiCalendar, label: 'Allocation' },
    { icon: FiMessageCircle, label: 'AI Assistant' },
    { icon: FiLayers, label: 'Sessions' },
    { icon: FiBarChart2, label: 'Report Page' },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-br from-gray-50 via-white to-blue-50 h-screen flex flex-col fixed font-inter shadow-xl shadow-blue-200/20 transition-[width] duration-500 ease-in-out z-40 border-r border-blue-100/60`}>
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && <img src={logo} alt="Student Logo" className="h-10 w-auto" />}
        <button
          className={`w-10 h-10 rounded-2xl bg-white cursor-pointer shadow-md shadow-blue-200/30 flex items-center justify-center hover:shadow-lg border border-blue-100/40 transition-all duration-300 group ${collapsed ? 'mx-auto' : ''}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiMenu size={18} className="text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-2">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarLink
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeLink === item.label}
              collapsed={collapsed}
              onClick={() => setActiveLink(item.label)}
            />
          ))}
        </div>
      </nav>

      <div className="p-4">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-4 rounded-2xl cursor-pointer text-gray-500 hover:text-red-500 hover:bg-white hover:shadow-md hover:shadow-red-100/50 transition-all duration-300 border border-transparent hover:border-red-100/50`}
        >
          <FiLogOut size={20} />
          {!collapsed && <span className="text-sm font-semibold tracking-wide">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
