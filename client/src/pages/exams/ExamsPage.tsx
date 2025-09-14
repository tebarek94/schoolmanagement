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
  Calendar,
  Clock,
  BookOpen,
  Users,
  TrendingUp,
  FileText,
  Award,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { examService } from '../../services/examService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Examination, ApiResponse } from '../../types';
import { formatDate, formatTime } from '../../utils/helpers';

export const ExamsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [exams, setExams] = useState<Examination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExams, setFilteredExams] = useState<Examination[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Examination[]> = await examService.getExaminations();
        setExams(response.data || []);
        setFilteredExams(response.data || []);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    let filtered = exams.filter(exam =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.grade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.section_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(exam => exam.subject_name === selectedSubject);
    }

    if (selectedGrade !== 'all') {
      filtered = filtered.filter(exam => exam.grade_name === selectedGrade);
    }

    if (selectedStatus !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      switch (selectedStatus) {
        case 'upcoming':
          filtered = filtered.filter(exam => exam.exam_date > today);
          break;
        case 'completed':
          filtered = filtered.filter(exam => exam.exam_date < today);
          break;
        case 'today':
          filtered = filtered.filter(exam => exam.exam_date === today);
          break;
      }
    }

    setFilteredExams(filtered);
  }, [searchTerm, selectedSubject, selectedGrade, selectedStatus, exams]);

  const handleDeleteExam = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examService.deleteExamination(id);
        setExams(exams.filter(exam => exam.id !== id));
        setFilteredExams(filteredExams.filter(exam => exam.id !== id));
      } catch (error) {
        console.error('Failed to delete exam:', error);
      }
    }
  };

  const handleExportExams = async () => {
    try {
      const blob = await examService.exportExamResults('excel');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exams.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export exams:', error);
    }
  };

  const getExamStatus = (examDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const examDateObj = new Date(examDate);
    const todayObj = new Date(today);

    if (examDateObj < todayObj) {
      return { status: 'completed', color: 'success', label: 'Completed' };
    } else if (examDateObj.toDateString() === todayObj.toDateString()) {
      return { status: 'today', color: 'warning', label: 'Today' };
    } else {
      return { status: 'upcoming', color: 'secondary', label: 'Upcoming' };
    }
  };

  const getUniqueSubjects = () => {
    const subjects = Array.from(new Set(exams.map(exam => exam.subject_name).filter(Boolean)));
    return [
      { value: 'all', label: 'All Subjects' },
      ...subjects.map(subject => ({ value: subject || '', label: subject || '' }))
    ];
  };

  const getUniqueGrades = () => {
    const grades = Array.from(new Set(exams.map(exam => exam.grade_name).filter(Boolean)));
    return [
      { value: 'all', label: 'All Grades' },
      ...grades.map(grade => ({ value: grade || '', label: grade || '' }))
    ];
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
          <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600 mt-2">Manage examinations and results</p>
        </div>
        {hasRole('admin') || hasRole('teacher') ? (
          <Link to="/exams/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Exam
            </Button>
          </Link>
        ) : null}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-orange-600">
                  {exams.filter(exam => getExamStatus(exam.exam_date).status === 'upcoming').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {exams.filter(exam => getExamStatus(exam.exam_date).status === 'today').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {exams.filter(exam => getExamStatus(exam.exam_date).status === 'completed').length}
                </p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={getUniqueSubjects()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <Select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                options={getUniqueGrades()}
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
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'today', label: 'Today' },
                  { value: 'completed', label: 'Completed' }
                ]}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={handleExportExams}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const examStatus = getExamStatus(exam.exam_date);
          return (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <p className="text-sm text-gray-500">{exam.subject_name}</p>
                    </div>
                  </div>
                  <Badge variant={examStatus.color as any}>
                    {examStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Exam Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(exam.exam_date)}
                  </div>
                  
                  {exam.start_time && exam.end_time && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {exam.grade_name} - {exam.section_name}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {exam.total_marks} marks (Pass: {exam.passing_marks})
                  </div>
                </div>

                {/* Description */}
                {exam.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {exam.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                  <Link to={`/exams/${exam.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  {(hasRole('admin') || hasRole('teacher')) && (
                    <>
                      <Link to={`/exams/${exam.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExams.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No exams found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
