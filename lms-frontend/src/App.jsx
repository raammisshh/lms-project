import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Learn from './pages/Learn.jsx';
import InstructorDashboard from './pages/InstructorDashboard.jsx';
import ManageLessons from './pages/ManageLessons.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/my-courses" element={<ProtectedRoute roles={['STUDENT']}><MyCourses /></ProtectedRoute>} />
          <Route path="/learn/:id" element={<ProtectedRoute roles={['STUDENT']}><Learn /></ProtectedRoute>} />
          <Route path="/instructor" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses/:id/lessons" element={<ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}><ManageLessons /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}
