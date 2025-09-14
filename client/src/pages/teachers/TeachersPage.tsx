import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  GraduationCap,
  Phone,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teacherService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Teacher, ApiResponse } from '../../types';
import { formatDate, getFullName } from '../../utils/helpers';

export const TeachersPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Teacher[]> = await teacherService.getTeachers();
        setTeachers(response.data || []);
        setFilteredTeachers(response.data || []);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const filtered = teachers.filter(teacher =>
      getFullName(teacher.first_name, teacher.last_name, teacher.middle_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(filtered);
  }, [searchTerm, teachers]);

  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherService.deleteTeacher(id);
        setTeachers(teachers.filter(teacher => teacher.id !== id));
        setFilteredTeachers(filteredTeachers.filter(teacher => teacher.id !== id));
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    }
  };

  const handleExportTeachers = async () => {
    try {
      const blob = await teacherService.exportTeachers('excel');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'teachers.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export teachers:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-2">Manage teacher records and assignments</p>
        </div>
        {hasRole('admin') && (
          <Link to="/teachers/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
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
                  placeholder="Search teachers by name, employee ID, specialization, or qualification..."
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
            <Button variant="outline" onClick={handleExportTeachers}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {teacher.profile_image ? (
                      <img 
                        src={teacher.profile_image} 
                        alt={getFullName(teacher.first_name, teacher.last_name, teacher.middle_name)}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {getFullName(teacher.first_name, teacher.last_name, teacher.middle_name)}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{teacher.employee_id}</p>
                  </div>
                </div>
                <Badge variant={teacher.is_active ? 'success' : 'error'}>
                  {teacher.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Contact Information */}
              <div className="space-y-2">
                {teacher.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {teacher.phone}
                  </div>
                )}
                {teacher.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{teacher.address}</span>
                  </div>
                )}
              </div>

              {/* Professional Information */}
              <div className="space-y-2">
                {teacher.specialization && (
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {teacher.specialization}
                  </div>
                )}
                {teacher.qualification && (
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {teacher.qualification}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Hired: {formatDate(teacher.hire_date)}
                </div>
                {teacher.salary && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ${teacher.salary.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Subjects and Grades */}
              {(teacher.subjects || teacher.grades) && (
                <div className="pt-2 border-t">
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects && (
                      <Badge variant="secondary" className="text-xs">
                        {teacher.subjects}
                      </Badge>
                    )}
                    {teacher.grades && (
                      <Badge variant="outline" className="text-xs">
                        {teacher.grades}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <Link to={`/teachers/${teacher.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                {hasRole('admin') && (
                  <>
                    <Link to={`/teachers/${teacher.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No teachers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};





