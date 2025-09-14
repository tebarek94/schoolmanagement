import { apiService } from './api';
import { 
  Student, 
  CreateStudentRequest, 
  ApiResponse, 
  PaginationQuery,
  DashboardStats 
} from '../types';

export class StudentService {
  // Get all students with pagination
  async getStudents(params?: PaginationQuery): Promise<ApiResponse<Student[]>> {
    return await apiService.get<ApiResponse<Student[]>>('/students', { params });
  }

  // Get student by ID
  async getStudentById(id: number): Promise<ApiResponse<Student>> {
    return await apiService.get<ApiResponse<Student>>(`/students/${id}`);
  }

  // Get student by student ID
  async getStudentByStudentId(studentId: string): Promise<ApiResponse<Student>> {
    return await apiService.get<ApiResponse<Student>>(`/students/student-id/${studentId}`);
  }

  // Create new student
  async createStudent(studentData: CreateStudentRequest): Promise<ApiResponse<Student>> {
    return await apiService.post<ApiResponse<Student>>('/students', studentData);
  }

  // Update student
  async updateStudent(id: number, studentData: Partial<CreateStudentRequest>): Promise<ApiResponse<Student>> {
    return await apiService.put<ApiResponse<Student>>(`/students/${id}`, studentData);
  }

  // Delete student
  async deleteStudent(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/students/${id}`);
  }

  // Get students by section
  async getStudentsBySection(sectionId: number): Promise<ApiResponse<Student[]>> {
    return await apiService.get<ApiResponse<Student[]>>(`/students/section/${sectionId}`);
  }

  // Get students by grade
  async getStudentsByGrade(gradeId: number): Promise<ApiResponse<Student[]>> {
    return await apiService.get<ApiResponse<Student[]>>(`/students/grade/${gradeId}`);
  }

  // Get student statistics
  async getStudentStats(): Promise<ApiResponse<DashboardStats>> {
    return await apiService.get<ApiResponse<DashboardStats>>('/students/stats');
  }

  // Enroll student in section
  async enrollStudentInSection(studentId: number, sectionId: number, academicYearId: number): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>(`/students/${studentId}/enroll`, {
      sectionId,
      academicYearId,
    });
  }

  // Transfer student
  async transferStudent(studentId: number, newSectionId: number): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>(`/students/${studentId}/transfer`, {
      newSectionId,
    });
  }

  // Search students
  async searchStudents(query: string): Promise<ApiResponse<Student[]>> {
    return await apiService.get<ApiResponse<Student[]>>('/students', {
      params: { search: query }
    });
  }

  // Get student attendance summary
  async getStudentAttendanceSummary(studentId: number, startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/students/${studentId}/attendance-summary`, {
      params: { startDate, endDate }
    });
  }

  // Get student exam results
  async getStudentExamResults(studentId: number, academicYearId?: number, termId?: number): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/students/${studentId}/exam-results`, {
      params: { academicYearId, termId }
    });
  }

  // Get student payment history
  async getStudentPaymentHistory(studentId: number): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/students/${studentId}/payment-history`);
  }

  // Upload student profile image
  async uploadProfileImage(studentId: number, file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return await apiService.post<ApiResponse<{ url: string }>>(`/students/${studentId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Generate student report card
  async generateReportCard(studentId: number, academicYearId: number, termId: number): Promise<Blob> {
    const response = await apiService.get(`/students/${studentId}/report-card`, {
      params: { academicYearId, termId },
      responseType: 'blob',
    });
    return response;
  }

  // Export students data
  async exportStudents(format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
    const response = await apiService.get(`/students/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response;
  }
}

export const studentService = new StudentService();

