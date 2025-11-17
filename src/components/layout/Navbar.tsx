// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface NavbarProps {
//   userType?: 'student' | 'tutor' | 'admin';
//   activeLink?: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ userType }) => {
//   const navigate = useNavigate();
//   const [showProfilePopup, setShowProfilePopup] = useState(false);
//   const [showPasswordPopup, setShowPasswordPopup] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');

//   // Get user info from localStorage
//   const userInfo = localStorage.getItem('userInfo');
//   const user = userInfo ? JSON.parse(userInfo) : null;

//   const handleProfileClick = () => {
//     setShowProfilePopup(true);
//   };

//   const handleBackClick = () => {
//     navigate(-1); // Go back to previous page
//   };

//   const handleChangePassword = () => {
//     setShowProfilePopup(false);
//     setShowPasswordPopup(true);
//   };

//   const handleUpdatePassword = () => {
//     setError('');
//     if (newPassword !== confirmPassword) {
//       setError('New passwords do not match');
//       return;
//     }
//     if (newPassword.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }
    
//     // Get admin people data
//     const adminPeopleData = localStorage.getItem('adminPeopleData');
//     if (!adminPeopleData) {
//       setError('User data not found');
//       return;
//     }

//     interface Person {
//       name: string;
//       phoneNumber: string;
//       role: string;
//     }

    
//     const people = JSON.parse(adminPeopleData);
    
//     // Find the current user
//     const currentUser = people.find((person: Person) => 
//       person.name === user?.name && person.phoneNumber === user?.phoneNumber
//     );
    
//     if (!currentUser) {
//       setError('User not found');
//       return;
//     }
    
//     // Debug logging
//     console.log('Current user:', currentUser);
//     console.log('Current password entered:', currentPassword);
//     console.log('User role:', currentUser.role);
//     console.log('Password comparison:', currentPassword.toLowerCase(), '===', currentUser.role.toLowerCase());
    
//     // Check if current password matches the user's role (current system)
//     if (currentPassword.toLowerCase() !== currentUser.role.toLowerCase()) {
//       setError(`Current password is incorrect. Expected: ${currentUser.role}, Got: ${currentPassword}`);
//       return;
//     }
    
//     // Update the user's role to the new password
//     currentUser.role = newPassword;
//     localStorage.setItem('adminPeopleData', JSON.stringify(people));
    
//     // Update userInfo in localStorage
//     const updatedUserInfo = { ...user, role: newPassword };
//     localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    
//     setCurrentPassword('');
//     setNewPassword('');
//     setConfirmPassword('');
//     setShowPasswordPopup(false);
//     setError('');
//   };

  



//   return (
//     <>
//       <header className="bg-white backdrop-blur-lg border-b border-blue-100/40 shadow-md shadow-blue-100/20 px-6 py-4 flex items-center justify-between"> 
//         {/* Left side - Back arrow */}
//         <div className="flex items-center">
//           <button
//             onClick={handleBackClick}
//             className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
//             title="Go back"
//           >
//             <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//         </div>
//         {/* Right side - Profile section */}
//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
//             <p className="text-xs text-gray-500 capitalize">{userType || 'User'}</p>
//           </div>
//           <button 
//             onClick={handleProfileClick}
//             className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
//           >
//             <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </button>
//         </div>
//       </header>

//       {/* Profile Popup */}
//       {showProfilePopup && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={() => setShowProfilePopup(false)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setShowProfilePopup(false)}
//               className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
//               Profile
//             </h2>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                 <input
//                   type="text"
//                   value={user?.name || ''}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                 <input
//                   type="text"
//                   value={user?.phone || ''}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={handleChangePassword}
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors"
//               >
//                 Change Password
//               </button>
              
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Password Change Popup */}
//       {showPasswordPopup && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={() => setShowPasswordPopup(false)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setShowPasswordPopup(false)}
//               className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
//               Change Password
//             </h2>

