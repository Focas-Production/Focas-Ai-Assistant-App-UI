import React, { useState, useEffect, useRef } from 'react';

// Interface for a person's data
interface Person {
  id: number;
  name: string;
  phoneNumber: string;
  role: string;
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

const AdminManagePeople: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [showLevelOptions, setShowLevelOptions] = useState(false);
  const [showEditRoleOptions, setShowEditRoleOptions] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  
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
  const [personToDelete, setPersonToDelete] = useState<number | null>(null);

  // Initialize people data from localStorage or use default data
  const [people, setPeople] = useState<Person[]>(() => {
    try {
        const savedPeople = localStorage.getItem('adminPeopleData');
        return savedPeople ? JSON.parse(savedPeople) : [
            { id: 1, name: 'John Doe', phoneNumber: '1234567890', role: 'Tutor' }
        ];
    } catch (error) {
        console.error("Failed to parse people data from localStorage", error);
        return [
            { id: 1, name: 'John Doe', phoneNumber: '1234567890', role: 'Tutor' }
        ];
    }
  });

  // Save to localStorage whenever people data changes
  useEffect(() => {
    localStorage.setItem('adminPeopleData', JSON.stringify(people));
  }, [people]);

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits.';
    if (!formData.role) newErrors.role = 'Please select a role.';
    if (!formData.level) newErrors.level = 'Please select a level.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // const newPerson: Person = {
    //   id: Date.now(),
    //   name: formData.name,
    //   phoneNumber: formData.phoneNumber,
    //   role: formData.role
    // };

    const newPerson = {
      id: Date.now(),
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      role: formData.role,
      level: formData.level || '',
      batch: formData.batch || '',
    };

    setPeople([...people, newPerson]);

    setFormData({ name: '', phoneNumber: '', role: '', level: '' });
    setShowModal(false);
    setErrors({});
  };

  // Set up the form for editing an existing person
  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      phoneNumber: person.phoneNumber,
      role: person.role,
      level: ''
    });
    setShowEditModal(true);
    setErrors({});
  };

  // Handle form submission for editing a person
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerson) {
      const updatedPeople = people.map(p => 
        p.id === editingPerson.id 
          ? { ...p, name: formData.name, phoneNumber: formData.phoneNumber, role: formData.role }
          : p
      );
      setPeople(updatedPeople);
      setEditingPerson(null);
      setShowEditModal(false);
    }
  };

  // Show the delete confirmation modal
  const handleDelete = (personId: number) => {
    setPersonToDelete(personId);
    setShowDeleteConfirm(true);
  };

  // Perform the deletion after confirmation
  const confirmDelete = () => {
    if (personToDelete !== null) {
      const updatedPeople = people.filter(person => person.id !== personToDelete);
      setPeople(updatedPeople);
      setShowDeleteConfirm(false);
      setPersonToDelete(null);
    }
  };


  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => {
                setShowModal(true);
                setErrors({});
                setFormData({ name: '', phoneNumber: '', role: '', level: '' });
            }}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Add +
          </button>
        </div>
        
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
                {people.map((person: Person) => (
                  <tr key={person.id} className="border-b border-black/10 bg-white hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{person.name}</td>
                    <td className="py-3 px-4 text-gray-700">{person.phoneNumber}</td>
                    <td className="py-3 px-4 text-gray-700">{person.role}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(person)} className="text-blue-500 hover:text-blue-600 p-2" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(person.id)} className="text-red-500 hover:text-red-600 p-2" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Add Person
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
                disabled={formData.role !== 'Student'}
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
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors mt-4"
        >
          Add
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
        Edit Person
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
        >
          Update
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
                    <p className="text-gray-600 mb-6">Are you sure you want to delete this person? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4">
                        <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Yes, Delete
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