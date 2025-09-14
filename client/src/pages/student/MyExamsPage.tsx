import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  FileText,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { examService } from '../../services/examService';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Examination, ExamResult, ApiResponse } from '../../types';
import { formatDate, formatTime } from '../../utils/helpers';

export const MyExamsPage: React.FC = () => {
  const { user } = useAuth();
  const [upcomingExams, setUpcomingExams] = useState<Examination[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('all');

  useEffect(() => {
    const fetchStudentExams = async () => {
      try {
        setLoading(true);
        
        // Fetch upcoming exams for the student
        const upcomingResponse: ApiResponse<Examination[]> = await examService.getUpcomingExaminations();
        setUpcomingExams(upcomingResponse.data || []);
        
        // Fetch exam results for the student
        if (user?.profile && 'id' in user.profile) {
          const resultsResponse: ApiResponse<ExamResult[]> = await examService.getResultsByStudent(user.profile.id);
          setExamResults(resultsResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch student exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentExams();
  }, [user]);

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

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    
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

  const filteredResults = examResults.filter(result => {
    if (selectedSubject !== 'all' && result.subject_name !== selectedSubject) {
      return false;
    }
    if (selectedTerm !== 'all') {
      // You would need to add term filtering logic based on your data structure
      return true;
    }
    return true;
  });

  const getUniqueSubjects = () => {
    const subjects = Array.from(new Set(examResults.map(result => result.subject_name).filter(Boolean)));
    return [
      { value: 'all', label: 'All Subjects' },
      ...subjects.map(subject => ({ value: subject || '', label: subject || '' }))
    ];
  };

  const getAverageScore = () => {
    const totalMarks = examResults.reduce((sum, result) => sum + (result.marks_obtained || 0), 0);
    const totalPossibleMarks = examResults.reduce((sum, result) => sum + (result.total_marks || 0), 0);
    return totalPossibleMarks > 0 ? Math.round((totalMarks / totalPossibleMarks) * 100) : 0;
  };

  const getTotalExams = () => examResults.length;

  const getPassedExams = () => {
    return examResults.filter(result => {
      const percentage = result.total_marks ? (result.marks_obtained / result.total_marks) * 100 : 0;
      return percentage >= 50; // Assuming 50% is passing
    }).length;
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
          <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
          <p className="text-gray-600 mt-2">View your upcoming exams and past results</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Results
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-orange-600">{upcomingExams.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-blue-600">{getTotalExams()}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed Exams</p>
                <p className="text-2xl font-bold text-green-600">{getPassedExams()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-purple-600">{getAverageScore()}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Exams
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingExams.length > 0 ? (
            <div className="space-y-4">
              {upcomingExams.map((exam) => {
                const examStatus = getExamStatus(exam.exam_date);
                return (
                  <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{exam.title}</h3>
                        <p className="text-sm text-gray-500">{exam.subject_name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(exam.exam_date)}
                          </div>
                          {exam.start_time && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTime(exam.start_time)}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <Award className="w-4 h-4 mr-1" />
                            {exam.total_marks} marks
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant={examStatus.color as any}>
                      {examStatus.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming exams scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exam Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Exam Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Subject
                </label>
                <Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  options={getUniqueSubjects()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Term
                </label>
                <Select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Terms' },
                    { value: 'term1', label: 'Term 1' },
                    { value: 'term2', label: 'Term 2' },
                    { value: 'term3', label: 'Term 3' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Results Table */}
          {filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">Subject</th>
                    <th className="table-head">Exam</th>
                    <th className="table-head">Score</th>
                    <th className="table-head">Grade</th>
                    <th className="table-head">Date</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredResults.map((result) => (
                    <tr key={result.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                          {result.subject_name}
                        </div>
                      </td>
                      <td className="table-cell">{result.exam_title}</td>
                      <td className="table-cell">
                        <span className="font-medium">
                          {result.marks_obtained}/{result.total_marks}
                        </span>
                        <div className="text-sm text-gray-500">
                          {result.total_marks ? Math.round((result.marks_obtained / result.total_marks) * 100) : 0}%
                        </div>
                      </td>
                      <td className="table-cell">
                        {result.grade && (
                          <Badge className={getGradeColor(result.grade)}>
                            {result.grade}
                          </Badge>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(result.created_at)}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          {result.marks_obtained && result.total_marks ? (
                            (result.marks_obtained / result.total_marks) * 100 >= 50 ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                            )
                          ) : null}
                          <span className="text-sm">
                            {result.marks_obtained && result.total_marks ? (
                              (result.marks_obtained / result.total_marks) * 100 >= 50 ? 'Passed' : 'Failed'
                            ) : 'Pending'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No exam results found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
