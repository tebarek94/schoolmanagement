import { Router } from 'express';
import { StudentController } from '@/controllers/studentController';
import { authenticate, adminOnly, teacherOrAdmin } from '@/middlewares/auth';
import { studentValidations, commonValidations } from '@/middlewares/validation';

const router = Router();
const studentController = new StudentController();

// All routes require authentication
router.use(authenticate);

// Create student (Admin only)
router.post('/', adminOnly, studentValidations.create, studentController.createStudent);

// Get all students (Admin/Teacher only)
router.get('/', teacherOrAdmin, commonValidations.pagination, studentController.getStudents);

// Get student statistics (Admin only)
router.get('/stats', adminOnly, studentController.getStudentStats);

// Get students by section (Admin/Teacher only)
router.get('/section/:sectionId', teacherOrAdmin, studentController.getStudentsBySection);

// Get students by grade (Admin/Teacher only)
router.get('/grade/:gradeId', teacherOrAdmin, studentController.getStudentsByGrade);

// Get student by ID (Admin/Teacher only)
router.get('/:id', teacherOrAdmin, commonValidations.id, studentController.getStudentById);

// Get student by student ID (Admin/Teacher only)
router.get('/student-id/:studentId', teacherOrAdmin, studentController.getStudentByStudentId);

// Update student (Admin only)
router.put('/:id', adminOnly, studentValidations.update, studentController.updateStudent);

// Delete student (Admin only)
router.delete('/:id', adminOnly, commonValidations.id, studentController.deleteStudent);

// Enroll student in section (Admin only)
router.post('/:studentId/enroll', adminOnly, studentController.enrollStudentInSection);

// Transfer student (Admin only)
router.post('/:studentId/transfer', adminOnly, studentController.transferStudent);

export default router;
