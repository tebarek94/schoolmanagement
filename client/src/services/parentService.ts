import { apiService } from './api';
import { 
  Parent, 
  CreateParentRequest, 
  ApiResponse, 
  PaginationQuery,
  Student
} from '../types';

export class ParentService {
  // Get all parents with pagination
  async getParents(params?: PaginationQuery): Promise<ApiResponse<Parent[]>> {
    return await apiService.get<ApiResponse<Parent[]>>('/parents', { params });
  }

  // Get parent by ID
  async getParentById(id: number): Promise<ApiResponse<Parent>> {
    return await apiService.get<ApiResponse<Parent>>(`/parents/${id}`);
  }

  // Create new parent
  async createParent(parentData: CreateParentRequest): Promise<ApiResponse<Parent>> {
    return await apiService.post<ApiResponse<Parent>>('/parents', parentData);
  }

  // Update parent
  async updateParent(id: number, parentData: Partial<CreateParentRequest>): Promise<ApiResponse<Parent>> {
    return await apiService.put<ApiResponse<Parent>>(`/parents/${id}`, parentData);
  }

  // Delete parent
  async deleteParent(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/parents/${id}`);
  }

  // Get parent's children
  async getParentChildren(parentId: number): Promise<ApiResponse<Student[]>> {
    return await apiService.get<ApiResponse<Student[]>>(`/parents/${parentId}/children`);
  }

  // Link parent to student
  async linkParentToStudent(parentId: number, studentId: number, relationship: string, isPrimary: boolean = false): Promise<ApiResponse<void>> {
    return await apiService.post<ApiResponse<void>>(`/parents/${parentId}/link-student`, {
      studentId,
      relationship,
      isPrimary,
    });
  }

  // Unlink parent from student
  async unlinkParentFromStudent(parentId: number, studentId: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/parents/${parentId}/unlink-student/${studentId}`);
  }

  // Search parents
  async searchParents(query: string): Promise<ApiResponse<Parent[]>> {
    return await apiService.get<ApiResponse<Parent[]>>('/parents', {
      params: { search: query }
    });
  }

  // Get parent statistics
  async getParentStats(): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>('/parents/stats');
  }

  // Export parents data
  async exportParents(format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
    const response = await apiService.get(`/parents/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response;
  }
}

export const parentService = new ParentService();





