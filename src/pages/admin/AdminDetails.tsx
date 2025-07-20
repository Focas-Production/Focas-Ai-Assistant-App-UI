import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Eye, Edit, Trash2, Filter } from 'lucide-react';

const AdminDetails = () => {
  const [admins, setAdmins] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", adminId: "ADM001", role: "Super Admin", status: "Active", joinDate: "2022-01-10" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", adminId: "ADM002", role: "Admin", status: "Active", joinDate: "2022-06-15" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", adminId: "ADM003", role: "Moderator", status: "Inactive", joinDate: "2023-03-20" },
    { id: 4, name: "Alice Brown", email: "alice.brown@example.com", adminId: "ADM004", role: "Admin", status: "Active", joinDate: "2023-09-01" },
    { id: 5, name: "Charlie Davis", email: "charlie.davis@example.com", adminId: "ADM005", role: "Support", status: "Active", joinDate: "2024-01-15" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState("All");

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedAdmins = useMemo(() => {
    let filtered = admins.filter(admin => {
      const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.adminId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || admin.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [admins, searchTerm, sortConfig, filterStatus]);

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const getStatusBadge = (status) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {status}
    </span>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Admin Details</h2>
          <p className="text-gray-600 mb-4">Manage and view all admin information</p>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{admins.length}</div>
              <div className="text-sm text-gray-500">Total Admins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{admins.filter(a => a.status === 'Active').length}</div>
              <div className="text-sm text-gray-500">Active Admins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{new Set(admins.map(a => a.role)).size}</div>
              <div className="text-sm text-gray-500">Roles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{admins.length > 0 ? admins[0].joinDate.slice(0, 4) : '-'}</div>
              <div className="text-sm text-gray-500">Earliest Join Year</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search admins..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Admin
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['adminId', 'name', 'role', 'status'].map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-1">
                        {key === 'adminId' ? 'Admin ID' : key.charAt(0).toUpperCase() + key.slice(1)}
                        {getSortIcon(key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.adminId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(admin.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 transition-colors p-1 hover:bg-green-50 rounded" title="Edit Admin">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded" title="Delete Admin">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAndSortedAdmins.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No admins found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;