import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  BookOpen, 
  Calendar, 
  BarChart3,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  School
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { examService } from '../../services/examService';
import { attendanceService } from '../../services/attendanceService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { ExamResult, Attendance, ApiResponse } from '../../types';
import { formatDate } from '../../utils/helpers';

interface ProgressData {
  examResults: ExamResult[];
  attendance: Attendance[];
  overallGPA: number;
  attendancePercentage: number;
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

export const MyProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('this_term');

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        
        if (user?.profile && 'id' in user.profile) {
          // Fetch exam results
          const examResponse: ApiResponse<ExamResult[]> = await examService.getResultsByStudent(user.profile.id);
          const examResults = examResponse.data || [];
          
          // Fetch attendance records
          const attendanceResponse: ApiResponse<Attendance[]> = await attendanceService.getStudentAttendance(user.profile.id);
          const attendance = attendanceResponse.data || [];
          
          // Calculate overall GPA
          const overallGPA = calculateGPA(examResults);
          
          // Calculate attendance percentage
          const attendancePercentage = calculateAttendancePercentage(attendance);
          
          // Calculate subject performance
          const subjectPerformance = calculateSubjectPerformance(examResults);
          
          // Generate recent activity
          const recentActivity = generateRecentActivity(examResults, attendance);
          
          setProgressData({
            examResults,
            attendance,
            overallGPA,
            attendancePercentage,
            subjectPerformance,
            recentActivity
          });
        }
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user, selectedPeriod]);

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
    const activities: ProgressData['recentActivity'] = [];
    
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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return 'bg-green-100 text-green-800';
      case 'A-':
      case 'B+':
        return 'bg-blue-100 text-blue-800';
      case 'B':
      case 'B-':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
      case 'C+':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <Award className="w-4 h-4 text-blue-500" />;
      case 'attendance':
        return <Calendar className="w-4 h-4 text-green-500" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No progress data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
          <p className="text-gray-600 mt-2">Track your academic performance and progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={[
              { value: 'this_term', label: 'This Term' },
              { value: 'this_year', label: 'This Year' },
              { value: 'all_time', label: 'All Time' }
            ]}
          />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall GPA</p>
                <p className="text-2xl font-bold text-blue-600">{progressData.overallGPA.toFixed(2)}</p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-green-600">{progressData.attendancePercentage}%</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-purple-600">{progressData.examResults.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-orange-600">{progressData.subjectPerformance.length}</p>
              </div>
              <School className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

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
              {progressData.subjectPerformance.map((subject, index) => (
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
                        {getTrendIcon(subject.trend)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              {progressData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
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
                    {getActivityStatusIcon(activity.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exam Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Recent Exam Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progressData.examResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">Subject</th>
                    <th className="table-head">Exam</th>
                    <th className="table-head">Score</th>
                    <th className="table-head">Grade</th>
                    <th className="table-head">Date</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {progressData.examResults.slice(0, 10).map((result) => (
                    <tr key={result.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                          {result.subject_name}
                        </div>
                      </td>
                      <td className="table-cell">{result.exam_title}</td>
                      <td className="table-cell">
                        <span className="font-medium">
                          {result.marks_obtained}/{result.total_marks}
                        </span>
                        <div className="text-sm text-gray-500">
                          {result.total_marks ? Math.round((result.marks_obtained / result.total_marks) * 100) : 0}%
                        </div>
                      </td>
                      <td className="table-cell">
                        {result.grade && (
                          <Badge className={getGradeColor(result.grade)}>
                            {result.grade}
                          </Badge>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(result.created_at)}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          {result.marks_obtained && result.total_marks ? (
                            (result.marks_obtained / result.total_marks) * 100 >= 50 ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                            )
                          ) : null}
                          <span className="text-sm">
                            {result.marks_obtained && result.total_marks ? (
                              (result.marks_obtained / result.total_marks) * 100 >= 50 ? 'Passed' : 'Failed'
                            ) : 'Pending'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No exam results found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
