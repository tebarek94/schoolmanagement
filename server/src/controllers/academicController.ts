import { Request, Response } from 'express';
import { AcademicService } from '@/services/academicService';
import { PaginationQuery, ApiResponse } from '@/types';
import { asyncHandler } from '@/middlewares/errorHandler';

export class AcademicController {
  private academicService: AcademicService;

  constructor() {
    this.academicService = new AcademicService();
  }

  // =============================================
  // GRADES MANAGEMENT
  // =============================================

  // Create new grade
  createGrade = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const gradeData = req.body;
    
    const grade = await this.academicService.createGrade(gradeData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Grade created successfully',
      data: grade,
    };
    
    res.status(201).json(response);
  });

  // Get all grades
  getGrades = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const grades = await this.academicService.getGrades();
    
    const response: ApiResponse = {
      success: true,
      message: 'Grades retrieved successfully',
      data: grades,
    };
    
    res.status(200).json(response);
  });

  // Get grade by ID
  getGradeById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const grade = await this.academicService.getGradeById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Grade retrieved successfully',
      data: grade,
    };
    
    res.status(200).json(response);
  });

  // Update grade
  updateGrade = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const grade = await this.academicService.updateGrade(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Grade updated successfully',
      data: grade,
    };
    
    res.status(200).json(response);
  });

  // Delete grade
  deleteGrade = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.academicService.deleteGrade(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Grade deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // =============================================
  // SECTIONS MANAGEMENT
  // =============================================

  // Create new section
  createSection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sectionData = req.body;
    
    const section = await this.academicService.createSection(sectionData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Section created successfully',
      data: section,
    };
    
    res.status(201).json(response);
  });

  // Get all sections
  getSections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      gradeId: req.query.gradeId ? parseInt(req.query.gradeId as string) : undefined,
      academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
    };
    
    const { sections, total } = await this.academicService.getSections(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Sections retrieved successfully',
      data: sections,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get section by ID
  getSectionById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const section = await this.academicService.getSectionById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Section retrieved successfully',
      data: section,
    };
    
    res.status(200).json(response);
  });

  // Update section
  updateSection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const section = await this.academicService.updateSection(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Section updated successfully',
      data: section,
    };
    
    res.status(200).json(response);
  });

  // Delete section
  deleteSection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.academicService.deleteSection(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Section deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // =============================================
  // SUBJECTS MANAGEMENT
  // =============================================

  // Create new subject
  createSubject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const subjectData = req.body;
    
    const subject = await this.academicService.createSubject(subjectData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Subject created successfully',
      data: subject,
    };
    
    res.status(201).json(response);
  });

  // Get all subjects
  getSubjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
    };
    
    const { subjects, total } = await this.academicService.getSubjects(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Subjects retrieved successfully',
      data: subjects,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get subject by ID
  getSubjectById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const subject = await this.academicService.getSubjectById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Subject retrieved successfully',
      data: subject,
    };
    
    res.status(200).json(response);
  });

  // Update subject
  updateSubject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const subject = await this.academicService.updateSubject(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    };
    
    res.status(200).json(response);
  });

  // Delete subject
  deleteSubject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.academicService.deleteSubject(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Subject deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // Assign subject to grade
  assignSubjectToGrade = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { gradeId, subjectId, isCompulsory } = req.body;
    
    await this.academicService.assignSubjectToGrade(gradeId, subjectId, isCompulsory);
    
    const response: ApiResponse = {
      success: true,
      message: 'Subject assigned to grade successfully',
    };
    
    res.status(200).json(response);
  });

  // Get subjects by grade
  getSubjectsByGrade = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const gradeId = parseInt(req.params.gradeId);
    
    const subjects = await this.academicService.getSubjectsByGrade(gradeId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Grade subjects retrieved successfully',
      data: subjects,
    };
    
    res.status(200).json(response);
  });

  // =============================================
  // ACADEMIC YEARS MANAGEMENT
  // =============================================

  // Create new academic year
  createAcademicYear = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const academicYearData = req.body;
    
    const academicYear = await this.academicService.createAcademicYear(academicYearData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Academic year created successfully',
      data: academicYear,
    };
    
    res.status(201).json(response);
  });

  // Get all academic years
  getAcademicYears = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const academicYears = await this.academicService.getAcademicYears();
    
    const response: ApiResponse = {
      success: true,
      message: 'Academic years retrieved successfully',
      data: academicYears,
    };
    
    res.status(200).json(response);
  });

  // Get current academic year
  getCurrentAcademicYear = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const academicYear = await this.academicService.getCurrentAcademicYear();
    
    const response: ApiResponse = {
      success: true,
      message: 'Current academic year retrieved successfully',
      data: academicYear,
    };
    
    res.status(200).json(response);
  });

  // Set current academic year
  setCurrentAcademicYear = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const yearId = parseInt(req.params.yearId);
    
    await this.academicService.setCurrentAcademicYear(yearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Current academic year updated successfully',
    };
    
    res.status(200).json(response);
  });

  // =============================================
  // TERMS MANAGEMENT
  // =============================================

  // Create new term
  createTerm = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const termData = req.body;
    
    const term = await this.academicService.createTerm(termData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Term created successfully',
      data: term,
    };
    
    res.status(201).json(response);
  });

  // Get terms by academic year
  getTermsByAcademicYear = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const academicYearId = parseInt(req.params.academicYearId);
    
    const terms = await this.academicService.getTermsByAcademicYear(academicYearId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Terms retrieved successfully',
      data: terms,
    };
    
    res.status(200).json(response);
  });

  // Get current term
  getCurrentTerm = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const term = await this.academicService.getCurrentTerm();
    
    const response: ApiResponse = {
      success: true,
      message: 'Current term retrieved successfully',
      data: term,
    };
    
    res.status(200).json(response);
  });

  // Set current term
  setCurrentTerm = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const termId = parseInt(req.params.termId);
    
    await this.academicService.setCurrentTerm(termId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Current term updated successfully',
    };
    
    res.status(200).json(response);
  });
}
