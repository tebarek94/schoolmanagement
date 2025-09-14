import { executeQuery, executeTransaction } from '@/config/database';
import { Parent, CreateParentRequest, PaginationQuery } from '@/types';
import { CustomError } from '@/middlewares/errorHandler';
import bcrypt from 'bcryptjs';

export class ParentService {
  // Create new parent
  async createParent(parentData: CreateParentRequest): Promise<Parent> {
    const {
      email,
      password,
      first_name,
      last_name,
      middle_name,
      phone,
      email: parentEmail,
      address,
      occupation,
      relationship,
      student_id,
    } = parentData;

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

    // Get parent role ID
    const roles = await executeQuery<any[]>(
      'SELECT id FROM roles WHERE name = ?',
      ['Parent']
    );

    if (roles.length === 0) {
      throw new CustomError('Parent role not found', 500);
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

    // Create parent profile
    const parentResult = await executeQuery(
      `INSERT INTO parents (
        user_id, first_name, last_name, middle_name, phone, 
        email, address, occupation, relationship, is_primary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        first_name,
        last_name,
        middle_name || null,
        phone,
        parentEmail || null,
        address || null,
        occupation || null,
        relationship,
        true, // Default to primary parent
      ]
    );

    const parentId = (parentResult as any).insertId;

    // Link to student if provided
    if (student_id) {
      await executeQuery(
        'INSERT INTO student_parents (student_id, parent_id, relationship, is_primary) VALUES (?, ?, ?, ?)',
        [student_id, parentId, relationship, true]
      );
    }

    // Get created parent
    const parents = await executeQuery<Parent[]>(
      'SELECT * FROM parents WHERE id = ?',
      [parentId]
    );

    return parents[0];
  }

  // Get all parents with pagination
  async getParents(query: PaginationQuery): Promise<{ parents: Parent[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';

    let whereClause = 'WHERE p.is_primary = TRUE';
    let params: any[] = [];

    if (search) {
      whereClause += ` AND (
        p.first_name LIKE ? OR 
        p.last_name LIKE ? OR 
        p.phone LIKE ? OR 
        p.email LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern, searchPattern];
    }

    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM parents p 
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get parents with pagination
    const parents = await executeQuery<Parent[]>(
      `SELECT p.*, u.email as user_email, u.last_login
       FROM parents p
       JOIN users u ON p.user_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { parents, total };
  }

  // Get parent by ID
  async getParentById(id: number): Promise<Parent> {
    const parents = await executeQuery<Parent[]>(
      `SELECT p.*, u.email as user_email, u.last_login
       FROM parents p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (parents.length === 0) {
      throw new CustomError('Parent not found', 404);
    }

    return parents[0];
  }

  // Update parent
  async updateParent(id: number, updateData: Partial<Parent>): Promise<Parent> {
    // Check if parent exists
    const existingParents = await executeQuery<Parent[]>(
      'SELECT id FROM parents WHERE id = ?',
      [id]
    );

    if (existingParents.length === 0) {
      throw new CustomError('Parent not found', 404);
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
      `UPDATE parents SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Return updated parent
    return this.getParentById(id);
  }

  // Delete parent
  async deleteParent(id: number): Promise<void> {
    // Check if parent exists
    const existingParents = await executeQuery<Parent[]>(
      'SELECT id FROM parents WHERE id = ?',
      [id]
    );

    if (existingParents.length === 0) {
      throw new CustomError('Parent not found', 404);
    }

    // Check if parent has students
    const studentParents = await executeQuery<any[]>(
      'SELECT id FROM student_parents WHERE parent_id = ?',
      [id]
    );

    if (studentParents.length > 0) {
      throw new CustomError('Cannot delete parent. Parent has students linked.', 409);
    }

    // Get user ID
    const parents = await executeQuery<Parent[]>(
      'SELECT user_id FROM parents WHERE id = ?',
      [id]
    );

    // Delete parent record
    await executeQuery(
      'DELETE FROM parents WHERE id = ?',
      [id]
    );

    // Also deactivate user account
    if (parents.length > 0) {
      await executeQuery(
        'UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
        [parents[0].user_id]
      );
    }
  }

  // Link parent to student
  async linkParentToStudent(parentId: number, studentId: number, relationship: string, isPrimary: boolean = false): Promise<void> {
    // Check if parent exists
    const parents = await executeQuery<Parent[]>(
      'SELECT id FROM parents WHERE id = ?',
      [parentId]
    );

    if (parents.length === 0) {
      throw new CustomError('Parent not found', 404);
    }

    // Check if student exists
    const students = await executeQuery<any[]>(
      'SELECT id FROM students WHERE id = ? AND is_active = TRUE',
      [studentId]
    );

    if (students.length === 0) {
      throw new CustomError('Student not found', 404);
    }

    // Check if already linked
    const existingLinks = await executeQuery<any[]>(
      'SELECT id FROM student_parents WHERE parent_id = ? AND student_id = ?',
      [parentId, studentId]
    );

    if (existingLinks.length > 0) {
      throw new CustomError('Parent is already linked to this student', 409);
    }

    // If this is set as primary, unset other primary parents for this student
    if (isPrimary) {
      await executeQuery(
        'UPDATE student_parents SET is_primary = FALSE WHERE student_id = ?',
        [studentId]
      );
    }

    // Link parent to student
    await executeQuery(
      'INSERT INTO student_parents (student_id, parent_id, relationship, is_primary) VALUES (?, ?, ?, ?)',
      [studentId, parentId, relationship, isPrimary]
    );
  }

  // Unlink parent from student
  async unlinkParentFromStudent(parentId: number, studentId: number): Promise<void> {
    // Check if link exists
    const existingLinks = await executeQuery<any[]>(
      'SELECT id FROM student_parents WHERE parent_id = ? AND student_id = ?',
      [parentId, studentId]
    );

    if (existingLinks.length === 0) {
      throw new CustomError('Parent is not linked to this student', 404);
    }

    // Unlink parent from student
    await executeQuery(
      'DELETE FROM student_parents WHERE parent_id = ? AND student_id = ?',
      [parentId, studentId]
    );
  }

  // Get parent's students
  async getParentStudents(parentId: number): Promise<any[]> {
    const students = await executeQuery<any[]>(
      `SELECT s.*, sp.relationship, sp.is_primary, u.email as student_email
       FROM students s
       JOIN student_parents sp ON s.id = sp.student_id
       JOIN users u ON s.user_id = u.id
       WHERE sp.parent_id = ? AND s.is_active = TRUE
       ORDER BY s.first_name, s.last_name`,
      [parentId]
    );

    return students;
  }

  // Get student's parents
  async getStudentParents(studentId: number): Promise<any[]> {
    const parents = await executeQuery<any[]>(
      `SELECT p.*, sp.relationship, sp.is_primary, u.email as parent_email
       FROM parents p
       JOIN student_parents sp ON p.id = sp.parent_id
       JOIN users u ON p.user_id = u.id
       WHERE sp.student_id = ?
       ORDER BY sp.is_primary DESC, p.first_name, p.last_name`,
      [studentId]
    );

    return parents;
  }

  // Get parent statistics
  async getParentStats(): Promise<any> {
    const stats = await executeQuery<any[]>(
      `SELECT 
        COUNT(*) as total_parents,
        COUNT(CASE WHEN relationship = 'Father' THEN 1 END) as fathers,
        COUNT(CASE WHEN relationship = 'Mother' THEN 1 END) as mothers,
        COUNT(CASE WHEN relationship = 'Guardian' THEN 1 END) as guardians,
        COUNT(CASE WHEN is_primary = TRUE THEN 1 END) as primary_parents
       FROM parents`
    );

    return stats[0];
  }
}
