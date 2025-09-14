import { executeQuery, executeTransaction } from '@/config/database';
import { Teacher, CreateTeacherRequest, PaginationQuery } from '@/types';
import { CustomError } from '@/middlewares/errorHandler';
import bcrypt from 'bcryptjs';

export class TeacherService {
  // Create new teacher
  async createTeacher(teacherData: CreateTeacherRequest): Promise<Teacher> {
    const {
      email,
      password,
      employee_id,
      first_name,
      last_name,
      middle_name,
      phone,
      address,
      date_of_birth,
      gender,
      qualification,
      specialization,
      hire_date,
      salary,
    } = teacherData;

    // Check if employee ID already exists
    const existingTeachers = await executeQuery<Teacher[]>(
      'SELECT id FROM teachers WHERE employee_id = ?',
      [employee_id]
    );

    if (existingTeachers.length > 0) {
      throw new CustomError('Employee ID already exists', 409);
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

    // Get teacher role ID
    const roles = await executeQuery<any[]>(
      'SELECT id FROM roles WHERE name = ?',
      ['Teacher']
    );

    if (roles.length === 0) {
      throw new CustomError('Teacher role not found', 500);
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

    // Create teacher profile
    const teacherResult = await executeQuery(
      `INSERT INTO teachers (
        user_id, employee_id, first_name, last_name, middle_name, 
        phone, address, date_of_birth, gender, qualification, 
        specialization, hire_date, salary, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        employee_id,
        first_name,
        last_name,
        middle_name || null,
        phone || null,
        address || null,
        date_of_birth || null,
        gender,
        qualification || null,
        specialization || null,
        hire_date,
        salary || null,
        true,
      ]
    );

    const teacherId = (teacherResult as any).insertId;

    // Get created teacher
    const teachers = await executeQuery<Teacher[]>(
      'SELECT * FROM teachers WHERE id = ?',
      [teacherId]
    );

    return teachers[0];
  }

  // Get all teachers with pagination
  async getTeachers(query: PaginationQuery): Promise<{ teachers: Teacher[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';

    let whereClause = 'WHERE t.is_active = TRUE';
    let params: any[] = [];

    if (search) {
      whereClause += ` AND (
        t.first_name LIKE ? OR 
        t.last_name LIKE ? OR 
        t.employee_id LIKE ? OR 
        t.qualification LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern, searchPattern];
    }

    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM teachers t 
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get teachers with pagination
    const teachers = await executeQuery<Teacher[]>(
      `SELECT t.*, u.email, u.last_login
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { teachers, total };
  }

  // Get teacher by ID
  async getTeacherById(id: number): Promise<Teacher> {
    const teachers = await executeQuery<Teacher[]>(
      `SELECT t.*, u.email, u.last_login
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ? AND t.is_active = TRUE`,
      [id]
    );

    if (teachers.length === 0) {
      throw new CustomError('Teacher not found', 404);
    }

    return teachers[0];
  }

  // Get teacher by employee ID
  async getTeacherByEmployeeId(employeeId: string): Promise<Teacher> {
    const teachers = await executeQuery<Teacher[]>(
      `SELECT t.*, u.email, u.last_login
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       WHERE t.employee_id = ? AND t.is_active = TRUE`,
      [employeeId]
    );

    if (teachers.length === 0) {
      throw new CustomError('Teacher not found', 404);
    }

    return teachers[0];
  }

  // Update teacher
  async updateTeacher(id: number, updateData: Partial<Teacher>): Promise<Teacher> {
    // Check if teacher exists
    const existingTeachers = await executeQuery<Teacher[]>(
      'SELECT id FROM teachers WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (existingTeachers.length === 0) {
      throw new CustomError('Teacher not found', 404);
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
      `UPDATE teachers SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Return updated teacher
    return this.getTeacherById(id);
  }

  // Delete teacher (soft delete)
  async deleteTeacher(id: number): Promise<void> {
    // Check if teacher exists
    const existingTeachers = await executeQuery<Teacher[]>(
      'SELECT id FROM teachers WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (existingTeachers.length === 0) {
      throw new CustomError('Teacher not found', 404);
    }

    // Soft delete teacher
    await executeQuery(
      'UPDATE teachers SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
      [id]
    );

    // Also deactivate user account
    const teachers = await executeQuery<Teacher[]>(
      'SELECT user_id FROM teachers WHERE id = ?',
      [id]
    );

    if (teachers.length > 0) {
      await executeQuery(
        'UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
        [teachers[0].user_id]
      );
    }
  }

  // Assign teacher to subject
  async assignTeacherToSubject(teacherId: number, subjectId: number, gradeId: number, academicYearId: number): Promise<void> {
    // Check if teacher exists
    const teachers = await executeQuery<Teacher[]>(
      'SELECT id FROM teachers WHERE id = ? AND is_active = TRUE',
      [teacherId]
    );

    if (teachers.length === 0) {
      throw new CustomError('Teacher not found', 404);
    }

    // Check if subject exists
    const subjects = await executeQuery<any[]>(
      'SELECT id FROM subjects WHERE id = ?',
      [subjectId]
    );

    if (subjects.length === 0) {
      throw new CustomError('Subject not found', 404);
    }

    // Check if grade exists
    const grades = await executeQuery<any[]>(
      'SELECT id FROM grades WHERE id = ?',
      [gradeId]
    );

    if (grades.length === 0) {
      throw new CustomError('Grade not found', 404);
    }

    // Check if already assigned
    const existingAssignments = await executeQuery<any[]>(
      'SELECT id FROM teacher_subjects WHERE teacher_id = ? AND subject_id = ? AND grade_id = ? AND academic_year_id = ?',
      [teacherId, subjectId, gradeId, academicYearId]
    );

    if (existingAssignments.length > 0) {
      throw new CustomError('Teacher is already assigned to this subject for this grade and academic year', 409);
    }

    // Assign teacher to subject
    await executeQuery(
      'INSERT INTO teacher_subjects (teacher_id, subject_id, grade_id, academic_year_id) VALUES (?, ?, ?, ?)',
      [teacherId, subjectId, gradeId, academicYearId]
    );
  }

  // Assign teacher as class teacher
  async assignClassTeacher(teacherId: number, sectionId: number, academicYearId: number): Promise<void> {
    // Check if teacher exists
    const teachers = await executeQuery<Teacher[]>(
      'SELECT id FROM teachers WHERE id = ? AND is_active = TRUE',
      [teacherId]
    );

    if (teachers.length === 0) {
      throw new CustomError('Teacher not found', 404);
    }

    // Check if section exists
    const sections = await executeQuery<any[]>(
      'SELECT id FROM sections WHERE id = ?',
      [sectionId]
    );

    if (sections.length === 0) {
      throw new CustomError('Section not found', 404);
    }

    // Check if already assigned as class teacher
    const existingAssignments = await executeQuery<any[]>(
      'SELECT id FROM teacher_sections WHERE teacher_id = ? AND section_id = ? AND academic_year_id = ?',
      [teacherId, sectionId, academicYearId]
    );

    if (existingAssignments.length > 0) {
      throw new CustomError('Teacher is already assigned to this section for this academic year', 409);
    }

    // Assign teacher as class teacher
    await executeQuery(
      'INSERT INTO teacher_sections (teacher_id, section_id, academic_year_id, is_class_teacher) VALUES (?, ?, ?, ?)',
      [teacherId, sectionId, academicYearId, true]
    );
  }

  // Get teacher's subjects
  async getTeacherSubjects(teacherId: number, academicYearId: number): Promise<any[]> {
    const subjects = await executeQuery<any[]>(
      `SELECT s.name as subject_name, s.code, g.name as grade_name, g.level
       FROM teacher_subjects ts
       JOIN subjects s ON ts.subject_id = s.id
       JOIN grades g ON ts.grade_id = g.id
       WHERE ts.teacher_id = ? AND ts.academic_year_id = ?
       ORDER BY g.level, s.name`,
      [teacherId, academicYearId]
    );

    return subjects;
  }

  // Get teacher's sections
  async getTeacherSections(teacherId: number, academicYearId: number): Promise<any[]> {
    const sections = await executeQuery<any[]>(
      `SELECT sec.name as section_name, g.name as grade_name, g.level, ts.is_class_teacher
       FROM teacher_sections ts
       JOIN sections sec ON ts.section_id = sec.id
       JOIN grades g ON sec.grade_id = g.id
       WHERE ts.teacher_id = ? AND ts.academic_year_id = ?
       ORDER BY g.level, sec.name`,
      [teacherId, academicYearId]
    );

    return sections;
  }

  // Get teacher statistics
  async getTeacherStats(): Promise<any> {
    const stats = await executeQuery<any[]>(
      `SELECT 
        COUNT(*) as total_teachers,
        COUNT(CASE WHEN gender = 'Male' THEN 1 END) as male_teachers,
        COUNT(CASE WHEN gender = 'Female' THEN 1 END) as female_teachers,
        COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_teachers,
        COUNT(CASE WHEN is_active = FALSE THEN 1 END) as inactive_teachers
       FROM teachers`
    );

    return stats[0];
  }
}
