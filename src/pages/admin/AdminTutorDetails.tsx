import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Person {
  id: number;
  name: string;
  phoneNumber: string;
  role: string;
}

const TutorDetails = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Person | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phoneNumber: '' });

  // Load tutors from localStorage (filter only those with role "Tutor")
  useEffect(() => {
    const adminPeopleData = localStorage.getItem('adminPeopleData');
    if (adminPeopleData) {
      const allPeople: Person[] = JSON.parse(adminPeopleData);
      const tutorPeople = allPeople.filter(person => person.role.toLowerCase() === 'tutor');
      setTutors(tutorPeople);
    }
  }, []);

  const handleViewTutor = (tutorId: number) => {
    navigate(`/admin/tutor-view/${tutorId}`);
  };

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit button handler
  const handleEditTutor = (tutor: Person) => {
    setEditingTutor(tutor);
    setEditForm({ name: tutor.name, phoneNumber: tutor.phoneNumber });
    setShowEditModal(true);
  };

  // Edit form submit handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTutor) {
      const updatedTutors = tutors.map((tutor) =>
        tutor.id === editingTutor.id
          ? { ...tutor, name: editForm.name, phoneNumber: editForm.phoneNumber }
          : tutor
      );
      setTutors(updatedTutors);
      // Update localStorage
      const adminPeopleData = localStorage.getItem('adminPeopleData');
      if (adminPeopleData) {
        const allPeople: Person[] = JSON.parse(adminPeopleData);
        const updatedPeople = allPeople.map((person) =>
          person.id === editingTutor.id
            ? { ...person, name: editForm.name, phoneNumber: editForm.phoneNumber }
            : person
        );
        localStorage.setItem('adminPeopleData', JSON.stringify(updatedPeople));
      }
      setShowEditModal(false);
      setEditingTutor(null);
    }
  };

  // Delete button handler
  const handleDeleteTutor = (tutorId: number) => {
    if (window.confirm('Are you sure you want to delete this tutor?')) {
      const updatedTutors = tutors.filter((tutor) => tutor.id !== tutorId);
      setTutors(updatedTutors);
      // Update localStorage
      const adminPeopleData = localStorage.getItem('adminPeopleData');
      if (adminPeopleData) {
        const allPeople: Person[] = JSON.parse(adminPeopleData);
        const updatedPeople = allPeople.filter((person) => person.id !== tutorId);
        localStorage.setItem('adminPeopleData', JSON.stringify(updatedPeople));
      }
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header with Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Tutor"
              className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tutor's List */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-blue-900">Tutor's List:</h2>
        </div>

        {/* Table Container */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30 bg-gray-100">
                  <th className="w-1/4 text-left py-4 px-4 text-blue-900 font-semibold text-lg">Name</th>
                  <th className="w-1/4 text-left py-4 px-4 text-blue-900 font-semibold text-lg">Phone Number</th>
                  <th className="w-1/4 text-left py-4 px-4 text-blue-900 font-semibold text-lg">Status</th>
                  <th className="w-1/4 text-left py-4 px-4 text-blue-900 font-semibold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTutors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No matches found
                    </td>
                  </tr>
                ) : (
                  filteredTutors.map((tutor) => (
                    <tr key={tutor.id} className="border-b border-gray-200 bg-white">
                      <td className="w-1/4 py-4 px-4 font-medium text-gray-800">{tutor.name}</td>
                      <td className="w-1/4 py-4 px-4 text-gray-700">{tutor.phoneNumber}</td>
                      <td className="w-1/4 py-4 px-4">
                        <button
                          onClick={() => handleViewTutor(tutor.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        >
                          View
                        </button>
                      </td>
                      <td className="w-1/4 py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTutor(tutor)}
                            className="text-blue-500 hover:text-blue-600 p-2 transition-colors duration-200"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTutor(tutor.id)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingTutor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Edit Tutor</h2>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Enter the Name:"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter the Phone number:"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-200"
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

export default TutorDetails;