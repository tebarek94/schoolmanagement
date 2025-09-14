import { executeQuery } from '@/config/database';
import { Examination, ExamResult, ExamRequest, ExamResultRequest, PaginationQuery } from '@/types';
import { CustomError } from '@/middlewares/errorHandler';

export class ExamService {
  // Create new examination
  async createExamination(examData: ExamRequest): Promise<Examination> {
    const {
      exam_type_id,
      subject_id,
      grade_id,
      section_id,
      academic_year_id,
      term_id,
      title,
      description,
      exam_date,
      start_time,
      end_time,
      total_marks,
      passing_marks,
    } = examData;
    
    // Check if exam type exists
    const examTypes = await executeQuery<any[]>(
      'SELECT id FROM exam_types WHERE id = ?',
      [exam_type_id]
    );
    
    if (examTypes.length === 0) {
      throw new CustomError('Exam type not found', 404);
    }
    
    // Check if subject exists
    const subjects = await executeQuery<any[]>(
      'SELECT id FROM subjects WHERE id = ?',
      [subject_id]
    );
    
    if (subjects.length === 0) {
      throw new CustomError('Subject not found', 404);
    }
    
    // Check if grade exists
    const grades = await executeQuery<any[]>(
      'SELECT id FROM grades WHERE id = ?',
      [grade_id]
    );
    
    if (grades.length === 0) {
      throw new CustomError('Grade not found', 404);
    }
    
    // Check if section exists
    const sections = await executeQuery<any[]>(
      'SELECT id FROM sections WHERE id = ?',
      [section_id]
    );
    
    if (sections.length === 0) {
      throw new CustomError('Section not found', 404);
    }
    
    const result = await executeQuery(
      `INSERT INTO examinations (
        exam_type_id, subject_id, grade_id, section_id, academic_year_id, 
        term_id, title, description, exam_date, start_time, end_time, 
        total_marks, passing_marks, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        exam_type_id, subject_id, grade_id, section_id, academic_year_id,
        term_id, title, description || null, exam_date, start_time || null,
        end_time || null, total_marks, passing_marks, 1 // TODO: Get from authenticated user
      ]
    );
    
    const examId = (result as any).insertId;
    
    const examinations = await executeQuery<Examination[]>(
      'SELECT * FROM examinations WHERE id = ?',
      [examId]
    );
    
    return examinations[0];
  }
  
  // Get all examinations
  async getExaminations(query: PaginationQuery): Promise<{ examinations: Examination[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const subjectId = query.subjectId;
    const gradeId = query.gradeId;
    const sectionId = query.sectionId;
    const academicYearId = query.academicYearId;
    const termId = query.termId;
    
    let whereClause = 'WHERE 1=1';
    let params: any[] = [];
    
    if (search) {
      whereClause += ` AND (
        e.title LIKE ? OR 
        s.name LIKE ? OR 
        g.name LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern];
    }
    
    if (subjectId) {
      whereClause += ' AND e.subject_id = ?';
      params.push(subjectId);
    }
    
    if (gradeId) {
      whereClause += ' AND e.grade_id = ?';
      params.push(gradeId);
    }
    
    if (sectionId) {
      whereClause += ' AND e.section_id = ?';
      params.push(sectionId);
    }
    
    if (academicYearId) {
      whereClause += ' AND e.academic_year_id = ?';
      params.push(academicYearId);
    }
    
    if (termId) {
      whereClause += ' AND e.term_id = ?';
      params.push(termId);
    }
    
    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM examinations e
       JOIN subjects s ON e.subject_id = s.id
       JOIN grades g ON e.grade_id = g.id
       ${whereClause}`,
      params
    );
    
    const total = countResult[0].total;
    
    // Get examinations with pagination
    const examinations = await executeQuery<Examination[]>(
      `SELECT e.*, s.name as subject_name, s.code as subject_code, 
              g.name as grade_name, sec.name as section_name,
              et.name as exam_type_name, ay.year as academic_year
       FROM examinations e
       JOIN subjects s ON e.subject_id = s.id
       JOIN grades g ON e.grade_id = g.id
       JOIN sections sec ON e.section_id = sec.id
       JOIN exam_types et ON e.exam_type_id = et.id
       JOIN academic_years ay ON e.academic_year_id = ay.id
       ${whereClause}
       ORDER BY e.exam_date DESC, e.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    return { examinations, total };
  }
  
