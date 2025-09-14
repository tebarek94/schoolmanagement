import { apiService } from './api';
import { 
  Grade, 
  Section, 
  Subject, 
  AcademicYear, 
  Term,
  ApiResponse, 
  PaginationQuery
} from '../types';

export class AcademicService {
  // Grades
  async getGrades(): Promise<ApiResponse<Grade[]>> {
    return await apiService.get<ApiResponse<Grade[]>>('/academic/grades');
  }

  async createGrade(gradeData: Partial<Grade>): Promise<ApiResponse<Grade>> {
    return await apiService.post<ApiResponse<Grade>>('/academic/grades', gradeData);
  }

  async updateGrade(id: number, gradeData: Partial<Grade>): Promise<ApiResponse<Grade>> {
    return await apiService.put<ApiResponse<Grade>>(`/academic/grades/${id}`, gradeData);
  }

  async deleteGrade(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/academic/grades/${id}`);
  }

  // Sections
  async getSections(params?: PaginationQuery): Promise<ApiResponse<Section[]>> {
    return await apiService.get<ApiResponse<Section[]>>('/academic/sections', { params });
  }

  async getSectionsByGrade(gradeId: number): Promise<ApiResponse<Section[]>> {
    return await apiService.get<ApiResponse<Section[]>>(`/academic/sections/grade/${gradeId}`);
  }

  async createSection(sectionData: Partial<Section>): Promise<ApiResponse<Section>> {
    return await apiService.post<ApiResponse<Section>>('/academic/sections', sectionData);
  }

  async updateSection(id: number, sectionData: Partial<Section>): Promise<ApiResponse<Section>> {
    return await apiService.put<ApiResponse<Section>>(`/academic/sections/${id}`, sectionData);
  }

  async deleteSection(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/academic/sections/${id}`);
  }

  // Subjects
  async getSubjects(): Promise<ApiResponse<Subject[]>> {
    return await apiService.get<ApiResponse<Subject[]>>('/academic/subjects');
  }

  async getSubjectsByGrade(gradeId: number): Promise<ApiResponse<Subject[]>> {
    return await apiService.get<ApiResponse<Subject[]>>(`/academic/subjects/grade/${gradeId}`);
  }

  async createSubject(subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    return await apiService.post<ApiResponse<Subject>>('/academic/subjects', subjectData);
  }

  async updateSubject(id: number, subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    return await apiService.put<ApiResponse<Subject>>(`/academic/subjects/${id}`, subjectData);
  }

  async deleteSubject(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/academic/subjects/${id}`);
  }

  // Academic Years
  async getAcademicYears(): Promise<ApiResponse<AcademicYear[]>> {
    return await apiService.get<ApiResponse<AcademicYear[]>>('/academic/years');
  }

  async getCurrentAcademicYear(): Promise<ApiResponse<AcademicYear>> {
    return await apiService.get<ApiResponse<AcademicYear>>('/academic/years/current');
  }

  async createAcademicYear(yearData: Partial<AcademicYear>): Promise<ApiResponse<AcademicYear>> {
    return await apiService.post<ApiResponse<AcademicYear>>('/academic/years', yearData);
  }

  async updateAcademicYear(id: number, yearData: Partial<AcademicYear>): Promise<ApiResponse<AcademicYear>> {
    return await apiService.put<ApiResponse<AcademicYear>>(`/academic/years/${id}`, yearData);
  }

  async deleteAcademicYear(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/academic/years/${id}`);
  }

  async setCurrentAcademicYear(id: number): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>(`/academic/years/${id}/set-current`);
  }

  // Terms
  async getTerms(academicYearId?: number): Promise<ApiResponse<Term[]>> {
    return await apiService.get<ApiResponse<Term[]>>('/academic/terms', {
      params: academicYearId ? { academicYearId } : undefined
    });
  }

  async getCurrentTerm(): Promise<ApiResponse<Term>> {
    return await apiService.get<ApiResponse<Term>>('/academic/terms/current');
  }

  async createTerm(termData: Partial<Term>): Promise<ApiResponse<Term>> {
    return await apiService.post<ApiResponse<Term>>('/academic/terms', termData);
  }

  async updateTerm(id: number, termData: Partial<Term>): Promise<ApiResponse<Term>> {
    return await apiService.put<ApiResponse<Term>>(`/academic/terms/${id}`, termData);
  }

  async deleteTerm(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/academic/terms/${id}`);
  }

  async setCurrentTerm(id: number): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>(`/academic/terms/${id}/set-current`);
  }

  // Grade-Subject mapping
  async assignSubjectToGrade(gradeId: number, subjectId: number, isCompulsory: boolean = true): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>('/academic/grade-subjects', {
      gradeId,
      subjectId,
      isCompulsory,
    });
  }

  async removeSubjectFromGrade(gradeId: number, subjectId: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/academic/grade-subjects/${gradeId}/${subjectId}`);
  }

  // Academic statistics
  async getAcademicStats(): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>('/academic/stats');
  }
}

export const academicService = new AcademicService();





