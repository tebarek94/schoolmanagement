import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/studentService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Student, ApiResponse } from '../../types';
import { formatDate, getFullName } from '../../utils/helpers';

export const StudentsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Student[]> = await studentService.getStudents();
        setStudents(response.data || []);
        setFilteredStudents(response.data || []);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      getFullName(student.first_name, student.last_name, student.middle_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.section_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id);
        setStudents(students.filter(student => student.id !== id));
        setFilteredStudents(filteredStudents.filter(student => student.id !== id));
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">Manage student records and enrollment</p>
        </div>
        {hasRole('admin') && (
          <Link to="/students/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students by name, ID, grade, or section..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Student ID</th>
                  <th className="table-head">Name</th>
                  <th className="table-head">Grade</th>
                  <th className="table-head">Section</th>
                  <th className="table-head">Admission Date</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="table-row">
                    <td className="table-cell">
                      <span className="font-medium text-primary-600">
                        {student.student_id}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">
                          {getFullName(student.first_name, student.last_name, student.middle_name)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.gender} • {student.date_of_birth}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant="secondary">
                        {student.grade_name || 'N/A'}
                      </Badge>
                    </td>
                    <td className="table-cell">
                      <Badge variant="outline">
                        {student.section_name || 'N/A'}
                      </Badge>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">
                        {formatDate(student.admission_date)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <Badge 
                        variant={student.is_active ? 'success' : 'error'}
                      >
                        {student.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link to={`/students/${student.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {hasRole('admin') && (
                          <>
                            <Link to={`/students/${student.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
