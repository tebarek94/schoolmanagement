import { executeQuery } from '@/config/database';
import { Payment, FeeStructure, PaymentRequest, PaginationQuery } from '@/types';
import { CustomError } from '@/middlewares/errorHandler';
import { generateReceiptNumber } from '@/utils/helpers';

export class PaymentService {
  // Create new payment
  async createPayment(paymentData: PaymentRequest): Promise<Payment> {
    const {
      student_id,
      fee_structure_id,
      amount,
      payment_date,
      payment_method,
      reference_number,
      remarks,
    } = paymentData;

    // Check if student exists
    const students = await executeQuery<any[]>(
      'SELECT id FROM students WHERE id = ? AND is_active = TRUE',
      [student_id]
    );

    if (students.length === 0) {
      throw new CustomError('Student not found', 404);
    }

    // Check if fee structure exists
    const feeStructures = await executeQuery<FeeStructure[]>(
      'SELECT * FROM fee_structures WHERE id = ?',
      [fee_structure_id]
    );

    if (feeStructures.length === 0) {
      throw new CustomError('Fee structure not found', 404);
    }

    const feeStructure = feeStructures[0];

    // Validate amount
    if (amount > feeStructure.amount) {
      throw new CustomError('Payment amount cannot exceed fee amount', 400);
    }

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();

    // Determine payment status
    let status: 'Paid' | 'Partial' | 'Pending' | 'Overdue' = 'Paid';
    if (amount < feeStructure.amount) {
      status = 'Partial';
    }

    const result = await executeQuery(
      `INSERT INTO payments (
        student_id, fee_structure_id, amount, payment_date, 
        payment_method, reference_number, receipt_number, 
        status, remarks, received_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id, fee_structure_id, amount, payment_date,
        payment_method, reference_number || null, receiptNumber,
        status, remarks || null, 1 // TODO: Get from authenticated user
      ]
    );

    const paymentId = (result as any).insertId;

    const payments = await executeQuery<Payment[]>(
      'SELECT * FROM payments WHERE id = ?',
      [paymentId]
    );

    return payments[0];
  }

  // Get all payments
  async getPayments(query: PaginationQuery): Promise<{ payments: Payment[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const studentId = query.studentId;
    const status = query.status;
    const startDate = query.startDate;
    const endDate = query.endDate;

    let whereClause = 'WHERE 1=1';
    let params: any[] = [];

    if (search) {
      whereClause += ` AND (
        s.first_name LIKE ? OR 
        s.last_name LIKE ? OR 
        s.student_id LIKE ? OR
        p.receipt_number LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern, searchPattern];
    }

    if (studentId) {
      whereClause += ' AND p.student_id = ?';
      params.push(studentId);
    }

    if (status) {
      whereClause += ' AND p.status = ?';
      params.push(status);
    }

    if (startDate) {
      whereClause += ' AND p.payment_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND p.payment_date <= ?';
      params.push(endDate);
    }

    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM payments p
       JOIN students s ON p.student_id = s.id
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get payments with pagination
    const payments = await executeQuery<Payment[]>(
      `SELECT p.*, s.first_name, s.last_name, s.student_id as student_number,
              fs.fee_type, fs.amount as fee_amount, fs.due_date,
              g.name as grade_name, sec.name as section_name
       FROM payments p
       JOIN students s ON p.student_id = s.id
       JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN grades g ON fs.grade_id = g.id
       LEFT JOIN student_sections ss ON s.id = ss.student_id AND ss.status = 'Active'
       LEFT JOIN sections sec ON ss.section_id = sec.id
       ${whereClause}
       ORDER BY p.payment_date DESC, s.first_name, s.last_name
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { payments, total };
  }

  // Get payment by ID
  async getPaymentById(id: number): Promise<Payment> {
    const payments = await executeQuery<Payment[]>(
      `SELECT p.*, s.first_name, s.last_name, s.student_id as student_number,
              fs.fee_type, fs.amount as fee_amount, fs.due_date,
              g.name as grade_name, sec.name as section_name
       FROM payments p
       JOIN students s ON p.student_id = s.id
       JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN grades g ON fs.grade_id = g.id
       LEFT JOIN student_sections ss ON s.id = ss.student_id AND ss.status = 'Active'
       LEFT JOIN sections sec ON ss.section_id = sec.id
       WHERE p.id = ?`,
      [id]
    );

    if (payments.length === 0) {
      throw new CustomError('Payment not found', 404);
    }

    return payments[0];
  }

  // Update payment
  async updatePayment(id: number, updateData: Partial<Payment>): Promise<Payment> {
    const existingPayments = await executeQuery<Payment[]>(
      'SELECT id FROM payments WHERE id = ?',
      [id]
    );

    if (existingPayments.length === 0) {
      throw new CustomError('Payment not found', 404);
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      throw new CustomError('No valid fields to update', 400);
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    await executeQuery(
      `UPDATE payments SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return this.getPaymentById(id);
  }

  // Delete payment
  async deletePayment(id: number): Promise<void> {
    const existingPayments = await executeQuery<Payment[]>(
      'SELECT id FROM payments WHERE id = ?',
      [id]
    );

    if (existingPayments.length === 0) {
      throw new CustomError('Payment not found', 404);
    }

    await executeQuery(
      'DELETE FROM payments WHERE id = ?',
      [id]
    );
  }

  // Get student payments
  async getStudentPayments(studentId: number, academicYearId?: number, termId?: number): Promise<any[]> {
    let whereClause = 'WHERE p.student_id = ?';
    let params: any[] = [studentId];

    if (academicYearId) {
      whereClause += ' AND fs.academic_year_id = ?';
      params.push(academicYearId);
    }

    if (termId) {
      whereClause += ' AND fs.term_id = ?';
      params.push(termId);
    }

    const payments = await executeQuery<any[]>(
      `SELECT p.*, fs.fee_type, fs.amount as fee_amount, fs.due_date,
              fs.description as fee_description, ay.year as academic_year,
              t.name as term_name
       FROM payments p
       JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN academic_years ay ON fs.academic_year_id = ay.id
       JOIN terms t ON fs.term_id = t.id
       ${whereClause}
       ORDER BY p.payment_date DESC`,
      params
    );

    return payments;
  }

  // Get payment statistics
  async getPaymentStats(): Promise<any> {
    const stats = await executeQuery<any[]>(
      `SELECT 
        COUNT(*) as total_payments,
        SUM(amount) as total_amount_collected,
        COUNT(CASE WHEN status = 'Paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'Partial' THEN 1 END) as partial_count,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'Overdue' THEN 1 END) as overdue_count,
        COUNT(DISTINCT student_id) as students_with_payments
       FROM payments`
    );

    const result = stats[0];
    const collectionRate = result.total_payments > 0 
      ? Math.round((result.paid_count / result.total_payments) * 100) 
      : 0;

    return {
      ...result,
      collection_rate: collectionRate,
    };
  }

  // Get outstanding payments
  async getOutstandingPayments(): Promise<any[]> {
    const outstandingPayments = await executeQuery<any[]>(
      `SELECT 
        s.id as student_id,
        s.first_name,
        s.last_name,
        s.student_id as student_number,
        fs.fee_type,
        fs.amount as fee_amount,
        fs.due_date,
        COALESCE(SUM(p.amount), 0) as paid_amount,
        (fs.amount - COALESCE(SUM(p.amount), 0)) as outstanding_amount,
        g.name as grade_name,
        sec.name as section_name
       FROM students s
       JOIN student_sections ss ON s.id = ss.student_id AND ss.status = 'Active'
       JOIN sections sec ON ss.section_id = sec.id
       JOIN grades g ON sec.grade_id = g.id
       JOIN fee_structures fs ON g.id = fs.grade_id
       LEFT JOIN payments p ON s.id = p.student_id AND fs.id = p.fee_structure_id
       WHERE s.is_active = TRUE
       GROUP BY s.id, fs.id
       HAVING outstanding_amount > 0
       ORDER BY outstanding_amount DESC, s.first_name, s.last_name`
    );

    return outstandingPayments;
  }

  // Get monthly payment report
  async getMonthlyPaymentReport(year: number, month: number): Promise<any[]> {
    const report = await executeQuery<any[]>(
      `SELECT 
        DATE(p.payment_date) as payment_date,
        COUNT(*) as payment_count,
        SUM(p.amount) as total_amount,
        COUNT(DISTINCT p.student_id) as unique_students,
        COUNT(CASE WHEN p.payment_method = 'Cash' THEN 1 END) as cash_payments,
        COUNT(CASE WHEN p.payment_method = 'Bank Transfer' THEN 1 END) as bank_transfers,
        COUNT(CASE WHEN p.payment_method = 'Mobile Money' THEN 1 END) as mobile_money_payments
       FROM payments p
       WHERE YEAR(p.payment_date) = ? AND MONTH(p.payment_date) = ?
       GROUP BY DATE(p.payment_date)
       ORDER BY payment_date`,
      [year, month]
    );

    return report;
  }

  // =============================================
  // FEE STRUCTURE MANAGEMENT
  // =============================================

  // Create fee structure
  async createFeeStructure(feeStructureData: Partial<FeeStructure>): Promise<FeeStructure> {
    const { grade_id, academic_year_id, term_id, fee_type, amount, due_date, is_mandatory, description } = feeStructureData;

    // Check if grade exists
    const grades = await executeQuery<any[]>(
      'SELECT id FROM grades WHERE id = ?',
      [grade_id]
    );

    if (grades.length === 0) {
      throw new CustomError('Grade not found', 404);
    }

    // Check if academic year exists
    const academicYears = await executeQuery<any[]>(
      'SELECT id FROM academic_years WHERE id = ?',
      [academic_year_id]
    );

    if (academicYears.length === 0) {
      throw new CustomError('Academic year not found', 404);
    }

    // Check if term exists
    const terms = await executeQuery<any[]>(
      'SELECT id FROM terms WHERE id = ?',
      [term_id]
    );

    if (terms.length === 0) {
      throw new CustomError('Term not found', 404);
    }

    const result = await executeQuery(
      'INSERT INTO fee_structures (grade_id, academic_year_id, term_id, fee_type, amount, due_date, is_mandatory, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [grade_id, academic_year_id, term_id, fee_type, amount, due_date, is_mandatory || true, description || null]
    );

    const feeStructureId = (result as any).insertId;

    const feeStructures = await executeQuery<FeeStructure[]>(
      'SELECT * FROM fee_structures WHERE id = ?',
      [feeStructureId]
    );

    return feeStructures[0];
  }

  // Get fee structures
  async getFeeStructures(query: PaginationQuery): Promise<{ feeStructures: FeeStructure[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const gradeId = query.gradeId;
    const academicYearId = query.academicYearId;
    const termId = query.termId;

    let whereClause = 'WHERE 1=1';
    let params: any[] = [];

    if (search) {
      whereClause += ` AND (
        fs.fee_type LIKE ? OR 
        g.name LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern];
    }

    if (gradeId) {
      whereClause += ' AND fs.grade_id = ?';
      params.push(gradeId);
    }

    if (academicYearId) {
      whereClause += ' AND fs.academic_year_id = ?';
      params.push(academicYearId);
    }

    if (termId) {
      whereClause += ' AND fs.term_id = ?';
      params.push(termId);
    }

    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM fee_structures fs
       JOIN grades g ON fs.grade_id = g.id
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get fee structures with pagination
    const feeStructures = await executeQuery<FeeStructure[]>(
      `SELECT fs.*, g.name as grade_name, ay.year as academic_year, t.name as term_name
       FROM fee_structures fs
       JOIN grades g ON fs.grade_id = g.id
       JOIN academic_years ay ON fs.academic_year_id = ay.id
       JOIN terms t ON fs.term_id = t.id
       ${whereClause}
       ORDER BY g.level, fs.fee_type
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { feeStructures, total };
  }

  // Get fee structure by ID
  async getFeeStructureById(id: number): Promise<FeeStructure> {
    const feeStructures = await executeQuery<FeeStructure[]>(
      `SELECT fs.*, g.name as grade_name, ay.year as academic_year, t.name as term_name
       FROM fee_structures fs
       JOIN grades g ON fs.grade_id = g.id
       JOIN academic_years ay ON fs.academic_year_id = ay.id
       JOIN terms t ON fs.term_id = t.id
       WHERE fs.id = ?`,
      [id]
    );

    if (feeStructures.length === 0) {
      throw new CustomError('Fee structure not found', 404);
    }

    return feeStructures[0];
  }

  // Update fee structure
  async updateFeeStructure(id: number, updateData: Partial<FeeStructure>): Promise<FeeStructure> {
    const existingFeeStructures = await executeQuery<FeeStructure[]>(
      'SELECT id FROM fee_structures WHERE id = ?',
      [id]
    );

    if (existingFeeStructures.length === 0) {
      throw new CustomError('Fee structure not found', 404);
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      throw new CustomError('No valid fields to update', 400);
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    await executeQuery(
      `UPDATE fee_structures SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return this.getFeeStructureById(id);
  }

  // Delete fee structure
  async deleteFeeStructure(id: number): Promise<void> {
    const existingFeeStructures = await executeQuery<FeeStructure[]>(
      'SELECT id FROM fee_structures WHERE id = ?',
      [id]
    );

    if (existingFeeStructures.length === 0) {
      throw new CustomError('Fee structure not found', 404);
    }

    // Check if fee structure has payments
    const payments = await executeQuery<any[]>(
      'SELECT id FROM payments WHERE fee_structure_id = ?',
      [id]
    );

    if (payments.length > 0) {
      throw new CustomError('Cannot delete fee structure. Fee structure has payments.', 409);
    }

    await executeQuery(
      'DELETE FROM fee_structures WHERE id = ?',
      [id]
    );
  }
}
