import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  userType?: 'student' | 'tutor' | 'admin';
  activeLink?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userType, activeLink }) => {
  const navigate = useNavigate();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Get user info from localStorage
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;

  const handleProfileClick = () => {
    setShowProfilePopup(true);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleChangePassword = () => {
    setShowProfilePopup(false);
    setShowPasswordPopup(true);
  };

  const handleUpdatePassword = () => {
    setError('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Get admin people data
    const adminPeopleData = localStorage.getItem('adminPeopleData');
    if (!adminPeopleData) {
      setError('User data not found');
      return;
    }
    
    const people = JSON.parse(adminPeopleData);
    
    // Find the current user
    const currentUser = people.find((person: any) => 
      person.name === user?.name && person.phoneNumber === user?.phoneNumber
    );
    
    if (!currentUser) {
      setError('User not found');
      return;
    }
    
    // Debug logging
    console.log('Current user:', currentUser);
    console.log('Current password entered:', currentPassword);
    console.log('User role:', currentUser.role);
    console.log('Password comparison:', currentPassword.toLowerCase(), '===', currentUser.role.toLowerCase());
    
    // Check if current password matches the user's role (current system)
    if (currentPassword.toLowerCase() !== currentUser.role.toLowerCase()) {
      setError(`Current password is incorrect. Expected: ${currentUser.role}, Got: ${currentPassword}`);
      return;
    }
    
    // Update the user's role to the new password
    currentUser.role = newPassword;
    localStorage.setItem('adminPeopleData', JSON.stringify(people));
    
    // Update userInfo in localStorage
    const updatedUserInfo = { ...user, role: newPassword };
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordPopup(false);
    setError('');
  };

  const handleCancel = () => {
    setShowProfilePopup(false);
    setShowPasswordPopup(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  // Back arrow handlers
  const handleBackFromProfile = () => {
    setShowProfilePopup(false);
  };
  const handleBackFromPassword = () => {
    setShowPasswordPopup(false);
    setShowProfilePopup(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <>
      <header className="bg-white backdrop-blur-lg border-b border-blue-100/40 shadow-md shadow-blue-100/20 px-6 py-4 flex items-center justify-between"> 
        {/* Left side - Back arrow */}
        <div className="flex items-center">
          <button
            onClick={handleBackClick}
            className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
            title="Go back"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        {/* Right side - Profile section */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{userType || 'User'}</p>
          </div>
          <button 
            onClick={handleProfileClick}
            className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Profile Popup */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Light overlay, not blocking sidebar/navbar */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" />
          <div className="relative z-10 w-96 max-w-md mx-4 pointer-events-auto">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              {/* Back Arrow */}
              <button
                onClick={handleBackFromProfile}
                className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 text-2xl font-bold"
                aria-label="Back"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profile</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={user?.phoneNumber || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Change Password
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Popup */}
      {showPasswordPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Light overlay, not blocking sidebar/navbar */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" />
          <div className="relative z-10 w-96 max-w-md mx-4 pointer-events-auto">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              {/* Back Arrow */}
              <button
                onClick={handleBackFromPassword}
                className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 text-2xl font-bold"
                aria-label="Back"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Change Password</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdatePassword}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Update
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 