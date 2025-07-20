import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Admin pages
import AdminLayout from '../pages/admin/AdminLayout';
// Tutor pages
import TutorLayout from '../pages/tutor/TutorLayout';
// Student pages
import StudentLayout from '../pages/student/StudentLayout';


const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />

      {/* Student Routes */}
      <Route path='/student' element={<StudentLayout />} />

      {/* Tutor Routes */}
      <Route path='/tutor' element={<TutorLayout />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout/>} />
    </Routes>

  </Router>
);

export default AppRoutes; 