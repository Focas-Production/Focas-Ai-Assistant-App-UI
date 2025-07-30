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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
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
                  <th className="text-left py-4 px-4 text-blue-900 font-semibold text-lg">Name</th>
                  <th className="text-left py-4 px-4 text-blue-900 font-semibold text-lg">Phone Number</th>
                  <th className="text-left py-4 px-4 text-blue-900 font-semibold text-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTutors.map((tutor, index) => (
                  <tr 
                    key={tutor.id} 
                    className="border-b border-gray-200 bg-white"
                  >
                    <td className="py-4 px-4 font-medium text-gray-800">
                      {tutor.name}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {tutor.phoneNumber}
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => handleViewTutor(tutor.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                      >
                        View
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TutorDetails;