//             {error && (
//               <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//                 {error}
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
//                 <input
//                   type="password"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
//                   placeholder="Enter current password"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
//                 <input
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
//                   placeholder="Enter new password"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
//                   placeholder="Confirm new password"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={handleUpdatePassword}
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors"
//               >
//                 Update
//               </button>
              
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar; 

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api'; // Make sure this path is correct

interface NavbarProps {
  userType?: 'student' | 'tutor' | 'admin';
  activeLink?: string; 
}

const Navbar: React.FC<NavbarProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  // State to hold the user info object
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });
  
  // State for the editable name in the profile popup
  const [editableName, setEditableName] = useState(user?.name || '');
  // State for the editable phone number in the profile popup
  const [editablePhone, setEditablePhone] = useState(user?.phone || '');
  
  // States for the password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // States for handling success and error messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // When the user object changes, update the editable name and phone
  useEffect(() => {
    setEditableName(user?.name || '');
    setEditablePhone(user?.phone || '');
  }, [user]);

  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleProfileClick = () => {
    // Reset any previous messages when opening the popup
    setError('');
    setSuccess('');
    // Ensure the name and phone fields are up-to-date
    setEditableName(user?.name || '');
    setEditablePhone(user?.phone || '');
    setShowProfilePopup(true);
  };

  const handleOpenChangePassword = () => {
    setShowProfilePopup(false);
    // Reset fields and messages for the password popup
    setError('');
    setSuccess('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordPopup(true);
  };
  
  // --- NEW API-DRIVEN FUNCTIONS ---

  const handleUpdateProfile = async () => {
    if (!user || !editableName.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    
    if (editablePhone && editablePhone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      // Call the API to update the user's name and phone
      const updatedUserResponse = await apiService.editUser(user.id, { 
        name: editableName,
        phone: editablePhone 
      });
      
      // Update the user state and localStorage with the new info
      const newUserInfo = { 
        ...user, 
        name: updatedUserResponse.name || editableName,
        phone: updatedUserResponse.phone || editablePhone
      };
      setUser(newUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      
      // Explicitly update editableName and editablePhone to ensure they display correctly
      setEditableName(updatedUserResponse.name || editableName);
      setEditablePhone(updatedUserResponse.phone || editablePhone);
      
      setSuccess("Profile updated successfully!");
      // Close the popup after a short delay to show the success message
      setTimeout(() => setShowProfilePopup(false), 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    }
  };

  // Handle phone number input - only allow digits and limit to 10
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    // Limit to 10 digits
    if (digitsOnly.length <= 10) {
      setEditablePhone(digitsOnly);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;
    
    // Client-side validation
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // Call the secure backend API to change the password
      await apiService.changePassword({ currentPassword, newPassword });
      
      setSuccess("Password updated successfully!");
      // Close the popup after a short delay
      setTimeout(() => setShowPasswordPopup(false), 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password. Check current password.");
    }
  };

  return (
    <>
      <header className="bg-white backdrop-blur-lg border-b border-blue-100/40 shadow-md shadow-blue-100/20 px-6 py-4 flex items-center justify-between"> 
        <div className="flex items-center">
          <button onClick={handleBackClick} className="bg-blue-100 p-2 rounded-full hover:bg-blue-200">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{userType || 'User'}</p>
          </div>
          <button onClick={handleProfileClick} className="bg-blue-100 p-2 rounded-full hover:bg-blue-200">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </button>
        </div>
      </header>

      {/* Profile Popup */}
      {showProfilePopup && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" 
          onClick={(e) => {
            // Only close if clicking directly on the backdrop, not on child elements
            if (e.target === e.currentTarget) {
              setShowProfilePopup(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative" 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowProfilePopup(false)} 
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Profile</h2>
            
            {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            {success && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editablePhone}
                  onChange={handlePhoneChange}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white"
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
                {editablePhone && editablePhone.length !== 10 && (
                  <p className="text-xs text-red-600 mt-1">Phone number must be exactly 10 digits</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdateProfile} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl">Update Profile</button>
              <button onClick={handleOpenChangePassword} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl">Change Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Popup */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowPasswordPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPasswordPopup(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">×</button>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Change Password</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdatePassword} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl">Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;