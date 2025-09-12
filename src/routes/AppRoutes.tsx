import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
// Admin pages
import AdminLayout from '../pages/admin/AdminLayout';
// Tutor pages
import TutorLayout from '../pages/tutor/TutorLayout';
// Student pages
import StudentLayout from '../pages/student/StudentLayout';
// Auth pages
import LoginPage from '../pages/auth/Login';
// import SignUpPage from '../pages/auth/Signup';
import ForgetPasswordPage from '../pages/auth/ForgetPasswordPage';


const AppRoutes = () => (
  <Router>
    <Routes>
      
      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/signup" element={<SignUpPage />} /> */}
      <Route path="/forgot-password" element={<ForgetPasswordPage />} />

      {/* Student Routes */}
      <Route 
        path='/student/*' 
        element={
          <ProtectedRoute requiredRole="student">
            <StudentLayout />
          </ProtectedRoute>
        } 
      />

      {/* Tutor Routes */}
      <Route 
        path='/tutor/*' 
        element={
          <ProtectedRoute requiredRole="tutor">
            <TutorLayout />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        } 
      />
    </Routes>

  </Router>
);

export default AppRoutes; 