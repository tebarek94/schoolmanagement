import { apiService } from './api';
import { 
  Payment, 
  FeeStructure, 
  PaymentRequest, 
  ApiResponse, 
  PaginationQuery
} from '../types';

export class PaymentService {
  // Payments
  async getPayments(params?: PaginationQuery): Promise<ApiResponse<Payment[]>> {
    return await apiService.get<ApiResponse<Payment[]>>('/payments', { params });
  }

  async getPaymentById(id: number): Promise<ApiResponse<Payment>> {
    return await apiService.get<ApiResponse<Payment>>(`/payments/${id}`);
  }

  async createPayment(paymentData: PaymentRequest): Promise<ApiResponse<Payment>> {
    return await apiService.post<ApiResponse<Payment>>('/payments', paymentData);
  }

  async updatePayment(id: number, paymentData: Partial<PaymentRequest>): Promise<ApiResponse<Payment>> {
    return await apiService.put<ApiResponse<Payment>>(`/payments/${id}`, paymentData);
  }

  async deletePayment(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/payments/${id}`);
  }

  // Get payments by student
  async getStudentPayments(studentId: number, startDate?: string, endDate?: string): Promise<ApiResponse<Payment[]>> {
    return await apiService.get<ApiResponse<Payment[]>>(`/payments/students/${studentId}/payments`, {
      params: { startDate, endDate }
    });
  }

  // Get outstanding payments (pending/overdue)
  async getOutstandingPayments(params?: PaginationQuery): Promise<ApiResponse<Payment[]>> {
    return await apiService.get<ApiResponse<Payment[]>>('/payments/outstanding', { params });
  }

  // Fee Structures
  async getFeeStructures(params?: PaginationQuery): Promise<ApiResponse<FeeStructure[]>> {
    return await apiService.get<ApiResponse<FeeStructure[]>>('/payments/fee-structures', { params });
  }

  async getFeeStructureById(id: number): Promise<ApiResponse<FeeStructure>> {
    return await apiService.get<ApiResponse<FeeStructure>>(`/payments/fee-structures/${id}`);
  }

  async createFeeStructure(feeData: Partial<FeeStructure>): Promise<ApiResponse<FeeStructure>> {
    return await apiService.post<ApiResponse<FeeStructure>>('/payments/fee-structures', feeData);
  }

  async updateFeeStructure(id: number, feeData: Partial<FeeStructure>): Promise<ApiResponse<FeeStructure>> {
    return await apiService.put<ApiResponse<FeeStructure>>(`/payments/fee-structures/${id}`, feeData);
  }

  async deleteFeeStructure(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(`/payments/fee-structures/${id}`);
  }

  // Get fee structures by grade (not implemented in backend yet)
  // async getFeeStructuresByGrade(gradeId: number, academicYearId?: number, termId?: number): Promise<ApiResponse<FeeStructure[]>> {
  //   return await apiService.get<ApiResponse<FeeStructure[]>>(`/payments/fee-structures/grade/${gradeId}`, {
  //     params: { academicYearId, termId }
  //   });
  // }

  // Payment statistics
  async getPaymentStats(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    return await apiService.get<ApiResponse<any>>('/payments/stats', {
      params: { startDate, endDate }
    });
  }

  // Get student payment summary (not implemented in backend yet)
  // async getStudentPaymentSummary(studentId: number, academicYearId?: number, termId?: number): Promise<ApiResponse<any>> {
  //   return await apiService.get<ApiResponse<any>>(`/payments/students/${studentId}/summary`, {
  //     params: { academicYearId, termId }
  //   });
  // }

  // Generate payment receipt (not implemented in backend yet)
  // async generatePaymentReceipt(paymentId: number): Promise<Blob> {
  //   const response = await apiService.get(`/payments/${paymentId}/receipt`, {
  //     responseType: 'blob',
  //   });
  //   return response;
  // }

  // Generate fee statement (not implemented in backend yet)
  // async generateFeeStatement(studentId: number, academicYearId?: number, termId?: number): Promise<Blob> {
  //   const response = await apiService.get(`/payments/students/${studentId}/fee-statement`, {
  //     params: { academicYearId, termId },
  //     responseType: 'blob',
  //   });
  //   return response;
  // }

  // Export payments (not implemented in backend yet)
  // async exportPayments(format: 'csv' | 'excel' | 'pdf' = 'excel', params?: PaginationQuery): Promise<Blob> {
  //   const response = await apiService.get('/payments/export', {
  //     params: { format, ...params },
  //     responseType: 'blob',
  //   });
  //   return response;
  // }

  // Get payment methods (not implemented in backend yet)
  // async getPaymentMethods(): Promise<ApiResponse<string[]>> {
  //   return await apiService.get<ApiResponse<string[]>>('/payments/methods');
  // }

  // Get payment statuses (not implemented in backend yet)
  // async getPaymentStatuses(): Promise<ApiResponse<string[]>> {
  //   return await apiService.get<ApiResponse<string[]>>('/payments/statuses');
  // }

  // Get fee types (not implemented in backend yet)
  // async getFeeTypes(): Promise<ApiResponse<string[]>> {
  //   return await apiService.get<ApiResponse<string[]>>('/payments/fee-types');
  // }

  // Bulk payment processing (not implemented in backend yet)
  // async processBulkPayments(paymentsData: PaymentRequest[]): Promise<ApiResponse<Payment[]>> {
  //   return await apiService.post<ApiResponse<Payment[]>>('/payments/bulk', paymentsData);
  // }

  // Payment reminders (not implemented in backend yet)
  // async sendPaymentReminders(studentIds: number[]): Promise<ApiResponse<void>> {
  //   return await apiService.post<ApiResponse<void>>('/payments/send-reminders', { studentIds });
  // }

  // Payment analytics (not implemented in backend yet)
  // async getPaymentAnalytics(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
  //   return await apiService.get<ApiResponse<any>>('/payments/analytics', {
  //     params: { startDate, endDate }
  //   });
  // }
}

export const paymentService = new PaymentService();





