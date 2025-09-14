import { apiService } from './api';
import { 
  Teacher, 
  CreateTeacherRequest, 
  ApiResponse, 
  PaginationQuery,
  Subject,
  Section
} from '../types';

export class TeacherService {
  // Get all teachers with pagination
  async getTeachers(params?: PaginationQuery): Promise<ApiResponse<Teacher[]>> {
    return await apiService.get<ApiResponse<Teacher[]>>('/teachers', { params });
  }

  // Get teacher by ID
  async getTeacherById(id: number): Promise<ApiResponse<Teacher>> {
    return await apiService.get<ApiResponse<Teacher>>(`/teachers/${id}`);
  }

  // Get teacher by employee ID
  async getTeacherByEmployeeId(employeeId: string): Promise<ApiResponse<Teacher>> {
    return await apiService.get<ApiResponse<Teacher>>(`/teachers/employee-id/${employeeId}`);
  }

  // Create new teacher
  async createTeacher(teacherData: CreateTeacherRequest): Promise<ApiResponse<Teacher>> {
    return await apiService.post<ApiResponse<Teacher>>('/teachers', teacherData);
  }

  // Update teacher
  async updateTeacher(id: number, teacherData: Partial<CreateTeacherRequest>): Promise<ApiResponse<Teacher>> {
    return await apiService.put<ApiResponse<Teacher>>(`/teachers/${id}`, teacherData);
  }

  // Delete teacher
  async deleteTeacher(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/teachers/${id}`);
  }

  // Get teacher statistics
  async getTeacherStats(): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>('/teachers/stats');
  }

  // Assign teacher to subject
  async assignTeacherToSubject(teacherId: number, subjectId: number, gradeId: number, academicYearId: number): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>(`/teachers/${teacherId}/assign-subject`, {
      subjectId,
      gradeId,
      academicYearId,
    });
  }

  // Assign teacher as class teacher
  async assignClassTeacher(teacherId: number, sectionId: number, academicYearId: number): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>(`/teachers/${teacherId}/assign-class`, {
      sectionId,
      academicYearId,
    });
  }

  // Get teacher's subjects
  async getTeacherSubjects(teacherId: number): Promise<ApiResponse<Subject[]>> {
    return await apiService.get<ApiResponse<Subject[]>>(`/teachers/${teacherId}/subjects`);
  }

  // Get teacher's sections
  async getTeacherSections(teacherId: number): Promise<ApiResponse<Section[]>> {
    return await apiService.get<ApiResponse<Section[]>>(`/teachers/${teacherId}/sections`);
  }

  // Search teachers
  async searchTeachers(query: string): Promise<ApiResponse<Teacher[]>> {
    return await apiService.get<ApiResponse<Teacher[]>>('/teachers', {
      params: { search: query }
    });
  }

  // Upload teacher profile image
  async uploadProfileImage(teacherId: number, file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return await apiService.post<ApiResponse<{ url: string }>>(`/teachers/${teacherId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Get teacher workload
  async getTeacherWorkload(teacherId: number, academicYearId: number): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/teachers/${teacherId}/workload`, {
      params: { academicYearId }
    });
  }

  // Get teacher attendance records
  async getTeacherAttendanceRecords(teacherId: number, startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/teachers/${teacherId}/attendance`, {
      params: { startDate, endDate }
    });
  }

  // Export teachers data
  async exportTeachers(format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
    const response = await apiService.get(`/teachers/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response;
  }
}

export const teacherService = new TeacherService();

