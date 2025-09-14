import { executeQuery } from '@/config/database';
import { Attendance, AttendanceRequest, PaginationQuery } from '@/types';
import { CustomError } from '@/middlewares/errorHandler';

export class AttendanceService {
  // Mark attendance for a student
  async markAttendance(attendanceData: AttendanceRequest): Promise<Attendance> {
    const { student_id, section_id, date, status, remarks } = attendanceData;
    
    // Check if student exists
    const students = await executeQuery<any[]>(
      'SELECT id FROM students WHERE id = ? AND is_active = TRUE',
      [student_id]
    );
    
    if (students.length === 0) {
      throw new CustomError('Student not found', 404);
    }
    
    // Check if section exists
    const sections = await executeQuery<any[]>(
      'SELECT id FROM sections WHERE id = ?',
      [section_id]
    );
    
    if (sections.length === 0) {
      throw new CustomError('Section not found', 404);
    }
    
    // Check if attendance already marked for this date
    const existingAttendance = await executeQuery<Attendance[]>(
      'SELECT id FROM attendance WHERE student_id = ? AND date = ?',
      [student_id, date]
    );
    
    if (existingAttendance.length > 0) {
      throw new CustomError('Attendance already marked for this date', 409);
    }
    
    const result = await executeQuery(
      'INSERT INTO attendance (student_id, section_id, date, status, remarks, marked_by) VALUES (?, ?, ?, ?, ?, ?)',
      [student_id, section_id, date, status, remarks || null, 1] // TODO: Get from authenticated user
    );
    
    const attendanceId = (result as any).insertId;
    
    const attendance = await executeQuery<Attendance[]>(
      'SELECT * FROM attendance WHERE id = ?',
      [attendanceId]
    );
    
    return attendance[0];
  }
  
  // Mark attendance for multiple students
  async markBulkAttendance(attendanceData: AttendanceRequest[]): Promise<Attendance[]> {
    const results: Attendance[] = [];
    
    for (const data of attendanceData) {
      try {
        const attendance = await this.markAttendance(data);
        results.push(attendance);
      } catch (error) {
        // Log error but continue with other students
        console.error(`Failed to mark attendance for student ${data.student_id}:`, error);
      }
    }
    
    return results;
  }
  
