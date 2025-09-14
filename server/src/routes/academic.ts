import { Router } from 'express';
import { AcademicController } from '@/controllers/academicController';
import { authenticate, adminOnly, teacherOrAdmin } from '@/middlewares/auth';
import { commonValidations } from '@/middlewares/validation';

const router = Router();
const academicController = new AcademicController();

// All routes require authentication
router.use(authenticate);

// =============================================
// GRADES ROUTES
// =============================================

// Create grade (Admin only)
router.post('/grades', adminOnly, academicController.createGrade);

// Get all grades (Admin/Teacher only)
router.get('/grades', teacherOrAdmin, academicController.getGrades);

// Get grade by ID (Admin/Teacher only)
router.get('/grades/:id', teacherOrAdmin, commonValidations.id, academicController.getGradeById);

// Update grade (Admin only)
router.put('/grades/:id', adminOnly, commonValidations.id, academicController.updateGrade);

// Delete grade (Admin only)
router.delete('/grades/:id', adminOnly, commonValidations.id, academicController.deleteGrade);

// =============================================
// SECTIONS ROUTES
// =============================================

// Create section (Admin only)
router.post('/sections', adminOnly, academicController.createSection);

// Get all sections (Admin/Teacher only)
router.get('/sections', teacherOrAdmin, commonValidations.pagination, academicController.getSections);

// Get section by ID (Admin/Teacher only)
router.get('/sections/:id', teacherOrAdmin, commonValidations.id, academicController.getSectionById);

// Update section (Admin only)
router.put('/sections/:id', adminOnly, commonValidations.id, academicController.updateSection);

// Delete section (Admin only)
router.delete('/sections/:id', adminOnly, commonValidations.id, academicController.deleteSection);

// =============================================
// SUBJECTS ROUTES
// =============================================

// Create subject (Admin only)
router.post('/subjects', adminOnly, academicController.createSubject);

// Get all subjects (Admin/Teacher only)
router.get('/subjects', teacherOrAdmin, commonValidations.pagination, academicController.getSubjects);

// Get subject by ID (Admin/Teacher only)
router.get('/subjects/:id', teacherOrAdmin, commonValidations.id, academicController.getSubjectById);

// Update subject (Admin only)
router.put('/subjects/:id', adminOnly, commonValidations.id, academicController.updateSubject);

// Delete subject (Admin only)
router.delete('/subjects/:id', adminOnly, commonValidations.id, academicController.deleteSubject);

// Assign subject to grade (Admin only)
router.post('/subjects/assign-grade', adminOnly, academicController.assignSubjectToGrade);

// Get subjects by grade (Admin/Teacher only)
router.get('/grades/:gradeId/subjects', teacherOrAdmin, academicController.getSubjectsByGrade);

// =============================================
// ACADEMIC YEARS ROUTES
// =============================================

// Create academic year (Admin only)
router.post('/academic-years', adminOnly, academicController.createAcademicYear);

// Get all academic years (Admin/Teacher only)
router.get('/academic-years', teacherOrAdmin, academicController.getAcademicYears);

// Get current academic year (Admin/Teacher only)
router.get('/academic-years/current', teacherOrAdmin, academicController.getCurrentAcademicYear);

// Set current academic year (Admin only)
router.put('/academic-years/:yearId/set-current', adminOnly, academicController.setCurrentAcademicYear);

// =============================================
// TERMS ROUTES
// =============================================

// Create term (Admin only)
router.post('/terms', adminOnly, academicController.createTerm);

// Get terms by academic year (Admin/Teacher only)
router.get('/academic-years/:academicYearId/terms', teacherOrAdmin, academicController.getTermsByAcademicYear);

// Get current term (Admin/Teacher only)
router.get('/terms/current', teacherOrAdmin, academicController.getCurrentTerm);

// Set current term (Admin only)
router.put('/terms/:termId/set-current', adminOnly, academicController.setCurrentTerm);

export default router;
