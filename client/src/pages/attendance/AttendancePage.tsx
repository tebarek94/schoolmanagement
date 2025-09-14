import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  time: string;
  remarks?: string;
}

interface AttendanceStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  attendanceRate: number;
}

export const AttendancePage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockAttendanceData: AttendanceRecord[] = [
    {
      id: '1',
      studentId: 'ST001',
      studentName: 'John Doe',
      className: 'Grade 10 Mathematics',
      date: selectedDate,
      status: 'present',
      time: '08:30 AM',
      remarks: 'On time'
    },
    {
      id: '2',
      studentId: 'ST002',
      studentName: 'Jane Smith',
      className: 'Grade 10 Mathematics',
      date: selectedDate,
      status: 'late',
      time: '08:45 AM',
      remarks: 'Traffic delay'
    },
    {
      id: '3',
      studentId: 'ST003',
      studentName: 'Mike Johnson',
      className: 'Grade 10 Mathematics',
      date: selectedDate,
      status: 'absent',
      time: '-',
      remarks: 'Sick leave'
    },
    {
      id: '4',
      studentId: 'ST004',
      studentName: 'Sarah Wilson',
      className: 'Grade 11 Science',
      date: selectedDate,
      status: 'present',
      time: '08:25 AM',
      remarks: 'Early arrival'
    },
    {
      id: '5',
      studentId: 'ST005',
      studentName: 'David Brown',
      className: 'Grade 11 Science',
      date: selectedDate,
      status: 'excused',
      time: '-',
      remarks: 'Medical appointment'
    }
  ];

  const classes = [
    { value: 'all', label: 'All Classes' },
    { value: 'Grade 10 Mathematics', label: 'Grade 10 Mathematics' },
    { value: 'Grade 11 Science', label: 'Grade 11 Science' },
    { value: 'Grade 12 English', label: 'Grade 12 English' }
  ];

  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate, selectedClass]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      // Filter mock data based on selected class
      let filteredData = mockAttendanceData;
      if (selectedClass !== 'all') {
        filteredData = mockAttendanceData.filter(record => record.className === selectedClass);
      }

      setAttendanceRecords(filteredData);
      
      // Calculate stats
      const totalStudents = filteredData.length;
      const presentToday = filteredData.filter(r => r.status === 'present').length;
      const absentToday = filteredData.filter(r => r.status === 'absent').length;
      const lateToday = filteredData.filter(r => r.status === 'late').length;
      const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

      setStats({
        totalStudents,
        presentToday,
        absentToday,
        lateToday,
        attendanceRate
      });
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'excused':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'success',
      absent: 'error',
      late: 'warning',
      excused: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`);
    // Implement bulk actions like mark all present, export, etc.
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage student attendance</p>
        </div>
        
        {hasRole('admin') || hasRole('teacher') ? (
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => handleBulkAction('export')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => handleBulkAction('import')}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => handleBulkAction('mark')}>
              <Plus className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        ) : null}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
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
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={classes}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={loadAttendanceData}
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                    {(hasRole('admin') || hasRole('teacher')) && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.studentId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record.status)}
                          {getStatusBadge(record.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.time}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.remarks || '-'}
                      </td>
                      {(hasRole('admin') || hasRole('teacher')) && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRecords.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No attendance records found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};