  // Get examination by ID
  async getExaminationById(id: number): Promise<Examination> {
    const examinations = await executeQuery<Examination[]>(
      `SELECT e.*, s.name as subject_name, s.code as subject_code, 
              g.name as grade_name, sec.name as section_name,
              et.name as exam_type_name, ay.year as academic_year
       FROM examinations e
       JOIN subjects s ON e.subject_id = s.id
       JOIN grades g ON e.grade_id = g.id
       JOIN sections sec ON e.section_id = sec.id
       JOIN exam_types et ON e.exam_type_id = et.id
       JOIN academic_years ay ON e.academic_year_id = ay.id
       WHERE e.id = ?`,
      [id]
    );
    
    if (examinations.length === 0) {
      throw new CustomError('Examination not found', 404);
    }
    
    return examinations[0];
  }
  
  // Update examination
  async updateExamination(id: number, updateData: Partial<Examination>): Promise<Examination> {
    const existingExaminations = await executeQuery<Examination[]>(
      'SELECT id FROM examinations WHERE id = ?',
      [id]
    );
    
    if (existingExaminations.length === 0) {
      throw new CustomError('Examination not found', 404);
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
      `UPDATE examinations SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    return this.getExaminationById(id);
  }
  
  // Delete examination
  async deleteExamination(id: number): Promise<void> {
    const existingExaminations = await executeQuery<Examination[]>(
      'SELECT id FROM examinations WHERE id = ?',
      [id]
    );
    
    if (existingExaminations.length === 0) {
      throw new CustomError('Examination not found', 404);
    }
    
    // Check if examination has results
    const results = await executeQuery<any[]>(
      'SELECT id FROM exam_results WHERE examination_id = ?',
      [id]
    );
    
    if (results.length > 0) {
      throw new CustomError('Cannot delete examination. Examination has results.', 409);
    }
    
    await executeQuery(
      'DELETE FROM examinations WHERE id = ?',
      [id]
    );
  }
  
  // =============================================
  // EXAM RESULTS MANAGEMENT
  // =============================================
  
  // Add exam result
  async addExamResult(resultData: ExamResultRequest): Promise<ExamResult> {
    const { examination_id, student_id, marks_obtained, grade, remarks } = resultData;
    
    // Check if examination exists
    const examinations = await executeQuery<Examination[]>(
      'SELECT id, total_marks FROM examinations WHERE id = ?',
      [examination_id]
    );
    
    if (examinations.length === 0) {
      throw new CustomError('Examination not found', 404);
    }
    
    const examination = examinations[0];
    
    // Check if student exists
    const students = await executeQuery<any[]>(
      'SELECT id FROM students WHERE id = ? AND is_active = TRUE',
      [student_id]
    );
    
    if (students.length === 0) {
      throw new CustomError('Student not found', 404);
    }
    
    // Check if result already exists
    const existingResults = await executeQuery<ExamResult[]>(
      'SELECT id FROM exam_results WHERE examination_id = ? AND student_id = ?',
      [examination_id, student_id]
    );
    
    if (existingResults.length > 0) {
      throw new CustomError('Exam result already exists for this student', 409);
    }
    
    // Validate marks
    if (marks_obtained > examination.total_marks) {
      throw new CustomError('Marks obtained cannot exceed total marks', 400);
    }
    
    const result = await executeQuery(
      'INSERT INTO exam_results (examination_id, student_id, marks_obtained, grade, remarks) VALUES (?, ?, ?, ?, ?)',
      [examination_id, student_id, marks_obtained, grade || null, remarks || null]
    );
    
    const resultId = (result as any).insertId;
    
    const examResults = await executeQuery<ExamResult[]>(
      'SELECT * FROM exam_results WHERE id = ?',
      [resultId]
    );
    
    return examResults[0];
  }
  
  // Update exam result
  async updateExamResult(id: number, updateData: Partial<ExamResult>): Promise<ExamResult> {
    const existingResults = await executeQuery<ExamResult[]>(
      'SELECT id FROM exam_results WHERE id = ?',
      [id]
    );
    
    if (existingResults.length === 0) {
      throw new CustomError('Exam result not found', 404);
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
      `UPDATE exam_results SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    const examResults = await executeQuery<ExamResult[]>(
      'SELECT * FROM exam_results WHERE id = ?',
      [id]
    );
    
    return examResults[0];
  }
  
  // Get exam results
  async getExamResults(query: PaginationQuery): Promise<{ results: ExamResult[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const examinationId = query.examinationId;
    const studentId = query.studentId;
    
    let whereClause = 'WHERE 1=1';
    let params: any[] = [];
    
    if (search) {
      whereClause += ` AND (
        s.first_name LIKE ? OR 
        s.last_name LIKE ? OR 
        s.student_id LIKE ? OR
        sub.name LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern, searchPattern];
    }
    
    if (examinationId) {
      whereClause += ' AND er.examination_id = ?';
      params.push(examinationId);
    }
    
    if (studentId) {
      whereClause += ' AND er.student_id = ?';
      params.push(studentId);
    }
    
    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM exam_results er
       JOIN students s ON er.student_id = s.id
       JOIN examinations e ON er.examination_id = e.id
       JOIN subjects sub ON e.subject_id = sub.id
       ${whereClause}`,
      params
    );
    
    const total = countResult[0].total;
    
    // Get exam results with pagination
    const results = await executeQuery<ExamResult[]>(
      `SELECT er.*, s.first_name, s.last_name, s.student_id as student_number,
              e.title as exam_title, e.total_marks, e.exam_date,
              sub.name as subject_name, sub.code as subject_code,
              g.name as grade_name, sec.name as section_name
       FROM exam_results er
       JOIN students s ON er.student_id = s.id
       JOIN examinations e ON er.examination_id = e.id
       JOIN subjects sub ON e.subject_id = sub.id
       JOIN grades g ON e.grade_id = g.id
       JOIN sections sec ON e.section_id = sec.id
       ${whereClause}
       ORDER BY e.exam_date DESC, s.first_name, s.last_name
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    return { results, total };
  }
  
  // Get exam results by examination
  async getExamResultsByExamination(examinationId: number): Promise<any[]> {
    const results = await executeQuery<any[]>(
      `SELECT er.*, s.first_name, s.last_name, s.student_id as student_number,
              e.title as exam_title, e.total_marks, e.passing_marks,
              sub.name as subject_name, sub.code as subject_code
       FROM exam_results er
       JOIN students s ON er.student_id = s.id
       JOIN examinations e ON er.examination_id = e.id
       JOIN subjects sub ON e.subject_id = sub.id
       WHERE er.examination_id = ?
       ORDER BY s.first_name, s.last_name`,
      [examinationId]
    );
    
    return results;
  }
  
  // Get student exam results
  async getStudentExamResults(studentId: number, academicYearId?: number, termId?: number): Promise<any[]> {
    let whereClause = 'WHERE er.student_id = ?';
    let params: any[] = [studentId];
    
    if (academicYearId) {
      whereClause += ' AND e.academic_year_id = ?';
      params.push(academicYearId);
    }
    
    if (termId) {
      whereClause += ' AND e.term_id = ?';
      params.push(termId);
    }
    
    const results = await executeQuery<any[]>(
      `SELECT er.*, e.title as exam_title, e.exam_date, e.total_marks, e.passing_marks,
              sub.name as subject_name, sub.code as subject_code,
              et.name as exam_type_name, g.name as grade_name, sec.name as section_name
       FROM exam_results er
       JOIN examinations e ON er.examination_id = e.id
       JOIN subjects sub ON e.subject_id = sub.id
       JOIN exam_types et ON e.exam_type_id = et.id
       JOIN grades g ON e.grade_id = g.id
       JOIN sections sec ON e.section_id = sec.id
       ${whereClause}
       ORDER BY e.exam_date DESC, sub.name`,
      params
    );
    
    return results;
  }
  
  // Get exam statistics
  async getExamStats(): Promise<any> {
    const stats = await executeQuery<any[]>(
      `SELECT 
        COUNT(DISTINCT e.id) as total_examinations,
        COUNT(DISTINCT er.id) as total_results,
        COUNT(DISTINCT er.student_id) as students_with_results,
        AVG(er.marks_obtained) as average_marks,
        COUNT(CASE WHEN er.marks_obtained >= e.passing_marks THEN 1 END) as passed_count,
        COUNT(CASE WHEN er.marks_obtained < e.passing_marks THEN 1 END) as failed_count
       FROM examinations e
       LEFT JOIN exam_results er ON e.id = er.examination_id`
    );
    
    const result = stats[0];
    const passPercentage = result.total_results > 0 
      ? Math.round((result.passed_count / result.total_results) * 100) 
      : 0;
    
    return {
      ...result,
      pass_percentage: passPercentage,
    };
  }
  
  // Get upcoming examinations
  async getUpcomingExaminations(days: number = 7): Promise<Examination[]> {
    const examinations = await executeQuery<Examination[]>(
      `SELECT e.*, s.name as subject_name, s.code as subject_code, 
              g.name as grade_name, sec.name as section_name,
              et.name as exam_type_name
       FROM examinations e
       JOIN subjects s ON e.subject_id = s.id
       JOIN grades g ON e.grade_id = g.id
       JOIN sections sec ON e.section_id = sec.id
       JOIN exam_types et ON e.exam_type_id = et.id
       WHERE e.exam_date >= CURDATE() AND e.exam_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
       ORDER BY e.exam_date ASC`,
      [days]
    );
    
    return examinations;
  }
}
