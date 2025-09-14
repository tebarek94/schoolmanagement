import { Router } from 'express';
import { TeacherController } from '@/controllers/teacherController';
import { authenticate, adminOnly, teacherOrAdmin } from '@/middlewares/auth';
import { teacherValidations, commonValidations } from '@/middlewares/validation';

const router = Router();
const teacherController = new TeacherController();

// All routes require authentication
router.use(authenticate);

// Create teacher (Admin only)
router.post('/', adminOnly, teacherValidations.create, teacherController.createTeacher);

// Get all teachers (Admin/Teacher only)
router.get('/', teacherOrAdmin, commonValidations.pagination, teacherController.getTeachers);

// Get teacher statistics (Admin only)
router.get('/stats', adminOnly, teacherController.getTeacherStats);

// Get teacher by ID (Admin/Teacher only)
router.get('/:id', teacherOrAdmin, commonValidations.id, teacherController.getTeacherById);

// Get teacher by employee ID (Admin/Teacher only)
router.get('/employee-id/:employeeId', teacherOrAdmin, teacherController.getTeacherByEmployeeId);

// Update teacher (Admin only)
router.put('/:id', adminOnly, teacherValidations.update, teacherController.updateTeacher);

// Delete teacher (Admin only)
router.delete('/:id', adminOnly, commonValidations.id, teacherController.deleteTeacher);

// Assign teacher to subject (Admin only)
router.post('/:teacherId/assign-subject', adminOnly, teacherController.assignTeacherToSubject);

// Assign teacher as class teacher (Admin only)
router.post('/:teacherId/assign-class', adminOnly, teacherController.assignClassTeacher);

// Get teacher's subjects (Admin/Teacher only)
router.get('/:teacherId/subjects', teacherOrAdmin, teacherController.getTeacherSubjects);

// Get teacher's sections (Admin/Teacher only)
router.get('/:teacherId/sections', teacherOrAdmin, teacherController.getTeacherSections);

export default router;
