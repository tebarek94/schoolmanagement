import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Calendar as CalendarIcon,
  School,
  BookOpen,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'attendance' | 'academic' | 'financial' | 'general';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  lastGenerated?: string;
  recordCount?: number;
}

interface ReportStats {
  totalReports: number;
  attendanceReports: number;
  academicReports: number;
  financialReports: number;
  lastGenerated: string;
}

export const ReportsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'attendance', label: 'Attendance Reports' },
    { value: 'academic', label: 'Academic Reports' },
    { value: 'financial', label: 'Financial Reports' },
    { value: 'general', label: 'General Reports' }
  ];

  const periodOptions = [
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const gradeOptions = [
    { value: 'all', label: 'All Grades' },
    { value: 'grade_1', label: 'Grade 1' },
    { value: 'grade_2', label: 'Grade 2' },
    { value: 'grade_3', label: 'Grade 3' },
    { value: 'grade_4', label: 'Grade 4' },
    { value: 'grade_5', label: 'Grade 5' },
    { value: 'grade_6', label: 'Grade 6' },
    { value: 'grade_7', label: 'Grade 7' },
    { value: 'grade_8', label: 'Grade 8' },
    { value: 'grade_9', label: 'Grade 9' },
    { value: 'grade_10', label: 'Grade 10' },
    { value: 'grade_11', label: 'Grade 11' },
    { value: 'grade_12', label: 'Grade 12' }
  ];

  const reports: ReportData[] = [
    {
      id: 'attendance_summary',
      title: 'Attendance Summary Report',
      description: 'Comprehensive attendance analysis by class, student, and period',
      type: 'attendance',
      icon: Calendar,
      color: 'bg-blue-500',
      lastGenerated: '2024-01-15',
      recordCount: 1250
    },
    {
      id: 'student_attendance',
      title: 'Individual Student Attendance',
      description: 'Detailed attendance records for specific students',
      type: 'attendance',
      icon: Users,
      color: 'bg-green-500',
      lastGenerated: '2024-01-14',
      recordCount: 320
    },
    {
      id: 'class_attendance',
      title: 'Class Attendance Report',
      description: 'Attendance statistics by class and section',
      type: 'attendance',
      icon: School,
      color: 'bg-purple-500',
      lastGenerated: '2024-01-13',
      recordCount: 45
    },
    {
      id: 'exam_results',
      title: 'Exam Results Report',
      description: 'Comprehensive exam results and performance analysis',
      type: 'academic',
      icon: Award,
      color: 'bg-yellow-500',
      lastGenerated: '2024-01-12',
      recordCount: 890
    },
    {
      id: 'grade_sheet',
      title: 'Grade Sheet Report',
      description: 'Student grade sheets and report cards',
      type: 'academic',
      icon: BookOpen,
      color: 'bg-indigo-500',
      lastGenerated: '2024-01-11',
      recordCount: 450
    },
    {
      id: 'academic_performance',
      title: 'Academic Performance Analysis',
      description: 'Performance trends and comparative analysis',
      type: 'academic',
      icon: TrendingUp,
      color: 'bg-pink-500',
      lastGenerated: '2024-01-10',
      recordCount: 120
    },
    {
      id: 'payment_summary',
      title: 'Payment Summary Report',
      description: 'Financial transactions and payment status',
      type: 'financial',
      icon: DollarSign,
      color: 'bg-green-600',
      lastGenerated: '2024-01-09',
      recordCount: 680
    },
    {
      id: 'fee_collection',
      title: 'Fee Collection Report',
      description: 'Fee collection status and outstanding amounts',
      type: 'financial',
      icon: CreditCard,
      color: 'bg-red-500',
      lastGenerated: '2024-01-08',
      recordCount: 320
    },
    {
      id: 'financial_summary',
      title: 'Financial Summary',
      description: 'Overall financial health and revenue analysis',
      type: 'financial',
      icon: BarChart3,
      color: 'bg-orange-500',
      lastGenerated: '2024-01-07',
      recordCount: 95
    },
    {
      id: 'student_enrollment',
      title: 'Student Enrollment Report',
      description: 'Enrollment statistics and demographic analysis',
      type: 'general',
      icon: Users,
      color: 'bg-teal-500',
      lastGenerated: '2024-01-06',
      recordCount: 280
    },
    {
      id: 'teacher_workload',
      title: 'Teacher Workload Report',
      description: 'Teacher assignments and workload distribution',
      type: 'general',
      icon: School,
      color: 'bg-cyan-500',
      lastGenerated: '2024-01-05',
      recordCount: 45
    },
    {
      id: 'school_statistics',
      title: 'School Statistics Report',
      description: 'Overall school statistics and key metrics',
      type: 'general',
      icon: PieChart,
      color: 'bg-gray-500',
      lastGenerated: '2024-01-04',
      recordCount: 1
    }
  ];

  const stats: ReportStats = {
    totalReports: reports.length,
    attendanceReports: reports.filter(r => r.type === 'attendance').length,
    academicReports: reports.filter(r => r.type === 'academic').length,
    financialReports: reports.filter(r => r.type === 'financial').length,
    lastGenerated: '2024-01-15'
  };

  const filteredReports = selectedReportType === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedReportType);

  const handleGenerateReport = async (reportId: string) => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Generating report: ${reportId}`);
      // In a real implementation, this would call the API to generate the report
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      console.log(`Exporting report ${reportId} as ${format}`);
      // In a real implementation, this would call the API to export the report
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'attendance':
        return 'bg-blue-100 text-blue-800';
      case 'academic':
        return 'bg-green-100 text-green-800';
      case 'financial':
        return 'bg-yellow-100 text-yellow-800';
      case 'general':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate and export comprehensive school reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Bulk Export
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-blue-600">{stats.attendanceReports}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Academic</p>
                <p className="text-2xl font-bold text-green-600">{stats.academicReports}</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Financial</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.financialReports}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <Select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                options={reportTypes}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                options={periodOptions}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <Select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                options={gradeOptions}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Apply Filters'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <report.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <Badge className={getReportTypeColor(report.type)}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{report.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Records: {report.recordCount?.toLocaleString()}</span>
                <span>Last: {report.lastGenerated}</span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={loading}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Generate
                </Button>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport(report.id, 'pdf')}
                    title="Export as PDF"
                  >
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport(report.id, 'excel')}
                    title="Export as Excel"
                  >
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport(report.id, 'csv')}
                    title="Export as CSV"
                  >
                    CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reports found for the selected filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