  // Get attendance records
  async getAttendanceRecords(query: PaginationQuery): Promise<{ attendance: Attendance[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const studentId = query.studentId;
    const sectionId = query.sectionId;
    const startDate = query.startDate;
    const endDate = query.endDate;
    const status = query.status;
    
    let whereClause = 'WHERE 1=1';
    let params: any[] = [];
    
    if (search) {
      whereClause += ` AND (
        s.first_name LIKE ? OR 
        s.last_name LIKE ? OR 
        s.student_id LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern];
    }
    
    if (studentId) {
      whereClause += ' AND a.student_id = ?';
      params.push(studentId);
    }
    
    if (sectionId) {
      whereClause += ' AND a.section_id = ?';
      params.push(sectionId);
    }
    
    if (startDate) {
      whereClause += ' AND a.date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      whereClause += ' AND a.date <= ?';
      params.push(endDate);
    }
    
    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }
    
    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       ${whereClause}`,
      params
    );
    
    const total = countResult[0].total;
    
    // Get attendance records with pagination
    const attendance = await executeQuery<Attendance[]>(
      `SELECT a.*, s.first_name, s.last_name, s.student_id, sec.name as section_name, g.name as grade_name
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       JOIN sections sec ON a.section_id = sec.id
       JOIN grades g ON sec.grade_id = g.id
       ${whereClause}
       ORDER BY a.date DESC, s.first_name, s.last_name
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    return { attendance, total };
  }
  
  // Get attendance by ID
  async getAttendanceById(id: number): Promise<Attendance> {
    const attendance = await executeQuery<Attendance[]>(
      `SELECT a.*, s.first_name, s.last_name, s.student_id, sec.name as section_name, g.name as grade_name
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       JOIN sections sec ON a.section_id = sec.id
       JOIN grades g ON sec.grade_id = g.id
       WHERE a.id = ?`,
      [id]
    );
    
    if (attendance.length === 0) {
      throw new CustomError('Attendance record not found', 404);
    }
    
    return attendance[0];
  }
  
  // Update attendance
  async updateAttendance(id: number, updateData: Partial<Attendance>): Promise<Attendance> {
    const existingAttendance = await executeQuery<Attendance[]>(
      'SELECT id FROM attendance WHERE id = ?',
      [id]
    );
    
    if (existingAttendance.length === 0) {
      throw new CustomError('Attendance record not found', 404);
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
      `UPDATE attendance SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    return this.getAttendanceById(id);
  }
  
  // Delete attendance
  async deleteAttendance(id: number): Promise<void> {
    const existingAttendance = await executeQuery<Attendance[]>(
      'SELECT id FROM attendance WHERE id = ?',
      [id]
    );
    
    if (existingAttendance.length === 0) {
      throw new CustomError('Attendance record not found', 404);
    }
    
    await executeQuery(
      'DELETE FROM attendance WHERE id = ?',
      [id]
    );
  }
  
  // Get student attendance summary
  async getStudentAttendanceSummary(studentId: number, startDate?: string, endDate?: string): Promise<any> {
    let whereClause = 'WHERE a.student_id = ?';
    let params: any[] = [studentId];
    
    if (startDate) {
      whereClause += ' AND a.date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      whereClause += ' AND a.date <= ?';
      params.push(endDate);
    }
    
    const summary = await executeQuery<any[]>(
      `SELECT 
        COUNT(*) as total_days,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_days,
        COUNT(CASE WHEN a.status = 'Excused' THEN 1 END) as excused_days
       FROM attendance a
       ${whereClause}`,
      params
    );
    
    const result = summary[0];
    const attendancePercentage = result.total_days > 0 
      ? Math.round((result.present_days / result.total_days) * 100) 
      : 0;
    
    return {
      ...result,
      attendance_percentage: attendancePercentage,
    };
  }
  
  // Get section attendance summary
  async getSectionAttendanceSummary(sectionId: number, date?: string): Promise<any> {
    let whereClause = 'WHERE a.section_id = ?';
    let params: any[] = [sectionId];
    
    if (date) {
      whereClause += ' AND a.date = ?';
      params.push(date);
    }
    
    const summary = await executeQuery<any[]>(
      `SELECT 
        COUNT(DISTINCT a.student_id) as total_students,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_count,
        COUNT(CASE WHEN a.status = 'Excused' THEN 1 END) as excused_count
       FROM attendance a
       ${whereClause}`,
      params
    );
    
    const result = summary[0];
    const attendancePercentage = result.total_students > 0 
      ? Math.round((result.present_count / result.total_students) * 100) 
      : 0;
    
    return {
      ...result,
      attendance_percentage: attendancePercentage,
    };
  }
  
  // Get daily attendance report
  async getDailyAttendanceReport(date: string, sectionId?: number): Promise<any[]> {
    let whereClause = 'WHERE a.date = ?';
    let params: any[] = [date];
    
    if (sectionId) {
      whereClause += ' AND a.section_id = ?';
      params.push(sectionId);
    }
    
    const report = await executeQuery<any[]>(
      `SELECT 
        a.student_id,
        s.first_name,
        s.last_name,
        s.student_id as student_number,
        a.status,
        a.remarks,
        sec.name as section_name,
        g.name as grade_name
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       JOIN sections sec ON a.section_id = sec.id
       JOIN grades g ON sec.grade_id = g.id
       ${whereClause}
       ORDER BY g.level, sec.name, s.first_name, s.last_name`,
      params
    );
    
    return report;
  }
  
  // Get monthly attendance report
  async getMonthlyAttendanceReport(year: number, month: number, sectionId?: number): Promise<any[]> {
    let whereClause = 'WHERE YEAR(a.date) = ? AND MONTH(a.date) = ?';
    let params: any[] = [year, month];
    
    if (sectionId) {
      whereClause += ' AND a.section_id = ?';
      params.push(sectionId);
    }
    
    const report = await executeQuery<any[]>(
      `SELECT 
        a.student_id,
        s.first_name,
        s.last_name,
        s.student_id as student_number,
        COUNT(*) as total_days,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_days,
        COUNT(CASE WHEN a.status = 'Excused' THEN 1 END) as excused_days,
        sec.name as section_name,
        g.name as grade_name
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       JOIN sections sec ON a.section_id = sec.id
       JOIN grades g ON sec.grade_id = g.id
       ${whereClause}
       GROUP BY a.student_id
       ORDER BY g.level, sec.name, s.first_name, s.last_name`,
      params
    );
    
    // Calculate attendance percentage for each student
    return report.map(student => ({
      ...student,
      attendance_percentage: student.total_days > 0 
        ? Math.round((student.present_days / student.total_days) * 100) 
        : 0,
    }));
  }
  
  // Get attendance statistics
  async getAttendanceStats(): Promise<any> {
    const stats = await executeQuery<any[]>(
      `SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'Present' THEN 1 END) as present_count,
        COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN status = 'Late' THEN 1 END) as late_count,
        COUNT(CASE WHEN status = 'Excused' THEN 1 END) as excused_count,
        COUNT(DISTINCT student_id) as unique_students,
        COUNT(DISTINCT DATE(date)) as unique_days
       FROM attendance`
    );
    
    const result = stats[0];
    const attendancePercentage = result.total_records > 0 
      ? Math.round((result.present_count / result.total_records) * 100) 
      : 0;
    
    return {
      ...result,
      attendance_percentage: attendancePercentage,
    };
  }
}
