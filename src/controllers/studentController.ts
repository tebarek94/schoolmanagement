import { Request, Response } from 'express';
import { StudentService } from '@/services/studentService';
import { CreateStudentRequest, PaginationQuery, ApiResponse } from '@/types';
import { asyncHandler } from '@/middlewares/errorHandler';

export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  // Create new student
  createStudent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentData: CreateStudentRequest = req.body;
    
    const student = await this.studentService.createStudent(studentData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student created successfully',
      data: student,
    };
    
    res.status(201).json(response);
  });

  // Get all students
  getStudents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC',
    };
    
    const { students, total } = await this.studentService.getStudents(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Students retrieved successfully',
      data: students,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get student by ID
  getStudentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const student = await this.studentService.getStudentById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student retrieved successfully',
      data: student,
    };
    
    res.status(200).json(response);
  });

  // Get student by student ID
  getStudentByStudentId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentId = req.params.studentId;
    
    const student = await this.studentService.getStudentByStudentId(studentId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student retrieved successfully',
      data: student,
    };
    
    res.status(200).json(response);
  });

  // Update student
  updateStudent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const student = await this.studentService.updateStudent(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student updated successfully',
      data: student,
    };
    
    res.status(200).json(response);
  });

  // Delete student
  deleteStudent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.studentService.deleteStudent(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // Get students by section
  getStudentsBySection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sectionId = parseInt(req.params.sectionId);
    const academicYearId = parseInt(req.query.academicYearId as string) || 1; // Default to current year
    
    const students = await this.studentService.getStudentsBySection(sectionId, academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Students retrieved successfully',
      data: students,
    };
    
    res.status(200).json(response);
  });

  // Get students by grade
  getStudentsByGrade = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const gradeId = parseInt(req.params.gradeId);
    const academicYearId = parseInt(req.query.academicYearId as string) || 1; // Default to current year
    
    const students = await this.studentService.getStudentsByGrade(gradeId, academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Students retrieved successfully',
      data: students,
    };
    
    res.status(200).json(response);
  });

  // Enroll student in section
  enrollStudentInSection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentId = parseInt(req.params.studentId);
    const { sectionId, academicYearId } = req.body;
    
    await this.studentService.enrollStudentInSection(studentId, sectionId, academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student enrolled successfully',
    };
    
    res.status(200).json(response);
  });

  // Transfer student to different section
  transferStudent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentId = parseInt(req.params.studentId);
    const { newSectionId, academicYearId } = req.body;
    
    await this.studentService.transferStudent(studentId, newSectionId, academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student transferred successfully',
    };
    
    res.status(200).json(response);
  });

  // Get student statistics
  getStudentStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.studentService.getStudentStats();
    
    const response: ApiResponse = {
      success: true,
      message: 'Student statistics retrieved successfully',
      data: stats,
    };
    
    res.status(200).json(response);
  });
}
