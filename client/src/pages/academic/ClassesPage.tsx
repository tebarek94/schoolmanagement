import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Users,
  GraduationCap,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  BookOpen,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { academicService } from '../../services/academicService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Grade, Section, ApiResponse } from '../../types';
import { formatDate } from '../../utils/helpers';

interface ClassesStats {
  totalGrades: number;
  totalSections: number;
  totalCapacity: number;
  occupiedSeats: number;
  availableSeats: number;
}

export const ClassesPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'grades' | 'sections'>('grades');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [stats, setStats] = useState<ClassesStats>({
    totalGrades: 0,
    totalSections: 0,
    totalCapacity: 0,
    occupiedSeats: 0,
    availableSeats: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gradesResponse, sectionsResponse] = await Promise.all([
          academicService.getGrades(),
          academicService.getSections()
        ]);

        setGrades(gradesResponse.data || []);
        setSections(sectionsResponse.data || []);
        setFilteredGrades(gradesResponse.data || []);
        setFilteredSections(sectionsResponse.data || []);

        // Calculate stats
        const gradesData = gradesResponse.data || [];
        const sectionsData = sectionsResponse.data || [];
        const totalCapacity = sectionsData.reduce((sum, section) => sum + section.capacity, 0);
        const occupiedSeats = Math.floor(totalCapacity * 0.75); // Mock data

        setStats({
          totalGrades: gradesData.length,
          totalSections: sectionsData.length,
          totalCapacity,
          occupiedSeats,
          availableSeats: totalCapacity - occupiedSeats
        });
      } catch (error) {
        console.error('Failed to fetch classes data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter grades
    let filteredG = grades.filter(grade =>
      grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGrades(filteredG);

    // Filter sections
    let filteredS = sections.filter(section =>
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.grade_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGrade !== 'all') {
      filteredS = filteredS.filter(section => section.grade_id.toString() === selectedGrade);
    }

    setFilteredSections(filteredS);
  }, [searchTerm, selectedGrade, grades, sections]);

  const handleDeleteGrade = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await academicService.deleteGrade(id);
        setGrades(grades.filter(grade => grade.id !== id));
        setFilteredGrades(filteredGrades.filter(grade => grade.id !== id));
      } catch (error) {
        console.error('Failed to delete grade:', error);
      }
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await academicService.deleteSection(id);
        setSections(sections.filter(section => section.id !== id));
        setFilteredSections(filteredSections.filter(section => section.id !== id));
      } catch (error) {
        console.error('Failed to delete section:', error);
      }
    }
  };

  const handleExportData = async () => {
    try {
      const data = activeTab === 'grades' ? filteredGrades : filteredSections;
      const headers = activeTab === 'grades' 
        ? "Grade Name,Level,Description,Created Date\n"
        : "Section Name,Grade,Capacity,Academic Year,Created Date\n";
      
      const csvContent = "data:text/csv;charset=utf-8," + headers +
        data.map(item => {
          if (activeTab === 'grades') {
            const grade = item as Grade;
            return `${grade.name},${grade.level},${grade.description || ''},${formatDate(grade.created_at)}`;
          } else {
            const section = item as Section;
            return `${section.name},${section.grade_name || ''},${section.capacity},${section.academic_year || ''},${formatDate(section.created_at)}`;
          }
        }).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${activeTab}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const getGradeIcon = (level: number) => {
    if (level <= 5) return <BookOpen className="w-4 h-4 text-blue-500" />;
    if (level <= 8) return <GraduationCap className="w-4 h-4 text-green-500" />;
    if (level <= 12) return <Building className="w-4 h-4 text-purple-500" />;
    return <BarChart3 className="w-4 h-4 text-orange-500" />;
  };

  const getSectionIcon = (capacity: number) => {
    if (capacity <= 20) return <Users className="w-4 h-4 text-green-500" />;
    if (capacity <= 35) return <Users className="w-4 h-4 text-yellow-500" />;
    return <Users className="w-4 h-4 text-red-500" />;
  };

  const getCapacityBadge = (capacity: number) => {
    if (capacity <= 20) return <Badge variant="success">Small</Badge>;
    if (capacity <= 35) return <Badge variant="warning">Medium</Badge>;
    return <Badge variant="error">Large</Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">Classes & Sections</h1>
          <p className="text-gray-600 mt-2">Manage academic grades and class sections</p>
        </div>
        {hasRole('admin') && (
          <div className="flex space-x-2">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Grade
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Grades</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGrades}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalSections}</p>
              </div>
              <Building className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCapacity}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied Seats</p>
                <p className="text-2xl font-bold text-orange-600">{stats.occupiedSeats}</p>
              </div>
              <UserPlus className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Seats</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.availableSeats}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('grades')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'grades'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Grades ({filteredGrades.length})
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'sections'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sections ({filteredSections.length})
              </button>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {activeTab === 'sections' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <Select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Grades' },
                    ...grades.map(grade => ({ value: grade.id.toString(), label: grade.name }))
                  ]}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      {activeTab === 'grades' && (
        <Card>
          <CardHeader>
            <CardTitle>Grades ({filteredGrades.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">Grade</th>
                    <th className="table-head">Level</th>
                    <th className="table-head">Description</th>
                    <th className="table-head">Sections</th>
                    <th className="table-head">Created</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredGrades.map((grade) => (
                    <tr key={grade.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center">
                          {getGradeIcon(grade.level)}
                          <span className="ml-2 font-medium text-gray-900">
                            {grade.name}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <Badge variant="secondary">
                          Level {grade.level}
                        </Badge>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-600">
                          {grade.description || 'No description'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">
                          {sections.filter(s => s.grade_id === grade.id).length} sections
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">
                          {formatDate(grade.created_at)}
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
                                onClick={() => handleDeleteGrade(grade.id)}
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

            {filteredGrades.length === 0 && (
              <div className="text-center py-8">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No grades found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sections Table */}
      {activeTab === 'sections' && (
        <Card>
          <CardHeader>
            <CardTitle>Sections ({filteredSections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">Section</th>
                    <th className="table-head">Grade</th>
                    <th className="table-head">Capacity</th>
                    <th className="table-head">Academic Year</th>
                    <th className="table-head">Created</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredSections.map((section) => (
                    <tr key={section.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center">
                          {getSectionIcon(section.capacity)}
                          <span className="ml-2 font-medium text-gray-900">
                            {section.name}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="font-medium text-primary-600">
                          {section.grade_name}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">
                            {section.capacity} students
                          </span>
                          {getCapacityBadge(section.capacity)}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">
                          {section.academic_year || 'N/A'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">
                          {formatDate(section.created_at)}
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
                                onClick={() => handleDeleteSection(section.id)}
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

            {filteredSections.length === 0 && (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sections found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
