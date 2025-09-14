import { Router } from 'express';
import { ParentController } from '@/controllers/parentController';
import { authenticate, adminOnly, parentOrAdmin } from '@/middlewares/auth';
import { parentValidations, commonValidations } from '@/middlewares/validation';

const router = Router();
const parentController = new ParentController();

// All routes require authentication
router.use(authenticate);

// Create parent (Admin only)
router.post('/', adminOnly, parentValidations.create, parentController.createParent);

// Get all parents (Admin only)
router.get('/', adminOnly, commonValidations.pagination, parentController.getParents);

// Get parent statistics (Admin only)
router.get('/stats', adminOnly, parentController.getParentStats);

// Get parent by ID (Admin/Parent only)
router.get('/:id', parentOrAdmin, commonValidations.id, parentController.getParentById);

// Update parent (Admin/Parent only)
router.put('/:id', parentOrAdmin, parentValidations.update, parentController.updateParent);

// Delete parent (Admin only)
router.delete('/:id', adminOnly, commonValidations.id, parentController.deleteParent);

// Link parent to student (Admin only)
router.post('/:parentId/link-student', adminOnly, parentController.linkParentToStudent);

// Unlink parent from student (Admin only)
router.delete('/:parentId/unlink-student/:studentId', adminOnly, parentController.unlinkParentFromStudent);

// Get parent's students (Admin/Parent only)
router.get('/:parentId/students', parentOrAdmin, parentController.getParentStudents);

// Get student's parents (Admin/Parent only)
router.get('/student/:studentId', parentOrAdmin, parentController.getStudentParents);

export default router;
