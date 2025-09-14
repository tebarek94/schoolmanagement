import { executeQuery, executeTransaction } from '@/config/database';
import { Student, CreateStudentRequest, PaginationQuery, ApiResponse } from '@/types';
import { CustomError } from '@/middlewares/errorHandler';
import bcrypt from 'bcryptjs';

export class StudentService {
  // Create new student
  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    const {
      email,
      password,
      student_id,
      first_name,
      last_name,
      middle_name,
      phone,
      address,
      date_of_birth,
      gender,
      admission_date,
      admission_number,
      previous_school,
      medical_info,
      emergency_contact_name,
      emergency_contact_phone,
      parent_id,
    } = studentData;

    // Check if student ID already exists
    const existingStudents = await executeQuery<Student[]>(
      'SELECT id FROM students WHERE student_id = ?',
      [student_id]
    );

    if (existingStudents.length > 0) {
      throw new CustomError('Student ID already exists', 409);
    }

    // Check if admission number already exists
    const existingAdmissions = await executeQuery<Student[]>(
      'SELECT id FROM students WHERE admission_number = ?',
      [admission_number]
    );

    if (existingAdmissions.length > 0) {
      throw new CustomError('Admission number already exists', 409);
    }

    // Check if email already exists
    const existingUsers = await executeQuery<any[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      throw new CustomError('Email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get student role ID
    const roles = await executeQuery<any[]>(
      'SELECT id FROM roles WHERE name = ?',
      ['Student']
    );

    if (roles.length === 0) {
      throw new CustomError('Student role not found', 500);
    }

    const roleId = roles[0].id;

    // Start transaction
    const results = await executeTransaction([
      // Create user
      {
        query: 'INSERT INTO users (email, password, role_id, is_active) VALUES (?, ?, ?, ?)',
        params: [email, hashedPassword, roleId, true],
      },
    ]);

    const userId = (results[0] as any).insertId;

    // Create student profile
    const studentResult = await executeQuery(
      `INSERT INTO students (
        user_id, student_id, first_name, last_name, middle_name, 
        phone, address, date_of_birth, gender, admission_date, 
        admission_number, previous_school, medical_info, 
        emergency_contact_name, emergency_contact_phone, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        student_id,
        first_name,
        last_name,
        middle_name || null,
        phone || null,
        address || null,
        date_of_birth,
        gender,
        admission_date,
        admission_number,
        previous_school || null,
        medical_info || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
        true,
      ]
    );

    const studentId = (studentResult as any).insertId;

    // Link to parent if provided
    if (parent_id) {
      await executeQuery(
        'INSERT INTO student_parents (student_id, parent_id, relationship, is_primary) VALUES (?, ?, ?, ?)',
        [studentId, parent_id, 'Guardian', true]
      );
    }

    // Get created student
    const students = await executeQuery<Student[]>(
      'SELECT * FROM students WHERE id = ?',
      [studentId]
    );

    return students[0];
  }

  // Get all students with pagination
  async getStudents(query: PaginationQuery): Promise<{ students: Student[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';

    let whereClause = 'WHERE s.is_active = TRUE';
    let params: any[] = [];

    if (search) {
      whereClause += ` AND (
        s.first_name LIKE ? OR 
        s.last_name LIKE ? OR 
        s.student_id LIKE ? OR 
        s.admission_number LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern, searchPattern];
    }

    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM students s 
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get students with pagination
    const students = await executeQuery<Student[]>(
      `SELECT s.*, u.email, u.last_login
       FROM students s
       JOIN users u ON s.user_id = u.id
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { students, total };
  }

  // Get student by ID
  async getStudentById(id: number): Promise<Student> {
    const students = await executeQuery<Student[]>(
      `SELECT s.*, u.email, u.last_login
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.is_active = TRUE`,
      [id]
    );

    if (students.length === 0) {
      throw new CustomError('Student not found', 404);
    }

    return students[0];
  }

  // Get student by student ID
  async getStudentByStudentId(studentId: string): Promise<Student> {
    const students = await executeQuery<Student[]>(
      `SELECT s.*, u.email, u.last_login
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.student_id = ? AND s.is_active = TRUE`,
      [studentId]
    );

    if (students.length === 0) {
      throw new CustomError('Student not found', 404);
    }

    return students[0];
  }

  // Update student
  async updateStudent(id: number, updateData: Partial<Student>): Promise<Student> {
    // Check if student exists
    const existingStudents = await executeQuery<Student[]>(
      'SELECT id FROM students WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (existingStudents.length === 0) {
      throw new CustomError('Student not found', 404);
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'user_id' && key !== 'created_at') {
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
      `UPDATE students SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Return updated student
    return this.getStudentById(id);
  }

  // Delete student (soft delete)
  async deleteStudent(id: number): Promise<void> {
    // Check if student exists
    const existingStudents = await executeQuery<Student[]>(
      'SELECT id FROM students WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (existingStudents.length === 0) {
      throw new CustomError('Student not found', 404);
    }

    // Soft delete student
    await executeQuery(
      'UPDATE students SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
      [id]
    );

    // Also deactivate user account
    const students = await executeQuery<Student[]>(
      'SELECT user_id FROM students WHERE id = ?',
      [id]
    );

    if (students.length > 0) {
      await executeQuery(
        'UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
        [students[0].user_id]
      );
    }
  }

  // Get students by section
  async getStudentsBySection(sectionId: number, academicYearId: number): Promise<Student[]> {
    const students = await executeQuery<Student[]>(
      `SELECT s.*, u.email
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN student_sections ss ON s.id = ss.student_id
       WHERE ss.section_id = ? AND ss.academic_year_id = ? AND ss.status = 'Active' AND s.is_active = TRUE
       ORDER BY s.first_name, s.last_name`,
      [sectionId, academicYearId]
    );

    return students;
  }

  // Get students by grade
  async getStudentsByGrade(gradeId: number, academicYearId: number): Promise<Student[]> {
    const students = await executeQuery<Student[]>(
      `SELECT s.*, u.email, sec.name as section_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN student_sections ss ON s.id = ss.student_id
       JOIN sections sec ON ss.section_id = sec.id
       WHERE sec.grade_id = ? AND ss.academic_year_id = ? AND ss.status = 'Active' AND s.is_active = TRUE
       ORDER BY sec.name, s.first_name, s.last_name`,
      [gradeId, academicYearId]
    );

    return students;
  }

  // Enroll student in section
  async enrollStudentInSection(studentId: number, sectionId: number, academicYearId: number): Promise<void> {
    // Check if student exists
    const students = await executeQuery<Student[]>(
      'SELECT id FROM students WHERE id = ? AND is_active = TRUE',
      [studentId]
    );

    if (students.length === 0) {
      throw new CustomError('Student not found', 404);
    }

    // Check if section exists
    const sections = await executeQuery<any[]>(
      'SELECT id FROM sections WHERE id = ?',
      [sectionId]
    );

    if (sections.length === 0) {
      throw new CustomError('Section not found', 404);
    }

    // Check if already enrolled
    const existingEnrollments = await executeQuery<any[]>(
      'SELECT id FROM student_sections WHERE student_id = ? AND academic_year_id = ?',
      [studentId, academicYearId]
    );

    if (existingEnrollments.length > 0) {
      throw new CustomError('Student is already enrolled for this academic year', 409);
    }

    // Enroll student
    await executeQuery(
      'INSERT INTO student_sections (student_id, section_id, academic_year_id, enrollment_date, status) VALUES (?, ?, ?, NOW(), ?)',
      [studentId, sectionId, academicYearId, 'Active']
    );
  }

  // Transfer student to different section
  async transferStudent(studentId: number, newSectionId: number, academicYearId: number): Promise<void> {
    // Check if student exists
    const students = await executeQuery<Student[]>(
      'SELECT id FROM students WHERE id = ? AND is_active = TRUE',
      [studentId]
    );

    if (students.length === 0) {
      throw new CustomError('Student not found', 404);
    }

    // Check if new section exists
    const sections = await executeQuery<any[]>(
      'SELECT id FROM sections WHERE id = ?',
      [newSectionId]
    );

    if (sections.length === 0) {
      throw new CustomError('Section not found', 404);
    }

    // Update current enrollment status
    await executeQuery(
      'UPDATE student_sections SET status = ?, updated_at = NOW() WHERE student_id = ? AND academic_year_id = ?',
      ['Transferred', studentId, academicYearId]
    );

    // Create new enrollment
    await executeQuery(
      'INSERT INTO student_sections (student_id, section_id, academic_year_id, enrollment_date, status) VALUES (?, ?, ?, NOW(), ?)',
      [studentId, newSectionId, academicYearId, 'Active']
    );
  }

  // Get student statistics
  async getStudentStats(): Promise<any> {
    const stats = await executeQuery<any[]>(
      `SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN gender = 'Male' THEN 1 END) as male_students,
        COUNT(CASE WHEN gender = 'Female' THEN 1 END) as female_students,
        COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_students,
        COUNT(CASE WHEN is_active = FALSE THEN 1 END) as inactive_students
       FROM students`
    );

    return stats[0];
  }
}
