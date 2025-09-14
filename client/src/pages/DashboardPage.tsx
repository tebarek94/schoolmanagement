import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  School, 
  Calendar, 
  FileText, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { studentService } from '../services/studentService';
import { examService } from '../services/examService';
import { attendanceService } from '../services/attendanceService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DashboardStats, ExamResult, Attendance } from '../types';
import { formatNumber, formatDate } from '../utils/helpers';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface StudentProgressData {
  overallGPA: number;
  attendancePercentage: number;
  totalExams: number;
  upcomingExams: number;
  assignmentsDue: number;
  subjectPerformance: {
    subject: string;
    averageScore: number;
    totalExams: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  recentActivity: {
    type: 'exam' | 'attendance' | 'assignment';
    title: string;
    date: string;
    status: 'completed' | 'pending' | 'overdue';
  }[];
}

interface TeacherProgressData {
  totalClasses: number;
  totalStudents: number;
  pendingGrading: number;
  upcomingExams: number;
  classPerformance: {
    className: string;
    subject: string;
    studentCount: number;
    averageGrade: number;
    attendanceRate: number;
  }[];
  recentActivity: {
    type: 'grading' | 'attendance' | 'exam' | 'assignment';
    title: string;
    date: string;
    status: 'completed' | 'pending' | 'overdue';
  }[];
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  return (
    <Card className="stats-card">
      <CardHeader className="stats-card-header">
        <CardTitle className="stats-card-title">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="stats-card-content">{formatNumber(value)}</div>
        {change !== undefined && (
          <div className="flex items-center text-xs">
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
            )}
            <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(change)}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const DashboardPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgressData | null>(null);
  const [teacherProgress, setTeacherProgress] = useState<TeacherProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch different stats based on user role
        if (hasRole('admin')) {
          const response = await studentService.getStudentStats();
          setStats(response.data || null);
        } else if (hasRole('teacher') && user?.profile && 'id' in user.profile) {
          // Fetch teacher progress data
          await fetchTeacherProgress(user.profile.id);
        } else if (hasRole('student') && user?.profile && 'id' in user.profile) {
          // Fetch student progress data
          await fetchStudentProgress(user.profile.id);
        } else {
          // For parents, we'll use mock data for now
          setStats({
            total_students: 0,
            total_teachers: 0,
            total_parents: 0,
            total_classes: 0,
            attendance_today: 0,
            pending_payments: 0,
            upcoming_exams: 0,
            total_subjects: 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [hasRole, user]);

  const fetchStudentProgress = async (studentId: number) => {
    try {
      // Fetch exam results
      const examResponse = await examService.getResultsByStudent(studentId);
      const examResults = examResponse.data || [];
      
      // Fetch attendance records
      const attendanceResponse = await attendanceService.getStudentAttendance(studentId);
      const attendance = attendanceResponse.data || [];
      
      // Calculate overall GPA
      const overallGPA = calculateGPA(examResults);
      
      // Calculate attendance percentage
      const attendancePercentage = calculateAttendancePercentage(attendance);
      
      // Calculate subject performance
      const subjectPerformance = calculateSubjectPerformance(examResults);
      
      // Generate recent activity
      const recentActivity = generateRecentActivity(examResults, attendance);
      
      setStudentProgress({
        overallGPA,
        attendancePercentage,
        totalExams: examResults.length,
        upcomingExams: 2, // Mock data for now
        assignmentsDue: 3, // Mock data for now
        subjectPerformance,
        recentActivity
      });
    } catch (error) {
      console.error('Failed to fetch student progress:', error);
    }
  };

  const calculateGPA = (examResults: ExamResult[]) => {
    if (examResults.length === 0) return 0;
    
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };

    const totalPoints = examResults.reduce((sum, result) => {
      return sum + (gradePoints[result.grade || 'F'] || 0);
    }, 0);
    
    return examResults.length > 0 ? totalPoints / examResults.length : 0;
  };

  const calculateAttendancePercentage = (attendance: Attendance[]) => {
    if (attendance.length === 0) return 0;
    
    const presentDays = attendance.filter(record => record.status === 'Present').length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  const calculateSubjectPerformance = (examResults: ExamResult[]) => {
    const subjectMap = new Map<string, { scores: number[], exams: number }>();
    
    examResults.forEach(result => {
      if (result.subject_name) {
        const existing = subjectMap.get(result.subject_name) || { scores: [], exams: 0 };
        const percentage = result.total_marks ? (result.marks_obtained / result.total_marks) * 100 : 0;
        existing.scores.push(percentage);
        existing.exams += 1;
        subjectMap.set(result.subject_name, existing);
      }
    });
    
    return Array.from(subjectMap.entries()).map(([subject, data]) => {
      const averageScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
      const trend: 'up' | 'down' | 'stable' = data.scores.length >= 2 ? 
        (data.scores[data.scores.length - 1] > data.scores[data.scores.length - 2] ? 'up' : 'down') : 
        'stable';
      
      return {
        subject,
        averageScore: Math.round(averageScore),
        totalExams: data.exams,
        trend
      };
    });
  };

  const generateRecentActivity = (examResults: ExamResult[], attendance: Attendance[]) => {
    const activities: StudentProgressData['recentActivity'] = [];
    
    // Add recent exam results
    examResults.slice(0, 3).forEach(result => {
      activities.push({
        type: 'exam',
        title: `${result.exam_title} - ${result.subject_name}`,
        date: result.created_at,
        status: 'completed'
      });
    });
    
    // Add recent attendance
    attendance.slice(0, 2).forEach(record => {
      activities.push({
        type: 'attendance',
        title: `Attendance - ${record.section_name}`,
        date: record.date,
        status: record.status === 'Present' ? 'completed' : 'pending'
      });
    });
    
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  };

  const fetchTeacherProgress = async (teacherId: number) => {
    try {
      // For now, we'll use mock data. In a real implementation, you would:
      // 1. Fetch teacher's classes from academicService
      // 2. Fetch student data for each class
      // 3. Fetch exam results and attendance data
      // 4. Calculate performance metrics
      
      const mockTeacherProgress: TeacherProgressData = {
        totalClasses: 4,
        totalStudents: 95,
        pendingGrading: 12,
        upcomingExams: 3,
        classPerformance: [
          {
            className: 'Grade 10 Mathematics',
            subject: 'Mathematics',
            studentCount: 25,
            averageGrade: 78.5,
            attendanceRate: 92
          },
          {
            className: 'Grade 11 Mathematics',
            subject: 'Mathematics',
            studentCount: 22,
            averageGrade: 82.3,
            attendanceRate: 88
          },
          {
            className: 'Grade 9 Mathematics',
            subject: 'Mathematics',
            studentCount: 28,
            averageGrade: 75.8,
            attendanceRate: 95
          },
          {
            className: 'Grade 12 Advanced Math',
            subject: 'Advanced Mathematics',
            studentCount: 18,
            averageGrade: 85.2,
            attendanceRate: 90
          }
        ],
        recentActivity: [
          {
            type: 'grading',
            title: 'Algebra Quiz 1 - Grade 10',
            date: new Date().toISOString(),
            status: 'completed'
          },
          {
            type: 'attendance',
            title: 'Grade 11 Mathematics Attendance',
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed'
          },
          {
            type: 'exam',
            title: 'Calculus Test - Grade 12',
            date: new Date(Date.now() - 172800000).toISOString(),
            status: 'pending'
          },
          {
            type: 'assignment',
            title: 'Geometry Assignment - Grade 9',
            date: new Date(Date.now() - 259200000).toISOString(),
            status: 'overdue'
          }
        ]
      };

      setTeacherProgress(mockTeacherProgress);
    } catch (error) {
      console.error('Failed to fetch teacher progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getWelcomeMessage = () => {
    const name = user?.profile ? 
      `${user.profile.first_name} ${user.profile.last_name}` : 
      user?.email;
    
    const role = user?.role?.toLowerCase();
    return `Welcome back, ${name}! Here's what's happening in your ${role} dashboard.`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">{getWelcomeMessage()}</p>
      </div>

      {/* Stats Grid - Role Specific */}
      {hasRole('admin') ? (
        // Admin Stats
        <div className="stats-grid">
          <StatCard
            title="Total Students"
            value={stats?.total_students || 0}
            change={5}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Teachers"
            value={stats?.total_teachers || 0}
            change={2}
            icon={GraduationCap}
            color="bg-green-500"
          />
          <StatCard
            title="Total Parents"
            value={stats?.total_parents || 0}
            change={8}
            icon={UserCheck}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Classes"
            value={stats?.total_classes || 0}
            change={0}
            icon={School}
            color="bg-orange-500"
          />
        </div>
      ) : hasRole('teacher') && teacherProgress ? (
        // Teacher Stats
        <div className="stats-grid">
          <StatCard
            title="My Classes"
            value={teacherProgress.totalClasses}
            icon={School}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Students"
            value={teacherProgress.totalStudents}
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            title="Pending Grading"
            value={teacherProgress.pendingGrading}
            icon={Award}
            color="bg-orange-500"
          />
          <StatCard
            title="Upcoming Exams"
            value={teacherProgress.upcomingExams}
            icon={FileText}
            color="bg-purple-500"
          />
        </div>
      ) : (
        // Student/Parent Stats
        <div className="stats-grid">
          {hasRole('student') && studentProgress ? (
            <>
              <StatCard
                title="Overall GPA"
                value={studentProgress.overallGPA}
                icon={Award}
                color="bg-green-500"
              />
              <StatCard
                title="Attendance"
                value={studentProgress.attendancePercentage}
                icon={CheckCircle}
                color="bg-blue-500"
              />
              <StatCard
                title="Total Exams"
                value={studentProgress.totalExams}
                icon={BookOpen}
                color="bg-purple-500"
              />
              <StatCard
                title="Upcoming Exams"
                value={studentProgress.upcomingExams}
                icon={FileText}
                color="bg-orange-500"
              />
            </>
          ) : (
            <>
              <StatCard
                title="My Grades"
                value={4}
                change={12}
                icon={TrendingUp}
                color="bg-green-500"
              />
              <StatCard
                title="Active Courses"
                value={3}
                change={0}
                icon={School}
                color="bg-blue-500"
              />
              <StatCard
                title="Upcoming Exams"
                value={2}
                change={-1}
                icon={FileText}
                color="bg-purple-500"
              />
              <StatCard
                title="Assignments Due"
                value={5}
                change={2}
                icon={Calendar}
                color="bg-orange-500"
              />
            </>
          )}
        </div>
      )}

      {/* Additional Stats for Admin */}
      {hasRole('admin') && (
        <div className="stats-grid">
          <StatCard
            title="Today's Attendance"
            value={stats?.attendance_today || 0}
            icon={Calendar}
            color="bg-indigo-500"
          />
          <StatCard
            title="Pending Payments"
            value={stats?.pending_payments || 0}
            icon={CreditCard}
            color="bg-red-500"
          />
          <StatCard
            title="Upcoming Exams"
            value={stats?.upcoming_exams || 0}
            icon={FileText}
            color="bg-yellow-500"
          />
          <StatCard
            title="Total Subjects"
            value={stats?.total_subjects || 0}
            icon={Activity}
            color="bg-pink-500"
          />
        </div>
      )}

      {/* Student Progress Charts */}
      {hasRole('student') && studentProgress && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentProgress.subjectPerformance.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                        <p className="text-sm text-gray-500">{subject.totalExams} exams</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{subject.averageScore}%</p>
                        <div className="flex items-center justify-end">
                          {subject.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                          {subject.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                          {subject.trend === 'stable' && <Activity className="w-4 h-4 text-gray-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {studentProgress.subjectPerformance.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No exam results found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentProgress.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'exam' && <Award className="w-4 h-4 text-blue-500" />}
                      {activity.type === 'attendance' && <Calendar className="w-4 h-4 text-green-500" />}
                      {activity.type === 'assignment' && <BookOpen className="w-4 h-4 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {activity.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {activity.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {activity.status === 'overdue' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                ))}
                {studentProgress.recentActivity.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teacher Progress Charts */}
      {hasRole('teacher') && teacherProgress && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Class Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherProgress.classPerformance.map((classData, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <School className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{classData.className}</h3>
                        <p className="text-sm text-gray-500">{classData.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{classData.studentCount} students</p>
                        <p className="text-xs text-gray-500">Enrolled</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{classData.averageGrade}%</p>
                        <p className="text-xs text-gray-500">Avg Grade</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{classData.attendanceRate}%</p>
                        <p className="text-xs text-gray-500">Attendance</p>
                      </div>
                    </div>
                  </div>
                ))}
                {teacherProgress.classPerformance.length === 0 && (
                  <div className="text-center py-8">
                    <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No classes assigned</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherProgress.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'grading' && <Award className="w-4 h-4 text-blue-500" />}
                      {activity.type === 'attendance' && <Calendar className="w-4 h-4 text-green-500" />}
                      {activity.type === 'exam' && <FileText className="w-4 h-4 text-purple-500" />}
                      {activity.type === 'assignment' && <BookOpen className="w-4 h-4 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {activity.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {activity.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {activity.status === 'overdue' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                ))}
                {teacherProgress.recentActivity.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions - Role Specific */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hasRole('admin') ? (
          // Admin Quick Actions
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Manage student records, enrollment, and academic progress.
                </p>
                <div className="space-y-2">
                  <a href="/students" className="block text-sm text-primary-600 hover:text-primary-700">
                    View All Students →
                  </a>
                  <a href="/students/create" className="block text-sm text-primary-600 hover:text-primary-700">
                    Add New Student →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Mark and track student attendance records.
                </p>
                <div className="space-y-2">
                  <a href="/attendance" className="block text-sm text-primary-600 hover:text-primary-700">
                    Mark Attendance →
                  </a>
                  <a href="/attendance" className="block text-sm text-primary-600 hover:text-primary-700">
                    View Reports →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-500" />
                  Exams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Create exams, enter results, and generate report cards.
                </p>
                <div className="space-y-2">
                  <a href="/exams" className="block text-sm text-primary-600 hover:text-primary-700">
                    View Exams →
                  </a>
                  <a href="/exams/create" className="block text-sm text-primary-600 hover:text-primary-700">
                    Create Exam →
                  </a>
                </div>
              </CardContent>
            </Card>
          </>
        ) : hasRole('teacher') ? (
          // Teacher Quick Actions
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="w-5 h-5 mr-2 text-blue-500" />
                  My Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Manage your teaching classes and student progress.
                </p>
                <div className="space-y-2">
                  <a href="/teacher/classes" className="block text-sm text-primary-600 hover:text-primary-700">
                    View My Classes →
                  </a>
                  <a href="/teacher/grading" className="block text-sm text-primary-600 hover:text-primary-700">
                    Grade Students →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Mark and track student attendance for your classes.
                </p>
                <div className="space-y-2">
                  <a href="/attendance" className="block text-sm text-primary-600 hover:text-primary-700">
                    Mark Attendance →
                  </a>
                  <a href="/attendance" className="block text-sm text-primary-600 hover:text-primary-700">
                    View Reports →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-500" />
                  Exams & Grading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Create exams, enter results, and manage grades.
                </p>
                <div className="space-y-2">
                  <a href="/exams" className="block text-sm text-primary-600 hover:text-primary-700">
                    View Exams →
                  </a>
                  <a href="/exams/create" className="block text-sm text-primary-600 hover:text-primary-700">
                    Create Exam →
                  </a>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Student/Parent Quick Actions
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  My Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  View your academic performance and grade history.
                </p>
                <div className="space-y-2">
                  <a href="/grades" className="block text-sm text-primary-600 hover:text-primary-700">
                    View All Grades →
                  </a>
                  <a href="/student/progress" className="block text-sm text-primary-600 hover:text-primary-700">
                    View Progress →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="w-5 h-5 mr-2 text-blue-500" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  View your enrolled courses and schedules.
                </p>
                <div className="space-y-2">
                  <a href="/courses" className="block text-sm text-primary-600 hover:text-primary-700">
                    View All Courses →
                  </a>
                  <a href="/student/exams" className="block text-sm text-primary-600 hover:text-primary-700">
                    My Exams →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Track your assignments and upcoming deadlines.
                </p>
                <div className="space-y-2">
                  <a href="/student/exams" className="block text-sm text-primary-600 hover:text-primary-700">
                    View Assignments →
                  </a>
                  <a href="/student/payments" className="block text-sm text-primary-600 hover:text-primary-700">
                    My Payments →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                  My Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Track your academic progress and performance.
                </p>
                <div className="space-y-2">
                  <a href="/student/progress" className="block text-sm text-primary-600 hover:text-primary-700">
                    View Progress →
                  </a>
                  <a href="/student/exams" className="block text-sm text-primary-600 hover:text-primary-700">
                    Exam Results →
                  </a>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity - Role Specific */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hasRole('admin') || hasRole('teacher') ? (
              // Admin/Teacher Activity
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New student enrolled in Grade 5A</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Attendance marked for Grade 3B</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Exam results uploaded for Mathematics</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </>
            ) : (
              // Student/Parent Activity
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New grade posted for Mathematics</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Assignment submitted for English</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New course material uploaded</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
