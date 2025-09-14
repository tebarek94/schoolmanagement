import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Award, Users, BookOpen, Calendar, Search, Edit, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Student {
  id: number;
  name: string;
  studentId: string;
  class: string;
  email: string;
}

interface Assignment {
  id: number;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  totalPoints: number;
  status: 'pending' | 'graded' | 'overdue';
  teacher_id?: number;
  teacher_name?: string;
}

interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  assignmentId: number;
  assignmentTitle: string;
  pointsEarned: number;
  totalPoints: number;
  grade: string;
  feedback: string;
  submittedDate: string;
}

export const TeacherGradingPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockStudents: Student[] = [
      { id: 1, name: 'John Smith', studentId: 'S001', class: 'Grade 10 Mathematics', email: 'john@school.com' },
      { id: 2, name: 'Sarah Johnson', studentId: 'S002', class: 'Grade 10 Mathematics', email: 'sarah@school.com' },
      { id: 3, name: 'Mike Brown', studentId: 'S003', class: 'Grade 11 Mathematics', email: 'mike@school.com' },
      { id: 4, name: 'Emily Davis', studentId: 'S004', class: 'Grade 10 Mathematics', email: 'emily@school.com' },
      { id: 5, name: 'David Wilson', studentId: 'S005', class: 'Grade 11 Mathematics', email: 'david@school.com' }
    ];

    const mockAssignments: Assignment[] = [
      { 
        id: 1, 
        title: 'Algebra Quiz 1', 
        subject: 'Mathematics', 
        class: 'Grade 10 Mathematics', 
        dueDate: '2024-01-15', 
        totalPoints: 100, 
        status: 'graded',
        teacher_id: user?.profile?.id || 1,
        teacher_name: user?.profile?.first_name + ' ' + user?.profile?.last_name || 'John Doe'
      },
      { 
        id: 2, 
        title: 'Calculus Assignment', 
        subject: 'Mathematics', 
        class: 'Grade 11 Mathematics', 
        dueDate: '2024-01-20', 
        totalPoints: 50, 
        status: 'pending',
        teacher_id: user?.profile?.id || 1,
        teacher_name: user?.profile?.first_name + ' ' + user?.profile?.last_name || 'John Doe'
      },
      { 
        id: 3, 
        title: 'Geometry Test', 
        subject: 'Mathematics', 
        class: 'Grade 10 Mathematics', 
        dueDate: '2024-01-25', 
        totalPoints: 100, 
        status: 'overdue',
        teacher_id: user?.profile?.id || 1,
        teacher_name: user?.profile?.first_name + ' ' + user?.profile?.last_name || 'John Doe'
      },
      { 
        id: 4, 
        title: 'Statistics Project', 
        subject: 'Mathematics', 
        class: 'Grade 11 Mathematics', 
        dueDate: '2024-02-01', 
        totalPoints: 75, 
        status: 'pending',
        teacher_id: 2, // Different teacher
        teacher_name: 'Jane Smith'
      },
      { 
        id: 5, 
        title: 'Physics Lab Report', 
        subject: 'Physics', 
        class: 'Grade 12 Physics', 
        dueDate: '2024-02-05', 
        totalPoints: 80, 
        status: 'pending',
        teacher_id: 3, // Different teacher
        teacher_name: 'Mike Johnson'
      }
    ];

    const mockGrades: Grade[] = [
      { id: 1, studentId: 1, studentName: 'John Smith', assignmentId: 1, assignmentTitle: 'Algebra Quiz 1', pointsEarned: 85, totalPoints: 100, grade: 'B+', feedback: 'Good work, but check your calculations', submittedDate: '2024-01-14' },
      { id: 2, studentId: 2, studentName: 'Sarah Johnson', assignmentId: 1, assignmentTitle: 'Algebra Quiz 1', pointsEarned: 92, totalPoints: 100, grade: 'A-', feedback: 'Excellent work!', submittedDate: '2024-01-14' },
      { id: 3, studentId: 4, studentName: 'Emily Davis', assignmentId: 1, assignmentTitle: 'Algebra Quiz 1', pointsEarned: 78, totalPoints: 100, grade: 'C+', feedback: 'Needs improvement in problem-solving', submittedDate: '2024-01-15' }
    ];

    // Filter assignments based on user role
    let filteredAssignments = mockAssignments;
    
    if (hasRole('teacher') && !hasRole('admin')) {
      // Teachers can only see their own assignments
      filteredAssignments = mockAssignments.filter(assignment => assignment.teacher_id === user?.profile?.id);
    }
    // Admins can see all assignments (no filtering needed)

    setTimeout(() => {
      setStudents(mockStudents);
      setAssignments(filteredAssignments);
      setGrades(mockGrades);
      setLoading(false);
    }, 1000);
  }, [user, hasRole]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const filteredAssignments = assignments.filter(assignment => 
    selectedClass === 'all' || assignment.class === selectedClass
  );

  const filteredGrades = grades.filter(grade => {
    const matchesAssignment = selectedAssignment === 'all' || grade.assignmentId.toString() === selectedAssignment;
    const matchesStudent = filteredStudents.some(student => student.id === grade.studentId);
    return matchesAssignment && matchesStudent;
  });

  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const overdueAssignments = assignments.filter(a => a.status === 'overdue').length;
  const totalStudents = filteredStudents.length;

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
            {hasRole('admin') ? 'All Assignments & Grades' : 'Grade Students'}
          </h1>
          <p className="text-gray-600">
            {hasRole('admin') 
              ? 'View and manage all assignments and grades across the school' 
              : 'Manage assignments and grade student submissions'
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {hasRole('admin') ? (
              <Shield className="h-6 w-6 text-blue-600" />
            ) : (
              <UserCheck className="h-6 w-6 text-green-600" />
            )}
            <span className="text-sm font-medium text-gray-500">
              {hasRole('admin') ? 'Admin View' : 'Teacher View'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-primary-600" />
            <span className="text-sm font-medium text-gray-500">
              {grades.length} Grades Recorded
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              In selected class
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Need grading
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grades.length}</div>
            <p className="text-xs text-muted-foreground">
              Completed grades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={[
                  { value: 'all', label: 'All Classes' },
                  { value: 'Grade 10 Mathematics', label: 'Grade 10 Mathematics' },
                  { value: 'Grade 11 Mathematics', label: 'Grade 11 Mathematics' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Assignment
              </label>
              <Select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                options={[
                  { value: 'all', label: 'All Assignments' },
                  ...filteredAssignments.map(assignment => ({
                    value: assignment.id.toString(),
                    label: assignment.title
                  }))
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            Manage and grade student assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Assignment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Class</th>
                  {hasRole('admin') && (
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Teacher</th>
                  )}
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                        {assignment.title}
                      </div>
                    </td>
                    <td className="py-3 px-4">{assignment.class}</td>
                    {hasRole('admin') && (
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                          {assignment.teacher_name}
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{assignment.totalPoints}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline" className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        Grade Students
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
          <CardDescription>
            View and manage student grades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Assignment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {grade.studentName}
                      </div>
                    </td>
                    <td className="py-3 px-4">{grade.assignmentTitle}</td>
                    <td className="py-3 px-4 font-medium">
                      {grade.pointsEarned}/{grade.totalPoints}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(grade.submittedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline" className="flex items-center">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Grade
                      </Button>
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
