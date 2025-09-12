import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

// Interface for a person's data
interface Person {
  _id: string; // Changed from id to _id to match MongoDB
  id?: string; // Optional fallback id used in some code paths
  name: string;
  phone_number: string;
  role: string;
  level?: string;
  batch?: string;
  created_at?: string;
}

// Interface for the form data
interface FormData {
    name: string;
    phoneNumber: string;
    role: string;
    level: string;
    batch?: string;
}

// Interface for form validation errors
interface FormErrors {
  name?: string;
  phoneNumber?: string;
  role?: string;
  level?: string;
}

// Props interface
interface AdminManagePeopleProps {
  filterRole: 'all' | 'student' | 'tutor' | 'admin';
}

const AdminManagePeople: React.FC<AdminManagePeopleProps> = ({ filterRole }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [showLevelOptions, setShowLevelOptions] = useState(false);
  const [showEditRoleOptions, setShowEditRoleOptions] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Refs for the dropdowns to detect outside clicks
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const levelDropdownRef = useRef<HTMLDivElement>(null);
  const editRoleDropdownRef = useRef<HTMLDivElement>(null);

  // State for the "Add Person" form
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    role: '',
    level: '',
    batch: ""
  });
  
  // State to hold validation errors for the "Add" modal
  const [errors, setErrors] = useState<FormErrors>({});

  // State for the delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);

  // Initialize people data from API
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);

  // Get the appropriate title based on filter
  const getPageTitle = () => {
    switch (filterRole) {
      case 'student':
        return 'Manage Students';
      case 'tutor':
        return 'Manage Tutors';
      case 'admin':
        return 'Manage Admins';
      default:
        return 'Manage People';
    }
  };

  // Get the appropriate button text based on filter
  const getAddButtonText = () => {
    switch (filterRole) {
      case 'student':
        return 'Add Student +';
      case 'tutor':
        return 'Add Tutor +';
      case 'admin':
        return 'Add Admin +';
      default:
        return 'Add +';
    }
  };

  // Load users from API on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  // Filter people when filterRole changes
  useEffect(() => {
    if (filterRole === 'all') {
      setFilteredPeople(allPeople);
    } else {
      const filtered = allPeople.filter(person => person.role.toLowerCase() === filterRole);
      setFilteredPeople(filtered);
    }
  }, [allPeople, filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await apiService.getAllUsers() as Person[];
      console.log('Loaded users:', users); // Debug log
      setAllPeople(users);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle clicks outside of the dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleOptions(false);
      }
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target as Node)) {
        setShowLevelOptions(false);
      }
      if (editRoleDropdownRef.current && !editRoleDropdownRef.current.contains(event.target as Node)) {
        setShowEditRoleOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission for adding a new person
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits.';
    if (!formData.role) newErrors.role = 'Please select a role.';
    if (!formData.level) newErrors.level = 'Please select a level.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.createUser({
        name: formData.name,
        phone: formData.phoneNumber,
        role: formData.role.toLowerCase()
      });

      setSuccess(`User created successfully! Password: ${response.password}. WhatsApp notification sent.`);
      
      // Reload users list
      await loadUsers();
      
      // Reset form
      setFormData({ name: '', phoneNumber: '', role: '', level: '' });
      setShowModal(false);
      setErrors({});
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setError(error.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Set up the form for editing an existing person
  const handleEdit = (person: Person) => {
    console.log('Editing person:', person); // Debug log
    console.log('Person ID:', person._id || person.id); // Debug log
    
    setEditingPerson(person);
    setFormData({
      name: person.name,
      phoneNumber: person.phone_number,
      role: person.role,
      level: person.level || ''
    });
    setShowEditModal(true);
    setErrors({});
  };

  // Handle form submission for editing a person
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerson) {
      setError('No user selected for editing');
      return;
    }

    // Get the correct ID (try both _id and id)
    const userId = editingPerson._id || editingPerson.id;
    if (!userId) {
      setError('User ID not found');
      return;
    }

    console.log('Updating user with ID:', userId); // Debug log

    try {
      setLoading(true);
      setError(null);
      
      await apiService.editUser(userId, {
        name: formData.name,
        phone_number: formData.phoneNumber,
        role: formData.role.toLowerCase()
      });

      setSuccess('User updated successfully!');
      
      // Reload users list
      await loadUsers();
      
      setEditingPerson(null);
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      setError(error.message || 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show the delete confirmation modal
  const handleDelete = (personId: string) => {
    console.log('Deleting person with ID:', personId); // Debug log
    setPersonToDelete(personId);
    setShowDeleteConfirm(true);
  };

  // Perform the deletion after confirmation
  const confirmDelete = async () => {
    if (!personToDelete) return;

    try {
      setLoading(true);
      setError(null);
      
      const person = allPeople.find(p => (p._id || p.id) === personToDelete);
      if (!person) {
        setError('User not found');
        return;
      }

      console.log('Deleting user:', person); // Debug log

      await apiService.deleteUser(personToDelete, person.phone_number);
      setSuccess('User deleted successfully!');
      
      // Reload users list
      await loadUsers();
      
      setShowDeleteConfirm(false);
      setPersonToDelete(null);
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      setError(error.message || 'Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
            <button 
              onClick={() => setSuccess(null)}
              className="float-right text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
          <button 
            onClick={() => {
                setShowModal(true);
                setErrors({});
                setFormData({ name: '', phoneNumber: '', role: '', level: '' });
            }}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Loading...' : getAddButtonText()}
          </button>
        </div>

        {/* Filter Info */}
        {filterRole !== 'all' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Showing {filterRole}s only. 
              <span className="font-medium"> {filteredPeople.length} {filterRole}(s) found.</span>
            </p>
          </div>
        )}
        
        {/* People Table */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100/50">
                  <th className="w-1/4 text-left py-4 px-4 text-blue-900 font-semibold text-lg">Name</th>
                  <th className="w-1/4 text-left py-3 px-4 text-blue-900 font-semibold text-lg">Phone Number</th>
                  <th className="w-1/4 text-left py-3 px-4 text-blue-900 font-semibold text-lg">Role</th>
                  <th className="w-1/4 text-left py-3 px-4 text-blue-900 font-semibold text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeople.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      {loading ? 'Loading...' : `No ${filterRole === 'all' ? 'users' : filterRole + 's'} found.`}
                    </td>
                  </tr>
                ) : (
                  filteredPeople.map((person: Person) => (
                    <tr key={person._id || person.id} className="border-b border-black/10 bg-white hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">{person.name}</td>
                      <td className="py-3 px-4 text-gray-700">{person.phone_number}</td>
                      <td className="py-3 px-4 text-gray-700 capitalize">{person.role}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(person)} 
                            className="text-blue-500 hover:text-blue-600 p-2" 
                            title="Edit"
                            disabled={loading}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(person._id ?? (person.id as string))} 
                            className="text-red-500 hover:text-red-600 p-2" 
                            title="Delete"
                            disabled={loading}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal Popup */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Add {filterRole === 'all' ? 'Person' : filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Enter the Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onClick={() => {
                      setErrors((prev) => ({ ...prev, name: "" }));
                      setShowRoleOptions(false);
                      setShowLevelOptions(false);
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter the Phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d{0,10}$/.test(input)) {
                        setFormData({ ...formData, phoneNumber: input });
                      }
                    }}
                    onClick={() => {
                      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                      setShowRoleOptions(false);
                      setShowLevelOptions(false);
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Role & Level */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Role */}
                  <div className="relative" ref={roleDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select role"
                        value={formData.role}
                        onClick={() => setShowRoleOptions(!showRoleOptions)}
                        readOnly
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-white text-gray-800 cursor-pointer ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                        disabled={loading}
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
                    {showRoleOptions && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-600 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          {['Admin', 'Tutor', 'Student'].map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  role,
                                  level: role === 'Student' ? '' : 'Null', // Set level to 'Null' for Admin/Tutor
                                });
                                setShowRoleOptions(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-800"
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Level */}
                  <div className="relative" ref={levelDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select level"
                        value={formData.role === 'Student' ? formData.level : 'Null'}
                        onClick={() => {
                          if (formData.role === 'Student') setShowLevelOptions(!showLevelOptions);
                        }}
                        readOnly
                        required
                        disabled={formData.role !== 'Student' || loading}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-white text-gray-800 cursor-pointer ${errors.level ? 'border-red-500' : 'border-gray-300'} ${formData.role !== 'Student' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {errors.level && <p className="mt-1 text-xs text-red-600">{errors.level}</p>}
                    {formData.role === 'Student' && showLevelOptions && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-600 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          {['Foundation', 'Intermediate', 'Final'].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, level });
                                setShowLevelOptions(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-800"
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Batch - only for Students */}
                {formData.role === "Student" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch (Month & Year)
                    </label>

                    <div className="relative">
                      {!formData.batch && (
                        <span className="absolute left-4 top-3 text-gray-500 pointer-events-none">
                          Select Batch
                        </span>
                      )}
                      <input
                        type="month"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl 
                                    focus:outline-none focus:ring-2 focus:ring-blue-400
                                    text-gray-800
                                    ${!formData.batch ? '[&::-webkit-datetime-edit]:opacity-0' : ''}`}
                        value={formData.batch || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, batch: e.target.value })
                        }
                        onFocus={(e) => e.target.showPicker?.()}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors mt-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : `Add ${filterRole === 'all' ? 'Person' : filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}`}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal Popup */}
        {showEditModal && editingPerson && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
                disabled={loading}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Edit {filterRole === 'all' ? 'Person' : filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}
              </h2>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Role Dropdown */}
                <div className="relative" ref={editRoleDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select role"
                      value={formData.role}
                      onClick={(e) => {
                        setShowEditRoleOptions(!showEditRoleOptions);
                        e.stopPropagation();
                      }}
                      readOnly
                      className="w-full px-4 py-3 pr-10 bg-white text-gray-800 cursor-pointer border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {showEditRoleOptions && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-600 rounded-lg shadow-lg z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        {["Admin", "Tutor", "Student"].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, role });
                              setShowEditRoleOptions(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-800"
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
                    <p className="text-gray-600 mb-6">Are you sure you want to delete this {filterRole === 'all' ? 'person' : filterRole}? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4">
                        <button 
                          onClick={() => setShowDeleteConfirm(false)} 
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={confirmDelete} 
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
                          disabled={loading}
                        >
                          {loading ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminManagePeople;