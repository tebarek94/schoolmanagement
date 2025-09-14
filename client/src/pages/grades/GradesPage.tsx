import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Award, TrendingUp, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Grade {
  id: number;
  subject: string;
  exam: string;
  grade: string;
  percentage: number;
  date: string;
  teacher: string;
}

export const GradesPage: React.FC = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockGrades: Grade[] = [
      {
        id: 1,
        subject: 'Mathematics',
        exam: 'Midterm Exam',
        grade: 'A',
        percentage: 92,
        date: '2024-01-15',
        teacher: 'Mr. Smith'
      },
      {
        id: 2,
        subject: 'English',
        exam: 'Final Exam',
        grade: 'B+',
        percentage: 87,
        date: '2024-01-20',
        teacher: 'Ms. Johnson'
      },
      {
        id: 3,
        subject: 'Science',
        exam: 'Quiz 1',
        grade: 'A-',
        percentage: 90,
        date: '2024-01-25',
        teacher: 'Dr. Brown'
      },
      {
        id: 4,
        subject: 'History',
        exam: 'Assignment',
        grade: 'B',
        percentage: 85,
        date: '2024-01-30',
        teacher: 'Prof. Wilson'
      }
    ];

    setTimeout(() => {
      setGrades(mockGrades);
      setLoading(false);
    }, 1000);
  }, []);

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

  const calculateGPA = () => {
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };

    const totalPoints = grades.reduce((sum, grade) => sum + (gradePoints[grade.grade] || 0), 0);
    return grades.length > 0 ? (totalPoints / grades.length).toFixed(2) : '0.00';
  };

  const getAveragePercentage = () => {
    const total = grades.reduce((sum, grade) => sum + grade.percentage, 0);
    return grades.length > 0 ? (total / grades.length).toFixed(1) : '0.0';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'Parent' ? 'Child\'s Grades' : 'My Grades'}
          </h1>
          <p className="text-gray-600">
            View and track your academic performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="h-6 w-6 text-primary-600" />
          <span className="text-sm font-medium text-gray-500">GPA: {calculateGPA()}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateGPA()}</div>
            <p className="text-xs text-muted-foreground">
              Based on {grades.length} grades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAveragePercentage()}%</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grades.length}</div>
            <p className="text-xs text-muted-foreground">
              Grades recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Grades</CardTitle>
          <CardDescription>
            Your latest academic performance across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Exam</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Teacher</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                        {grade.subject}
                      </div>
                    </td>
                    <td className="py-3 px-4">{grade.exam}</td>
                    <td className="py-3 px-4">
                      <Badge className={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{grade.percentage}%</td>
                    <td className="py-3 px-4">{grade.teacher}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(grade.date).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

