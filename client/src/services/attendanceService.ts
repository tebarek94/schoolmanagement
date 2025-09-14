import { apiService } from './api';
import { 
  Attendance, 
  AttendanceRequest, 
  ApiResponse, 
  PaginationQuery,
  AttendanceReport
} from '../types';

export class AttendanceService {
  // Get attendance records with pagination
  async getAttendanceRecords(params?: PaginationQuery): Promise<ApiResponse<Attendance[]>> {
    return await apiService.get<ApiResponse<Attendance[]>>('/attendance', { params });
  }

  // Get attendance by student
  async getStudentAttendance(studentId: number, startDate?: string, endDate?: string): Promise<ApiResponse<Attendance[]>> {
    return await apiService.get<ApiResponse<Attendance[]>>(`/attendance/student/${studentId}`, {
      params: { startDate, endDate }
    });
  }

  // Get attendance by section
  async getSectionAttendance(sectionId: number, date: string): Promise<ApiResponse<Attendance[]>> {
    return await apiService.get<ApiResponse<Attendance[]>>(`/attendance/section/${sectionId}`, {
      params: { date }
    });
  }

  // Mark attendance for a student
  async markAttendance(attendanceData: AttendanceRequest): Promise<ApiResponse<Attendance>> {
    return await apiService.post<ApiResponse<Attendance>>('/attendance', attendanceData);
  }

  // Mark attendance for multiple students
  async markBulkAttendance(attendanceData: AttendanceRequest[]): Promise<ApiResponse<Attendance[]>> {
    return await apiService.post<ApiResponse<Attendance[]>>('/attendance/bulk', attendanceData);
  }

  // Update attendance record
  async updateAttendance(id: number, attendanceData: Partial<AttendanceRequest>): Promise<ApiResponse<Attendance>> {
    return await apiService.put<ApiResponse<Attendance>>(`/attendance/${id}`, attendanceData);
  }

  // Delete attendance record
  async deleteAttendance(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/attendance/${id}`);
  }

  // Get attendance summary for a student
  async getStudentAttendanceSummary(studentId: number, startDate?: string, endDate?: string): Promise<ApiResponse<AttendanceReport>> {
    return await apiService.get<ApiResponse<AttendanceReport>>(`/attendance/student/${studentId}/summary`, {
      params: { startDate, endDate }
    });
  }

  // Get attendance summary for a section
  async getSectionAttendanceSummary(sectionId: number, startDate?: string, endDate?: string): Promise<ApiResponse<AttendanceReport[]>> {
    return await apiService.get<ApiResponse<AttendanceReport[]>>(`/attendance/section/${sectionId}/summary`, {
      params: { startDate, endDate }
    });
  }

  // Get attendance statistics
  async getAttendanceStats(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>('/attendance/stats', {
      params: { startDate, endDate }
    });
  }

  // Get attendance calendar for a student
  async getStudentAttendanceCalendar(studentId: number, year: number, month: number): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/attendance/student/${studentId}/calendar`, {
      params: { year, month }
    });
  }

  // Get attendance calendar for a section
  async getSectionAttendanceCalendar(sectionId: number, year: number, month: number): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/attendance/section/${sectionId}/calendar`, {
      params: { year, month }
    });
  }

  // Export attendance report
  async exportAttendanceReport(format: 'csv' | 'excel' | 'pdf' = 'excel', params?: PaginationQuery): Promise<Blob> {
    const response = await apiService.get('/attendance/export', {
      params: { format, ...params },
      responseType: 'blob',
    });
    return response;
  }

  // Generate attendance report for parent
  async generateParentAttendanceReport(studentId: number, startDate: string, endDate: string): Promise<Blob> {
    const response = await apiService.get(`/attendance/student/${studentId}/parent-report`, {
      params: { startDate, endDate },
      responseType: 'blob',
    });
    return response;
  }

  // Get attendance trends
  async getAttendanceTrends(sectionId?: number, startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>('/attendance/trends', {
      params: { sectionId, startDate, endDate }
    });
  }
}

export const attendanceService = new AttendanceService();





