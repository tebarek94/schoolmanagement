import { apiService } from './api';
import { 
  Examination, 
  ExamResult, 
  ExamRequest, 
  ExamResultRequest, 
  ApiResponse, 
  PaginationQuery
} from '../types';

export class ExamService {
  // Examinations
  async getExaminations(params?: PaginationQuery): Promise<ApiResponse<Examination[]>> {
    return await apiService.get<ApiResponse<Examination[]>>('/exams/examinations', { params });
  }

  async getExaminationById(id: number): Promise<ApiResponse<Examination>> {
    return await apiService.get<ApiResponse<Examination>>(`/exams/examinations/${id}`);
  }

  async createExamination(examData: ExamRequest): Promise<ApiResponse<Examination>> {
    return await apiService.post<ApiResponse<Examination>>('/exams/examinations', examData);
  }

  async updateExamination(id: number, examData: Partial<ExamRequest>): Promise<ApiResponse<Examination>> {
    return await apiService.put<ApiResponse<Examination>>(`/exams/examinations/${id}`, examData);
  }

  async deleteExamination(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/exams/examinations/${id}`);
  }

  // Get examinations by section
  async getExaminationsBySection(sectionId: number, academicYearId?: number, termId?: number): Promise<ApiResponse<Examination[]>> {
    return await apiService.get<ApiResponse<Examination[]>>(`/exams/section/${sectionId}`, {
      params: { academicYearId, termId }
    });
  }

  // Get examinations by subject
  async getExaminationsBySubject(subjectId: number, academicYearId?: number, termId?: number): Promise<ApiResponse<Examination[]>> {
    return await apiService.get<ApiResponse<Examination[]>>(`/exams/subject/${subjectId}`, {
      params: { academicYearId, termId }
    });
  }

  // Get upcoming examinations
  async getUpcomingExaminations(sectionId?: number, days?: number): Promise<ApiResponse<Examination[]>> {
    return await apiService.get<ApiResponse<Examination[]>>('/exams/examinations/upcoming', {
      params: { sectionId, days }
    });
  }

  // Exam Results
  async getExamResults(params?: PaginationQuery): Promise<ApiResponse<ExamResult[]>> {
    return await apiService.get<ApiResponse<ExamResult[]>>('/exams/results', { params });
  }

  async getExamResultById(id: number): Promise<ApiResponse<ExamResult>> {
    return await apiService.get<ApiResponse<ExamResult>>(`/exams/results/${id}`);
  }

  async createExamResult(resultData: ExamResultRequest): Promise<ApiResponse<ExamResult>> {
    return await apiService.post<ApiResponse<ExamResult>>('/exams/results', resultData);
  }

  async updateExamResult(id: number, resultData: Partial<ExamResultRequest>): Promise<ApiResponse<ExamResult>> {
    return await apiService.put<ApiResponse<ExamResult>>(`/exams/results/${id}`, resultData);
  }

  async deleteExamResult(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/exams/results/${id}`);
  }

  // Get results by examination
  async getResultsByExamination(examinationId: number): Promise<ApiResponse<ExamResult[]>> {
    return await apiService.get<ApiResponse<ExamResult[]>>(`/exams/results/examination/${examinationId}`);
  }

  // Get results by student
  async getResultsByStudent(studentId: number, academicYearId?: number, termId?: number): Promise<ApiResponse<ExamResult[]>> {
    return await apiService.get<ApiResponse<ExamResult[]>>(`/exams/results/student/${studentId}`, {
      params: { academicYearId, termId }
    });
  }

  // Bulk create exam results
  async createBulkExamResults(resultsData: ExamResultRequest[]): Promise<ApiResponse<ExamResult[]>> {
    return await apiService.post<ApiResponse<ExamResult[]>>('/exams/results/bulk', resultsData);
  }

  // Get exam statistics
  async getExamStats(academicYearId?: number, termId?: number): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>('/exams/stats', {
      params: { academicYearId, termId }
    });
  }

  // Get student performance summary
  async getStudentPerformanceSummary(studentId: number, academicYearId?: number, termId?: number): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/exams/student/${studentId}/performance`, {
      params: { academicYearId, termId }
    });
  }

  // Get class performance summary
  async getClassPerformanceSummary(sectionId: number, academicYearId?: number, termId?: number): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>(`/exams/section/${sectionId}/performance`, {
      params: { academicYearId, termId }
    });
  }

  // Generate report card
  async generateReportCard(studentId: number, academicYearId: number, termId: number): Promise<Blob> {
    const response = await apiService.get(`/exams/report-card/${studentId}`, {
      params: { academicYearId, termId },
      responseType: 'blob',
    });
    return response;
  }

  // Generate class report
  async generateClassReport(sectionId: number, academicYearId: number, termId: number): Promise<Blob> {
    const response = await apiService.get(`/exams/class-report/${sectionId}`, {
      params: { academicYearId, termId },
      responseType: 'blob',
    });
    return response;
  }

  // Export exam results
  async exportExamResults(format: 'csv' | 'excel' | 'pdf' = 'excel', params?: PaginationQuery): Promise<Blob> {
    const response = await apiService.get('/exams/export', {
      params: { format, ...params },
      responseType: 'blob',
    });
    return response;
  }

  // Get exam types
  async getExamTypes(): Promise<ApiResponse<any[]>> {
    return await apiService.get<ApiResponse<any[]>>('/exams/types');
  }

  // Calculate grades
  async calculateGrades(examinationId: number): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>(`/exams/${examinationId}/calculate-grades`);
  }
}

export const examService = new ExamService();





