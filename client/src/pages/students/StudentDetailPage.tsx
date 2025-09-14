import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  User, 
  Calendar, 
  BookOpen, 
  CreditCard,
  Phone,
  School
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/studentService';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Student, ApiResponse } from '../../types';
import { formatDate, getFullName, calculateAge } from '../../utils/helpers';

export const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hasRole } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response: ApiResponse<Student> = await studentService.getStudentById(parseInt(id));
        setStudent(response.data || null);
      } catch (error) {
        console.error('Failed to fetch student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Student not found</p>
        <Link to="/students">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getFullName(student.first_name, student.last_name, student.middle_name)}
            </h1>
            <p className="text-gray-600 mt-2">Student ID: {student.student_id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasRole('admin') && (
            <Link to={`/students/${student.id}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">
                    {getFullName(student.first_name, student.last_name, student.middle_name)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Student ID</label>
                  <p className="text-gray-900">{student.student_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900">{student.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Age</label>
                  <p className="text-gray-900">{calculateAge(student.date_of_birth)} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">{formatDate(student.date_of_birth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Admission Date</label>
                  <p className="text-gray-900">{formatDate(student.admission_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Admission Number</label>
                  <p className="text-gray-900">{student.admission_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge variant={student.is_active ? 'success' : 'error'}>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{student.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{student.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                  <p className="text-gray-900">{student.emergency_contact_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Emergency Phone</label>
                  <p className="text-gray-900">{student.emergency_contact_phone || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="w-5 h-5 mr-2" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Grade</label>
                  <Badge variant="secondary">
                    {student.grade_name || 'Not assigned'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Section</label>
                  <Badge variant="outline">
                    {student.section_name || 'Not assigned'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Academic Year</label>
                  <p className="text-gray-900">{student.academic_year || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Previous School</label>
                  <p className="text-gray-900">{student.previous_school || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          {student.medical_info && (
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900">{student.medical_info}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {student.profile_image ? (
                  <img
                    src={student.profile_image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {getFullName(student.first_name, student.last_name, student.middle_name)}
                </h3>
                <p className="text-sm text-gray-500">{student.student_id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to={`/attendance?student=${student.id}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Attendance
                  </Button>
                </Link>
                <Link to={`/exams?student=${student.id}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Exam Results
                  </Button>
                </Link>
                <Link to={`/payments?student=${student.id}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    View Payments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          {student.parent_first_name && (
            <Card>
              <CardHeader>
                <CardTitle>Parent Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">
                      {student.parent_first_name} {student.parent_last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{student.parent_phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Relationship</label>
                    <p className="text-gray-900">{student.relationship}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
