import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleRoute } from './components/auth/RoleRoute';
import { Layout } from './components/layout/Layout';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/students/StudentsPage';
import { StudentDetailPage } from './pages/students/StudentDetailPage';
import { CreateStudentPage } from './pages/students/CreateStudentPage';
import { TeachersPage } from './pages/teachers/TeachersPage';
import { TeacherDetailPage } from './pages/teachers/TeacherDetailPage';
import { CreateTeacherPage } from './pages/teachers/CreateTeacherPage';
import { ParentsPage } from './pages/parents/ParentsPage';
import { ParentDetailPage } from './pages/parents/ParentDetailPage';
import { CreateParentPage } from './pages/parents/CreateParentPage';
import { ClassesPage } from './pages/academic/ClassesPage';
import { SubjectsPage } from './pages/academic/SubjectsPage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { ExamsPage } from './pages/exams/ExamsPage';
import { ExamDetailPage } from './pages/exams/ExamDetailPage';
import { CreateExamPage } from './pages/exams/CreateExamPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { PaymentDetailPage } from './pages/payments/PaymentDetailPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { GradesPage } from './pages/grades/GradesPage';
import { CoursesPage } from './pages/courses/CoursesPage';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherGradingPage } from './pages/teacher/TeacherGradingPage';
import { MyExamsPage } from './pages/student/MyExamsPage';
import { MyPaymentsPage } from './pages/student/MyPaymentsPage';
import { MyProgressPage } from './pages/student/MyProgressPage';

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        } 
      />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Students Management */}
        <Route path="students" element={<RoleRoute roles={['Admin', 'Teacher']}><StudentsPage /></RoleRoute>} />
        <Route path="students/create" element={<RoleRoute roles={['Admin']}><CreateStudentPage /></RoleRoute>} />
        <Route path="students/:id" element={<RoleRoute roles={['Admin', 'Teacher']}><StudentDetailPage /></RoleRoute>} />

        {/* Teachers Management */}
        <Route path="teachers" element={<RoleRoute roles={['Admin']}><TeachersPage /></RoleRoute>} />
        <Route path="teachers/create" element={<RoleRoute roles={['Admin']}><CreateTeacherPage /></RoleRoute>} />
        <Route path="teachers/:id" element={<RoleRoute roles={['Admin']}><TeacherDetailPage /></RoleRoute>} />

        {/* Parents Management */}
        <Route path="parents" element={<RoleRoute roles={['Admin', 'Teacher']}><ParentsPage /></RoleRoute>} />
        <Route path="parents/create" element={<RoleRoute roles={['Admin']}><CreateParentPage /></RoleRoute>} />
        <Route path="parents/:id" element={<RoleRoute roles={['Admin', 'Teacher']}><ParentDetailPage /></RoleRoute>} />

        {/* Academic Management */}
        <Route path="academic/classes" element={<RoleRoute roles={['Admin', 'Teacher']}><ClassesPage /></RoleRoute>} />
        <Route path="academic/subjects" element={<RoleRoute roles={['Admin', 'Teacher']}><SubjectsPage /></RoleRoute>} />

        {/* Student & Parent Access */}
        <Route path="grades" element={<RoleRoute roles={['Student', 'Parent']}><GradesPage /></RoleRoute>} />
        <Route path="courses" element={<RoleRoute roles={['Student', 'Parent']}><CoursesPage /></RoleRoute>} />
        <Route path="student/exams" element={<RoleRoute roles={['Student', 'Parent']}><MyExamsPage /></RoleRoute>} />
        <Route path="student/payments" element={<RoleRoute roles={['Student', 'Parent']}><MyPaymentsPage /></RoleRoute>} />
        <Route path="student/progress" element={<RoleRoute roles={['Student', 'Parent']}><MyProgressPage /></RoleRoute>} />

        {/* Teacher Access */}
        <Route path="teacher/classes" element={<RoleRoute roles={['Teacher']}><TeacherClassesPage /></RoleRoute>} />
        <Route path="teacher/grading" element={<RoleRoute roles={['Teacher']}><TeacherGradingPage /></RoleRoute>} />

        {/* Attendance */}
        <Route path="attendance" element={<RoleRoute roles={['Admin', 'Teacher']}><AttendancePage /></RoleRoute>} />

        {/* Exams */}
        <Route path="exams" element={<RoleRoute roles={['Admin', 'Teacher']}><ExamsPage /></RoleRoute>} />
        <Route path="exams/create" element={<RoleRoute roles={['Admin', 'Teacher']}><CreateExamPage /></RoleRoute>} />
        <Route path="exams/:id" element={<RoleRoute roles={['Admin', 'Teacher']}><ExamDetailPage /></RoleRoute>} />

        {/* Payments */}
        <Route path="payments" element={<RoleRoute roles={['Admin']}><PaymentsPage /></RoleRoute>} />
        <Route path="payments/:id" element={<RoleRoute roles={['Admin']}><PaymentDetailPage /></RoleRoute>} />

        {/* Reports */}
        <Route path="reports" element={<RoleRoute roles={['Admin', 'Teacher']}><ReportsPage /></RoleRoute>} />

        {/* Settings */}
        <Route path="settings" element={<RoleRoute roles={['Admin']}><SettingsPage /></RoleRoute>} />

        {/* Profile */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
