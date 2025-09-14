import { Request, Response } from 'express';
import { ParentService } from '@/services/parentService';
import { CreateParentRequest, PaginationQuery, ApiResponse } from '@/types';
import { asyncHandler } from '@/middlewares/errorHandler';

export class ParentController {
  private parentService: ParentService;

  constructor() {
    this.parentService = new ParentService();
  }

  // Create new parent
  createParent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parentData: CreateParentRequest = req.body;
    
    const parent = await this.parentService.createParent(parentData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Parent created successfully',
      data: parent,
    };
    
    res.status(201).json(response);
  });

  // Get all parents
  getParents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC',
    };
    
    const { parents, total } = await this.parentService.getParents(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Parents retrieved successfully',
      data: parents,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get parent by ID
  getParentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const parent = await this.parentService.getParentById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Parent retrieved successfully',
      data: parent,
    };
    
    res.status(200).json(response);
  });

  // Update parent
  updateParent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const parent = await this.parentService.updateParent(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Parent updated successfully',
      data: parent,
    };
    
    res.status(200).json(response);
  });

  // Delete parent
  deleteParent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.parentService.deleteParent(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Parent deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // Link parent to student
  linkParentToStudent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parentId = parseInt(req.params.parentId);
    const { studentId, relationship, isPrimary } = req.body;
    
    await this.parentService.linkParentToStudent(parentId, studentId, relationship, isPrimary);
    
    const response: ApiResponse = {
      success: true,
      message: 'Parent linked to student successfully',
    };
    
    res.status(200).json(response);
  });

  // Unlink parent from student
  unlinkParentFromStudent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parentId = parseInt(req.params.parentId);
    const studentId = parseInt(req.params.studentId);
    
    await this.parentService.unlinkParentFromStudent(parentId, studentId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Parent unlinked from student successfully',
    };
    
    res.status(200).json(response);
  });

  // Get parent's students
  getParentStudents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parentId = parseInt(req.params.parentId);
    
    const students = await this.parentService.getParentStudents(parentId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Parent students retrieved successfully',
      data: students,
    };
    
    res.status(200).json(response);
  });

  // Get student's parents
  getStudentParents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentId = parseInt(req.params.studentId);
    
    const parents = await this.parentService.getStudentParents(studentId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student parents retrieved successfully',
      data: parents,
    };
    
    res.status(200).json(response);
  });

  // Get parent statistics
  getParentStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.parentService.getParentStats();
    
    const response: ApiResponse = {
      success: true,
      message: 'Parent statistics retrieved successfully',
      data: stats,
    };
    
    res.status(200).json(response);
  });
}
