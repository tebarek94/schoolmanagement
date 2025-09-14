import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BookOpen, Clock, User, Calendar, FileText, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Course {
  id: number;
  name: string;
  code: string;
  teacher: string;
  schedule: string;
  room: string;
  credits: number;
  status: 'active' | 'completed' | 'upcoming';
  description: string;
  assignments: number;
  exams: number;
}

export const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockCourses: Course[] = [
      {
        id: 1,
        name: 'Advanced Mathematics',
        code: 'MATH-301',
        teacher: 'Mr. Smith',
        schedule: 'Mon, Wed, Fri 9:00-10:30 AM',
        room: 'Room 201',
        credits: 3,
        status: 'active',
        description: 'Advanced calculus and linear algebra concepts',
        assignments: 5,
        exams: 2
      },
      {
        id: 2,
        name: 'English Literature',
        code: 'ENG-201',
        teacher: 'Ms. Johnson',
        schedule: 'Tue, Thu 11:00-12:30 PM',
        room: 'Room 105',
        credits: 3,
        status: 'active',
        description: 'Study of classic and modern literature',
        assignments: 3,
        exams: 1
      },
      {
        id: 3,
        name: 'Computer Science',
        code: 'CS-401',
        teacher: 'Dr. Brown',
        schedule: 'Mon, Wed 2:00-3:30 PM',
        room: 'Lab 301',
        credits: 4,
        status: 'active',
        description: 'Advanced programming and algorithms',
        assignments: 8,
        exams: 3
      },
      {
        id: 4,
        name: 'Physics',
        code: 'PHY-201',
        teacher: 'Prof. Wilson',
        schedule: 'Tue, Thu 1:00-2:30 PM',
        room: 'Lab 205',
        credits: 4,
        status: 'completed',
        description: 'Mechanics and thermodynamics',
        assignments: 6,
        exams: 2
      },
      {
        id: 5,
        name: 'History',
        code: 'HIS-101',
        teacher: 'Dr. Davis',
        schedule: 'Mon, Wed, Fri 10:00-11:00 AM',
        room: 'Room 150',
        credits: 3,
        status: 'upcoming',
        description: 'World history from ancient to modern times',
        assignments: 4,
        exams: 2
      }
    ];

    setTimeout(() => {
      setCourses(mockCourses);
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

  const filteredCourses = courses.filter(course => 
    filter === 'all' || course.status === filter
  );

  const activeCourses = courses.filter(course => course.status === 'active');
  const completedCourses = courses.filter(course => course.status === 'completed');
  const totalCredits = activeCourses.reduce((sum, course) => sum + course.credits, 0);

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
            {user?.role === 'Parent' ? 'Child\'s Courses' : 'My Courses'}
          </h1>
          <p className="text-gray-600">
            View your enrolled courses and academic schedule
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary-600" />
          <span className="text-sm font-medium text-gray-500">
            {totalCredits} Credits This Semester
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              Finished courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits}</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter(c => c.status === 'upcoming').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Next semester
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
          All Courses ({courses.length})
        </Button>
        <Button
          variant={filter === 'active' ? 'primary' : 'outline'}
          onClick={() => setFilter('active')}
        >
          Active ({activeCourses.length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCourses.length})
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'primary' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming ({courses.filter(c => c.status === 'upcoming').length})
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {course.code}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(course.status)}>
                  {course.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Teacher:</span>
                  <span className="ml-1">{course.teacher}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Schedule:</span>
                  <span className="ml-1">{course.schedule}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Room:</span>
                  <span className="ml-1">{course.room}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-sm">
                  <span className="font-medium">{course.credits}</span> credits
                </div>
                <div className="text-sm text-gray-500">
                  {course.assignments} assignments, {course.exams} exams
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No courses are currently available.' 
                : `No ${filter} courses found.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
