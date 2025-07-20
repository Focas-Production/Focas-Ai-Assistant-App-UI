import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Student pages
import Login from '../pages/student/Login';
import Allocation from '../pages/student/Allocation';
import StudentDashboard from '../pages/student/Dashboard';
import AiAssistant from '../pages/student/AiAssistant';
import StudentSessions from '../pages/student/Sessions';
import ReportPage from '../pages/student/Report';
import StudentSidebar from '../pages/student/Sidebar'
// Tutor pages
import TutorSession from '../pages/tutor/Session';
import Sprint from '../pages/tutor/Sprint';
import TutorStudentDetails from '../pages/tutor/StudentDetails';
// Admin pages
import AdminSidebar from '../pages/admin/AdminSidebar';
import AdminLayout from '../pages/admin/AdminLayout';


const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />

      {/* Student Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/allocation" element={<Allocation />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/ai-assistant" element={<AiAssistant />} />
      <Route path="/student/sessions" element={<StudentSessions />} />
      <Route path="/student/report" element={<ReportPage />} />
      <Route path="/student/sidebar" element={<StudentSidebar />} />

      {/* Tutor Routes */}
      <Route path="/tutor/session" element={<TutorSession />} />
      <Route path="/tutor/sprint" element={<Sprint />} />
      <Route path="/tutor/student-details" element={<TutorStudentDetails />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />} />

      {/* Dev Comp Routes */}
      <Route path="/dev/admin-sidebar" element={<AdminSidebar />} />
    </Routes>

  </Router>
);

export default AppRoutes; 