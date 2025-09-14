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
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { studentService } from '../services/studentService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { DashboardStats } from '../types';
import { formatNumber } from '../utils/helpers';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch different stats based on user role
        if (hasRole('admin') || hasRole('teacher')) {
          const response = await studentService.getStudentStats();
          setStats(response.data || null);
        } else {
          // For students and parents, we'll use mock data for now
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
  }, [hasRole]);

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
      {hasRole('admin') || hasRole('teacher') ? (
        // Admin/Teacher Stats
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
      ) : (
        // Student/Parent Stats
        <div className="stats-grid">
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

      {/* Quick Actions - Role Specific */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hasRole('admin') || hasRole('teacher') ? (
          // Admin/Teacher Quick Actions
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
                  {hasRole('admin') && (
                    <a href="/students/create" className="block text-sm text-primary-600 hover:text-primary-700">
                      Add New Student →
                    </a>
                  )}
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
