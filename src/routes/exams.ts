import { Router } from 'express';
import { ExamController } from '@/controllers/examController';
import { authenticate, adminOnly, teacherOrAdmin } from '@/middlewares/auth';
import { examValidations, commonValidations } from '@/middlewares/validation';

const router = Router();
const examController = new ExamController();

// All routes require authentication
router.use(authenticate);

// =============================================
// EXAMINATIONS ROUTES
// =============================================

// Create examination (Admin/Teacher only)
router.post('/examinations', teacherOrAdmin, examValidations.create, examController.createExamination);

// Get all examinations (Admin/Teacher only)
router.get('/examinations', teacherOrAdmin, commonValidations.pagination, examController.getExaminations);

// Get upcoming examinations (Admin/Teacher only)
router.get('/examinations/upcoming', teacherOrAdmin, examController.getUpcomingExaminations);

// Get examination by ID (Admin/Teacher only)
router.get('/examinations/:id', teacherOrAdmin, commonValidations.id, examController.getExaminationById);

// Update examination (Admin/Teacher only)
router.put('/examinations/:id', teacherOrAdmin, commonValidations.id, examController.updateExamination);

// Delete examination (Admin only)
router.delete('/examinations/:id', adminOnly, commonValidations.id, examController.deleteExamination);

// =============================================
// EXAM RESULTS ROUTES
// =============================================

// Add exam result (Admin/Teacher only)
router.post('/results', teacherOrAdmin, examValidations.result, examController.addExamResult);

// Get exam results (Admin/Teacher only)
router.get('/results', teacherOrAdmin, commonValidations.pagination, examController.getExamResults);

// Get exam statistics (Admin only)
router.get('/stats', adminOnly, examController.getExamStats);

// Get exam results by examination (Admin/Teacher only)
router.get('/examinations/:examinationId/results', teacherOrAdmin, examController.getExamResultsByExamination);

// Get student exam results (Admin/Teacher only)
router.get('/students/:studentId/results', teacherOrAdmin, examController.getStudentExamResults);

// Update exam result (Admin/Teacher only)
router.put('/results/:id', teacherOrAdmin, commonValidations.id, examController.updateExamResult);

export default router;
