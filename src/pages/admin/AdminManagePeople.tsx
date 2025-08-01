import React, { useState, useEffect } from 'react';

interface Person {
  id: number;
  name: string;
  phoneNumber: string;
  role: string;
}

const AdminManagePeople: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [showLevelOptions, setShowLevelOptions] = useState(false);
  const [showEditRoleOptions, setShowEditRoleOptions] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    role: '',
    level: ''
  });

  // Initialize people data from localStorage or use default data
  const [people, setPeople] = useState<Person[]>(() => {
    const savedPeople = localStorage.getItem('adminPeopleData');
    // if (savedPeople) {
    //   return JSON.parse(savedPeople);
    // }
    // return [
    //   { id: 1, name: 'AAA', phoneNumber: 'XXXX', role: 'Tutor' },
    //   // { id: 2, name: 'AAA', phoneNumber: 'XXXX', role: 'Student' },
    //   // { id: 3, name: 'AAA', phoneNumber: 'XXXX', role: 'Tutor' },
    //   // { id: 4, name: 'AAA', phoneNumber: 'XXXX', role: 'Student' },
    //   // { id: 5, name: 'AAA', phoneNumber: 'XXXX', role: 'Admin' },
    //   // { id: 6, name: 'AAA', phoneNumber: 'XXXX', role: 'Tutor' },
    // ];
    if (savedPeople) {
      return JSON.parse(savedPeople);
    }
    return [
      { id: 1, name: 'John Doe', phoneNumber: '1234567890', role: 'Tutor' }
    ];
    
  });

  // Save to localStorage whenever people data changes
  useEffect(() => {
    localStorage.setItem('adminPeopleData', JSON.stringify(people));
  }, [people]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new person entry
    const newPerson: Person = {
      id: Date.now(), // Use timestamp as unique ID
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      role: formData.role
    };

    // Add to people array
    setPeople([...people, newPerson]);

    // Reset form and close modal
    setFormData({ name: '', phoneNumber: '', role: '', level: '' });
    setShowModal(false);
    setShowRoleOptions(false);
    setShowLevelOptions(false);

    console.log('New person added:', newPerson);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      phoneNumber: person.phoneNumber,
      role: person.role,
      level: ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPerson) {
      // Update the person in the array
      const updatedPeople = people.map(person => 
        person.id === editingPerson.id 
          ? { ...person, name: formData.name, phoneNumber: formData.phoneNumber, role: formData.role }
          : person
      );
      
      setPeople(updatedPeople);
      
      // Reset and close modal
      setEditingPerson(null);
      setFormData({ name: '', phoneNumber: '', role: '', level: '' });
      setShowEditModal(false);
      setShowEditRoleOptions(false);
    }
  };

  const handleDelete = (personId: number) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      const updatedPeople = people.filter(person => person.id !== personId);
      setPeople(updatedPeople);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header with Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
          >
            Add +
          </button>
          
          {/* <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
            Export-CSV
          </button> */}
        </div>
        
        {/* Table Container */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
  <thead>
    <tr className="border-b border-white/30 bg-gray-100">
      <th className="w-1/4 text-left py-4 px-4 text-blue-900 font-semibold text-lg">Name</th>
      <th className="w-1/4 text-left py-3 px-4 text-blue-900 font-semibold text-lg">Phone Number</th>
      <th className="w-1/4 text-left py-3 px-4 text-blue-900 font-semibold text-lg">Role</th>
      <th className="w-1/4 text-left py-3 px-4 text-blue-900 font-semibold text-lg">Actions</th>
    </tr>
  </thead>
  <tbody>
    {people.map((person: Person) => (
      <tr key={person.id} className="border-b border-black/10 bg-white">
        <td className="w-1/4 py-3 px-4 font-medium text-gray-800">{person.name}</td>
        <td className="w-1/4 py-3 px-4 text-gray-700">{person.phoneNumber}</td>
        <td className="w-1/4 py-3 px-4 text-gray-700">{person.role}</td>
        <td className="w-1/4 py-3 px-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(person)}
              className="text-blue-500 hover:text-blue-600 p-2 transition-colors duration-200"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(person.id)}
              className="text-red-500 hover:text-red-600 p-2 transition-colors duration-200"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              
              {/* Close Button */}
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Add Person</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Enter the Name:"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  />
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                     type="tel"
                     placeholder="Enter the Phone number:"
                     value={formData.phoneNumber}
                     onChange={(e) => {
                       const input = e.target.value;
                       // Allow only digits and limit to 10 characters
                       if (/^\d{0,10}$/.test(input)) {
                         setFormData({ ...formData, phoneNumber: input });
                       }
                     }}
                     maxLength={10}
                     pattern="\d{10}"
                     title="Phone number must be 10 digits"
                     className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                     required
                  />
                </div>

                {/* Role and Level Selection */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Role Selection */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      placeholder="Select role"
                      value={formData.role}
                      onClick={() => setShowRoleOptions(!showRoleOptions)}
                      readOnly
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-white text-gray-800 cursor-pointer ${
                        showRoleOptions ? 'border-blue-600' : 'border-blue-600'
                      }`}
                      required
                    />
                    
                    {showRoleOptions && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-600 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          <div className="px-4 py-2 text-gray-400 cursor-default">Select role</div>
                          {['Admin', 'Tutor', 'Student'].map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => {
                                setFormData({...formData, role});
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

                  {/* Level Selection */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <input
                      type="text"
                      placeholder="Select level"
                      value={formData.level}
                      onClick={() => setShowLevelOptions(!showLevelOptions)}
                      readOnly
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-white text-gray-800 cursor-pointer ${
                        showLevelOptions ? 'border-blue-600' : 'border-blue-600'
                      }`}
                    />
                    {showLevelOptions && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-600 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          <div className="px-4 py-2 text-gray-400 cursor-default">Select level</div>
                          {['Foundation', 'Intermediate', 'Final', 'Null'].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => {
                                setFormData({...formData, level});
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-200"
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
              
              {/* Back Button */}
              <button 
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 left-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Person</h2>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                
                {/* Name Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Enter the Name:"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  />
                </div>

                {/* Phone Number Input */}
                <div>
                  <input
                    type="tel"
                    placeholder="Enter the Phone number:"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select role"
                    value={formData.role}
                    onClick={() => setShowEditRoleOptions(!showEditRoleOptions)}
                    readOnly
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-white text-gray-800 cursor-pointer ${
                      showEditRoleOptions ? 'border-blue-600' : 'border-gray-300'
                    }`}
                    required
                  />
                  {showEditRoleOptions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <div className="px-4 py-2 text-gray-400 cursor-default">Select role</div>
                        {['Admin', 'Tutor', 'Student'].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, role});
                              setShowEditRoleOptions(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
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
                  className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminManagePeople;
