import { Router } from 'express';
import { PaymentController } from '@/controllers/paymentController';
import { authenticate, adminOnly, parentOrAdmin } from '@/middlewares/auth';
import { paymentValidations, commonValidations } from '@/middlewares/validation';

const router = Router();
const paymentController = new PaymentController();

// All routes require authentication
router.use(authenticate);

// =============================================
// PAYMENT ROUTES
// =============================================

// Create payment (Admin only)
router.post('/', adminOnly, paymentValidations.create, paymentController.createPayment);

// Get all payments (Admin only)
router.get('/', adminOnly, commonValidations.pagination, paymentController.getPayments);

// Get payment statistics (Admin only)
router.get('/stats', adminOnly, paymentController.getPaymentStats);

// Get outstanding payments (Admin only)
router.get('/outstanding', adminOnly, paymentController.getOutstandingPayments);

// Get monthly payment report (Admin only)
router.get('/monthly/:year/:month', adminOnly, paymentController.getMonthlyPaymentReport);

// Get student payments (Admin/Parent only)
router.get('/students/:studentId', parentOrAdmin, paymentController.getStudentPayments);

// Get payment by ID (Admin only)
router.get('/:id', adminOnly, commonValidations.id, paymentController.getPaymentById);

// Update payment (Admin only)
router.put('/:id', adminOnly, commonValidations.id, paymentController.updatePayment);

// Delete payment (Admin only)
router.delete('/:id', adminOnly, commonValidations.id, paymentController.deletePayment);

// =============================================
// FEE STRUCTURE ROUTES
// =============================================

// Create fee structure (Admin only)
router.post('/fee-structures', adminOnly, paymentController.createFeeStructure);

// Get fee structures (Admin only)
router.get('/fee-structures', adminOnly, commonValidations.pagination, paymentController.getFeeStructures);

// Get fee structure by ID (Admin only)
router.get('/fee-structures/:id', adminOnly, commonValidations.id, paymentController.getFeeStructureById);

// Update fee structure (Admin only)
router.put('/fee-structures/:id', adminOnly, commonValidations.id, paymentController.updateFeeStructure);

// Delete fee structure (Admin only)
router.delete('/fee-structures/:id', adminOnly, commonValidations.id, paymentController.deleteFeeStructure);

export default router;
