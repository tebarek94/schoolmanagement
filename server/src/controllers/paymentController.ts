import { Request, Response } from 'express';
import { PaymentService } from '@/services/paymentService';
import { PaymentRequest, PaginationQuery, ApiResponse } from '@/types';
import { asyncHandler } from '@/middlewares/errorHandler';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  // =============================================
  // PAYMENT MANAGEMENT
  // =============================================

  // Create new payment
  createPayment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const paymentData: PaymentRequest = req.body;
    
    const payment = await this.paymentService.createPayment(paymentData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Payment created successfully',
      data: payment,
    };
    
    res.status(201).json(response);
  });

  // Get all payments
  getPayments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      studentId: req.query.studentId ? parseInt(req.query.studentId as string) : undefined,
      status: req.query.status as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };
    
    const { payments, total } = await this.paymentService.getPayments(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Payments retrieved successfully',
      data: payments,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get payment by ID
  getPaymentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const payment = await this.paymentService.getPaymentById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Payment retrieved successfully',
      data: payment,
    };
    
    res.status(200).json(response);
  });

  // Update payment
  updatePayment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const payment = await this.paymentService.updatePayment(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Payment updated successfully',
      data: payment,
    };
    
    res.status(200).json(response);
  });

  // Delete payment
  deletePayment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.paymentService.deletePayment(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Payment deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // Get student payments
  getStudentPayments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentId = parseInt(req.params.studentId);
    const academicYearId = req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined;
    const termId = req.query.termId ? parseInt(req.query.termId as string) : undefined;
    
    const payments = await this.paymentService.getStudentPayments(studentId, academicYearId, termId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student payments retrieved successfully',
      data: payments,
    };
    
    res.status(200).json(response);
  });

  // Get payment statistics
  getPaymentStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.paymentService.getPaymentStats();
    
    const response: ApiResponse = {
      success: true,
      message: 'Payment statistics retrieved successfully',
      data: stats,
    };
    
    res.status(200).json(response);
  });

  // Get outstanding payments
  getOutstandingPayments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const outstandingPayments = await this.paymentService.getOutstandingPayments();
    
    const response: ApiResponse = {
      success: true,
      message: 'Outstanding payments retrieved successfully',
      data: outstandingPayments,
    };
    
    res.status(200).json(response);
  });

  // Get monthly payment report
  getMonthlyPaymentReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    const report = await this.paymentService.getMonthlyPaymentReport(year, month);
    
    const response: ApiResponse = {
      success: true,
      message: 'Monthly payment report retrieved successfully',
      data: report,
    };
    
    res.status(200).json(response);
  });

  // =============================================
  // FEE STRUCTURE MANAGEMENT
  // =============================================

  // Create fee structure
  createFeeStructure = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const feeStructureData = req.body;
    
    const feeStructure = await this.paymentService.createFeeStructure(feeStructureData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Fee structure created successfully',
      data: feeStructure,
    };
    
    res.status(201).json(response);
  });

  // Get fee structures
  getFeeStructures = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      gradeId: req.query.gradeId ? parseInt(req.query.gradeId as string) : undefined,
      academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
      termId: req.query.termId ? parseInt(req.query.termId as string) : undefined,
    };
    
    const { feeStructures, total } = await this.paymentService.getFeeStructures(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Fee structures retrieved successfully',
      data: feeStructures,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get fee structure by ID
  getFeeStructureById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const feeStructure = await this.paymentService.getFeeStructureById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Fee structure retrieved successfully',
      data: feeStructure,
    };
    
    res.status(200).json(response);
  });

  // Update fee structure
  updateFeeStructure = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const feeStructure = await this.paymentService.updateFeeStructure(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Fee structure updated successfully',
      data: feeStructure,
    };
    
    res.status(200).json(response);
  });

  // Delete fee structure
  deleteFeeStructure = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.paymentService.deleteFeeStructure(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Fee structure deleted successfully',
    };
    
    res.status(200).json(response);
  });
}
