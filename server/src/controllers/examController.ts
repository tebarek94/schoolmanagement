import { Request, Response } from 'express';
import { ExamService } from '@/services/examService';
import { ExamRequest, ExamResultRequest, PaginationQuery, ApiResponse } from '@/types';
import { asyncHandler } from '@/middlewares/errorHandler';

export class ExamController {
  private examService: ExamService;

  constructor() {
    this.examService = new ExamService();
  }

  // =============================================
  // EXAMINATIONS MANAGEMENT
  // =============================================

  // Create new examination
  createExamination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const examData: ExamRequest = req.body;
    
    const examination = await this.examService.createExamination(examData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Examination created successfully',
      data: examination,
    };
    
    res.status(201).json(response);
  });

  // Get all examinations
  getExaminations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      subjectId: req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined,
      gradeId: req.query.gradeId ? parseInt(req.query.gradeId as string) : undefined,
      sectionId: req.query.sectionId ? parseInt(req.query.sectionId as string) : undefined,
      academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
      termId: req.query.termId ? parseInt(req.query.termId as string) : undefined,
    };
    
    const { examinations, total } = await this.examService.getExaminations(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Examinations retrieved successfully',
      data: examinations,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get examination by ID
  getExaminationById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const examination = await this.examService.getExaminationById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Examination retrieved successfully',
      data: examination,
    };
    
    res.status(200).json(response);
  });

  // Update examination
  updateExamination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const examination = await this.examService.updateExamination(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Examination updated successfully',
      data: examination,
    };
    
    res.status(200).json(response);
  });

  // Delete examination
  deleteExamination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.examService.deleteExamination(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Examination deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // Get upcoming examinations
  getUpcomingExaminations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const days = parseInt(req.query.days as string) || 7;
    
    const examinations = await this.examService.getUpcomingExaminations(days);
    
    const response: ApiResponse = {
      success: true,
      message: 'Upcoming examinations retrieved successfully',
      data: examinations,
    };
    
    res.status(200).json(response);
  });

  // =============================================
  // EXAM RESULTS MANAGEMENT
  // =============================================

  // Add exam result
  addExamResult = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const resultData: ExamResultRequest = req.body;
    
    const result = await this.examService.addExamResult(resultData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Exam result added successfully',
      data: result,
    };
    
    res.status(201).json(response);
  });

  // Update exam result
  updateExamResult = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const result = await this.examService.updateExamResult(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Exam result updated successfully',
      data: result,
    };
    
    res.status(200).json(response);
  });

  // Get exam results
  getExamResults = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      examinationId: req.query.examinationId ? parseInt(req.query.examinationId as string) : undefined,
      studentId: req.query.studentId ? parseInt(req.query.studentId as string) : undefined,
    };
    
    const { results, total } = await this.examService.getExamResults(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Exam results retrieved successfully',
      data: results,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get exam results by examination
  getExamResultsByExamination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const examinationId = parseInt(req.params.examinationId);
    
    const results = await this.examService.getExamResultsByExamination(examinationId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Exam results retrieved successfully',
      data: results,
    };
    
    res.status(200).json(response);
  });

  // Get student exam results
  getStudentExamResults = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentId = parseInt(req.params.studentId);
    const academicYearId = req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined;
    const termId = req.query.termId ? parseInt(req.query.termId as string) : undefined;
    
    const results = await this.examService.getStudentExamResults(studentId, academicYearId, termId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student exam results retrieved successfully',
      data: results,
    };
    
    res.status(200).json(response);
  });

  // Get exam statistics
  getExamStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.examService.getExamStats();
    
    const response: ApiResponse = {
      success: true,
      message: 'Exam statistics retrieved successfully',
      data: stats,
    };
    
    res.status(200).json(response);
  });
}
