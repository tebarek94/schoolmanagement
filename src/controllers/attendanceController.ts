import { Request, Response } from 'express';
import { AttendanceService } from '@/services/attendanceService';
import { AttendanceRequest, PaginationQuery, ApiResponse } from '@/types';
import { asyncHandler } from '@/middlewares/errorHandler';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  // Mark attendance for a student
  markAttendance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const attendanceData: AttendanceRequest = req.body;
    
    const attendance = await this.attendanceService.markAttendance(attendanceData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Attendance marked successfully',
      data: attendance,
    };
    
    res.status(201).json(response);
  });

  // Mark attendance for multiple students
  markBulkAttendance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const attendanceData: AttendanceRequest[] = req.body;
    
    const attendance = await this.attendanceService.markBulkAttendance(attendanceData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Bulk attendance marked successfully',
      data: attendance,
    };
    
    res.status(201).json(response);
  });

  // Get attendance records
  getAttendanceRecords = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      studentId: req.query.studentId ? parseInt(req.query.studentId as string) : undefined,
      sectionId: req.query.sectionId ? parseInt(req.query.sectionId as string) : undefined,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      status: req.query.status as string,
    };
    
    const { attendance, total } = await this.attendanceService.getAttendanceRecords(query);
    
    const totalPages = Math.ceil(total / query.limit!);
    
    const response: ApiResponse = {
      success: true,
      message: 'Attendance records retrieved successfully',
      data: attendance,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages,
      },
    };
    
    res.status(200).json(response);
  });

  // Get attendance by ID
  getAttendanceById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    const attendance = await this.attendanceService.getAttendanceById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Attendance record retrieved successfully',
      data: attendance,
    };
    
    res.status(200).json(response);
  });

  // Update attendance
  updateAttendance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const attendance = await this.attendanceService.updateAttendance(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Attendance updated successfully',
      data: attendance,
    };
    
    res.status(200).json(response);
  });

  // Delete attendance
  deleteAttendance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    
    await this.attendanceService.deleteAttendance(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Attendance record deleted successfully',
    };
    
    res.status(200).json(response);
  });

  // Get student attendance summary
  getStudentAttendanceSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentId = parseInt(req.params.studentId);
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    const summary = await this.attendanceService.getStudentAttendanceSummary(studentId, startDate, endDate);
    
    const response: ApiResponse = {
      success: true,
      message: 'Student attendance summary retrieved successfully',
      data: summary,
    };
    
    res.status(200).json(response);
  });

  // Get section attendance summary
  getSectionAttendanceSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sectionId = parseInt(req.params.sectionId);
    const date = req.query.date as string;
    
    const summary = await this.attendanceService.getSectionAttendanceSummary(sectionId, date);
    
    const response: ApiResponse = {
      success: true,
      message: 'Section attendance summary retrieved successfully',
      data: summary,
    };
    
    res.status(200).json(response);
  });

  // Get daily attendance report
  getDailyAttendanceReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const date = req.params.date;
    const sectionId = req.query.sectionId ? parseInt(req.query.sectionId as string) : undefined;
    
    const report = await this.attendanceService.getDailyAttendanceReport(date, sectionId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Daily attendance report retrieved successfully',
      data: report,
    };
    
    res.status(200).json(response);
  });

  // Get monthly attendance report
  getMonthlyAttendanceReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const sectionId = req.query.sectionId ? parseInt(req.query.sectionId as string) : undefined;
    
    const report = await this.attendanceService.getMonthlyAttendanceReport(year, month, sectionId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Monthly attendance report retrieved successfully',
      data: report,
    };
    
    res.status(200).json(response);
  });

  // Get attendance statistics
  getAttendanceStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.attendanceService.getAttendanceStats();
    
    const response: ApiResponse = {
      success: true,
      message: 'Attendance statistics retrieved successfully',
      data: stats,
    };
    
    res.status(200).json(response);
  });
}
