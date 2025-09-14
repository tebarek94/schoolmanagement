import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { School, Users, BookOpen, Award, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Class {
  id: number;
  name: string;
  subject: string;
  grade: string;
  room: string;
  schedule: string;
  students: number;
  assignments: number;
  exams: number;
  status: 'active' | 'completed' | 'upcoming';
}

export const TeacherClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockClasses: Class[] = [
      {
        id: 1,
        name: 'Grade 10 Mathematics',
        subject: 'Mathematics',
        grade: '10',
        room: 'Room 201',
        schedule: 'Mon, Wed, Fri 9:00-10:30 AM',
        students: 25,
        assignments: 5,
        exams: 2,
        status: 'active'
      },
      {
        id: 2,
        name: 'Grade 11 Mathematics',
        subject: 'Mathematics',
        grade: '11',
        room: 'Room 202',
        schedule: 'Tue, Thu 11:00-12:30 PM',
        students: 22,
        assignments: 3,
        exams: 1,
        status: 'active'
      },
      {
        id: 3,
        name: 'Grade 9 Mathematics',
        subject: 'Mathematics',
        grade: '9',
        room: 'Room 105',
        schedule: 'Mon, Wed 2:00-3:30 PM',
        students: 28,
        assignments: 8,
        exams: 3,
        status: 'active'
      },
      {
        id: 4,
        name: 'Grade 12 Advanced Math',
        subject: 'Advanced Mathematics',
        grade: '12',
        room: 'Room 301',
        schedule: 'Tue, Thu 1:00-2:30 PM',
        students: 18,
        assignments: 6,
        exams: 2,
        status: 'completed'
      },
      {
        id: 5,
        name: 'Grade 8 Mathematics',
        subject: 'Mathematics',
        grade: '8',
        room: 'Room 150',
        schedule: 'Mon, Wed, Fri 10:00-11:00 AM',
        students: 30,
        assignments: 4,
        exams: 2,
        status: 'upcoming'
      }
    ];

    setTimeout(() => {
      setClasses(mockClasses);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClasses = classes.filter(cls => 
    filter === 'all' || cls.status === filter
  );

  const activeClasses = classes.filter(cls => cls.status === 'active');
  const totalStudents = activeClasses.reduce((sum, cls) => sum + cls.students, 0);
  const totalAssignments = activeClasses.reduce((sum, cls) => sum + cls.assignments, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600">
            Manage your teaching classes and student progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <School className="h-6 w-6 text-primary-600" />
          <span className="text-sm font-medium text-gray-500">
            {activeClasses.length} Active Classes
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently teaching
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Active assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Finished classes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Classes ({classes.length})
        </Button>
        <Button
          variant={filter === 'active' ? 'primary' : 'outline'}
          onClick={() => setFilter('active')}
        >
          Active ({activeClasses.length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed ({classes.filter(c => c.status === 'completed').length})
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'primary' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming ({classes.filter(c => c.status === 'upcoming').length})
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {cls.subject} - Grade {cls.grade}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(cls.status)}>
                  {cls.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <School className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Room:</span>
                  <span className="ml-1">{cls.room}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Schedule:</span>
                  <span className="ml-1">{cls.schedule}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Students:</span>
                  <span className="ml-1">{cls.students}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-sm">
                  <span className="font-medium">{cls.assignments}</span> assignments
                </div>
                <div className="text-sm text-gray-500">
                  {cls.exams} exams
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">
                  View Students
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Grade Assignments
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <School className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No classes are currently assigned to you.' 
                : `No ${filter} classes found.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
