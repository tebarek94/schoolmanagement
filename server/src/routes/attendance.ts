import { Router } from 'express';
import { AttendanceController } from '@/controllers/attendanceController';
import { authenticate, adminOnly, teacherOrAdmin } from '@/middlewares/auth';
import { attendanceValidations, commonValidations } from '@/middlewares/validation';

const router = Router();
const attendanceController = new AttendanceController();

// All routes require authentication
router.use(authenticate);

// Mark attendance for a student (Admin/Teacher only)
router.post('/mark', teacherOrAdmin, attendanceValidations.mark, attendanceController.markAttendance);

// Mark attendance for multiple students (Admin/Teacher only)
router.post('/mark-bulk', teacherOrAdmin, attendanceController.markBulkAttendance);

// Get attendance records (Admin/Teacher only)
router.get('/', teacherOrAdmin, commonValidations.pagination, attendanceController.getAttendanceRecords);

// Get attendance statistics (Admin only)
router.get('/stats', adminOnly, attendanceController.getAttendanceStats);

// Get daily attendance report (Admin/Teacher only)
router.get('/daily/:date', teacherOrAdmin, attendanceController.getDailyAttendanceReport);

// Get monthly attendance report (Admin/Teacher only)
router.get('/monthly/:year/:month', teacherOrAdmin, attendanceController.getMonthlyAttendanceReport);

// Get student attendance summary (Admin/Teacher only)
router.get('/student/:studentId/summary', teacherOrAdmin, attendanceController.getStudentAttendanceSummary);

// Get section attendance summary (Admin/Teacher only)
router.get('/section/:sectionId/summary', teacherOrAdmin, attendanceController.getSectionAttendanceSummary);

// Get attendance by ID (Admin/Teacher only)
router.get('/:id', teacherOrAdmin, commonValidations.id, attendanceController.getAttendanceById);

// Update attendance (Admin/Teacher only)
router.put('/:id', teacherOrAdmin, commonValidations.id, attendanceController.updateAttendance);

// Delete attendance (Admin only)
router.delete('/:id', adminOnly, commonValidations.id, attendanceController.deleteAttendance);

export default router;
