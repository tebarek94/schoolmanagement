import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { academicService } from '../../services/academicService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Subject, ApiResponse } from '../../types';
import { formatDate } from '../../utils/helpers';

interface SubjectStats {
  totalSubjects: number;
  coreSubjects: number;
  electiveSubjects: number;
  activeSubjects: number;
  subjectsWithTeachers: number;
}

export const SubjectsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [stats, setStats] = useState<SubjectStats>({
    totalSubjects: 0,
    coreSubjects: 0,
    electiveSubjects: 0,
    activeSubjects: 0,
    subjectsWithTeachers: 0
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Subject[]> = await academicService.getSubjects();
        setSubjects(response.data || []);
        setFilteredSubjects(response.data || []);
        
        // Calculate stats
        const subjectsData = response.data || [];
        setStats({
          totalSubjects: subjectsData.length,
          coreSubjects: subjectsData.filter(s => s.is_core).length,
          electiveSubjects: subjectsData.filter(s => !s.is_core).length,
          activeSubjects: subjectsData.length, // Assuming all subjects are active for now
          subjectsWithTeachers: Math.floor(subjectsData.length * 0.8) // Mock data
        });
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    let filtered = subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedType !== 'all') {
      filtered = filtered.filter(subject => 
        selectedType === 'core' ? subject.is_core : !subject.is_core
      );
    }

    setFilteredSubjects(filtered);
  }, [searchTerm, selectedType, selectedStatus, subjects]);

  const handleDeleteSubject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await academicService.deleteSubject(id);
        setSubjects(subjects.filter(subject => subject.id !== id));
        setFilteredSubjects(filteredSubjects.filter(subject => subject.id !== id));
      } catch (error) {
        console.error('Failed to delete subject:', error);
      }
    }
  };

  const handleExportSubjects = async () => {
    try {
      // Mock export functionality
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Subject Code,Subject Name,Type,Description,Created Date\n" +
        filteredSubjects.map(subject => 
          `${subject.code},${subject.name},${subject.is_core ? 'Core' : 'Elective'},${subject.description || ''},${formatDate(subject.created_at)}`
        ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "subjects.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export subjects:', error);
    }
  };

  const getSubjectTypeBadge = (isCore: boolean) => {
    return (
      <Badge variant={isCore ? 'success' : 'secondary'}>
        {isCore ? 'Core' : 'Elective'}
      </Badge>
    );
  };

  const getSubjectIcon = (subject: Subject) => {
    // Mock logic to assign icons based on subject name
    const name = subject.name.toLowerCase();
    if (name.includes('math')) return <BarChart3 className="w-4 h-4 text-blue-500" />;
    if (name.includes('science')) return <Award className="w-4 h-4 text-green-500" />;
    if (name.includes('english') || name.includes('language')) return <BookOpen className="w-4 h-4 text-purple-500" />;
    if (name.includes('history') || name.includes('social')) return <GraduationCap className="w-4 h-4 text-orange-500" />;
    return <BookOpen className="w-4 h-4 text-gray-500" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Subjects Management</h1>
          <p className="text-gray-600 mt-2">Manage academic subjects and curriculum</p>
        </div>
        {hasRole('admin') && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Core Subjects</p>
                <p className="text-2xl font-bold text-green-600">{stats.coreSubjects}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Elective Subjects</p>
                <p className="text-2xl font-bold text-purple-600">{stats.electiveSubjects}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subjects</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeSubjects}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Teachers</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.subjectsWithTeachers}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Type
              </label>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'core', label: 'Core Subjects' },
                  { value: 'elective', label: 'Elective Subjects' }
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ]}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={handleExportSubjects}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects ({filteredSubjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Subject</th>
                  <th className="table-head">Code</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Description</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        {getSubjectIcon(subject)}
                        <span className="ml-2 font-medium text-gray-900">
                          {subject.name}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium text-primary-600">
                        {subject.code}
                      </span>
                    </td>
                    <td className="table-cell">
                      {getSubjectTypeBadge(subject.is_core)}
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-600">
                        {subject.description || 'No description'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">
                        {formatDate(subject.created_at)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {hasRole('admin') && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSubject(subject.id)}
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

          {filteredSubjects.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No subjects found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
