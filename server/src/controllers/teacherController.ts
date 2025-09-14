import { Request, Response } from 'express';
import { TeacherService } from '@/services/teacherService';
import { CreateTeacherRequest, PaginationQuery, ApiResponse } from '@/types';
import { asyncHandler } from '@/middlewares/errorHandler';

export class TeacherController {
  private teacherService: TeacherService;

  constructor() {
    this.teacherService = new TeacherService();
  }

  // Create new teacher
  createTeacher = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const teacherData: CreateTeacherRequest = req.body;
    
    const teacher = await this.teacherService.createTeacher(teacherData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher created successfully',
      data: teacher,
    };
    
    res.status(201).json(response);
  });

  // Get all teachers
  getTeachers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC',
    };
    
    const { teachers, total } = await this.teacherService.getTeachers(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teachers retrieved successfully',
      data: teachers,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get teacher by ID
  getTeacherById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const teacher = await this.teacherService.getTeacherById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher retrieved successfully',
      data: teacher,
    };
    
    res.status(200).json(response);
  });

  // Get teacher by employee ID
  getTeacherByEmployeeId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const employeeId = req.params.employeeId;
    
    const teacher = await this.teacherService.getTeacherByEmployeeId(employeeId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher retrieved successfully',
      data: teacher,
    };
    
    res.status(200).json(response);
  });

  // Update teacher
  updateTeacher = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const teacher = await this.teacherService.updateTeacher(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher updated successfully',
      data: teacher,
    };
    
    res.status(200).json(response);
  });

  // Delete teacher
  deleteTeacher = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.teacherService.deleteTeacher(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // Assign teacher to subject
  assignTeacherToSubject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const teacherId = parseInt(req.params.teacherId);
    const { subjectId, gradeId, academicYearId } = req.body;
    
    await this.teacherService.assignTeacherToSubject(teacherId, subjectId, gradeId, academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher assigned to subject successfully',
    };
    
    res.status(200).json(response);
  });

  // Assign teacher as class teacher
  assignClassTeacher = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const teacherId = parseInt(req.params.teacherId);
    const { sectionId, academicYearId } = req.body;
    
    await this.teacherService.assignClassTeacher(teacherId, sectionId, academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher assigned as class teacher successfully',
    };
    
    res.status(200).json(response);
  });

  // Get teacher's subjects
  getTeacherSubjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const teacherId = parseInt(req.params.teacherId);
    const academicYearId = parseInt(req.query.academicYearId as string) || 1;
    
    const subjects = await this.teacherService.getTeacherSubjects(teacherId, academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher subjects retrieved successfully',
      data: subjects,
    };
    
    res.status(200).json(response);
  });

  // Get teacher's sections
  getTeacherSections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const teacherId = parseInt(req.params.teacherId);
    const academicYearId = parseInt(req.query.academicYearId as string) || 1;
    
    const sections = await this.teacherService.getTeacherSections(teacherId, academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher sections retrieved successfully',
      data: sections,
    };
    
    res.status(200).json(response);
  });

  // Get teacher statistics
  getTeacherStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.teacherService.getTeacherStats();
    
    const response: ApiResponse = {
      success: true,
      message: 'Teacher statistics retrieved successfully',
      data: stats,
    };
    
    res.status(200).json(response);
  });
}
