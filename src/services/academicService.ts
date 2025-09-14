import { executeQuery } from '@/config/database';
import { Grade, Section, Subject, AcademicYear, Term, PaginationQuery } from '@/types';
import { CustomError } from '@/middlewares/errorHandler';

export class AcademicService {
  // =============================================
  // GRADES MANAGEMENT
  // =============================================
  
  // Create new grade
  async createGrade(gradeData: Partial<Grade>): Promise<Grade> {
    const { name, level, description } = gradeData;
    
    // Check if grade name already exists
    const existingGrades = await executeQuery<Grade[]>(
      'SELECT id FROM grades WHERE name = ?',
      [name]
    );
    
    if (existingGrades.length > 0) {
      throw new CustomError('Grade name already exists', 409);
    }
    
    // Check if grade level already exists
    const existingLevels = await executeQuery<Grade[]>(
      'SELECT id FROM grades WHERE level = ?',
      [level]
    );
    
    if (existingLevels.length > 0) {
      throw new CustomError('Grade level already exists', 409);
    }
    
    const result = await executeQuery(
      'INSERT INTO grades (name, level, description) VALUES (?, ?, ?)',
      [name, level, description || null]
    );
    
    const gradeId = (result as any).insertId;
    
    const grades = await executeQuery<Grade[]>(
      'SELECT * FROM grades WHERE id = ?',
      [gradeId]
    );
    
    return grades[0];
  }
  
  // Get all grades
  async getGrades(): Promise<Grade[]> {
    const grades = await executeQuery<Grade[]>(
      'SELECT * FROM grades ORDER BY level ASC'
    );
    
    return grades;
  }
  
  // Get grade by ID
  async getGradeById(id: number): Promise<Grade> {
    const grades = await executeQuery<Grade[]>(
      'SELECT * FROM grades WHERE id = ?',
      [id]
    );
    
    if (grades.length === 0) {
      throw new CustomError('Grade not found', 404);
    }
    
    return grades[0];
  }
  
  // Update grade
  async updateGrade(id: number, updateData: Partial<Grade>): Promise<Grade> {
    const existingGrades = await executeQuery<Grade[]>(
      'SELECT id FROM grades WHERE id = ?',
      [id]
    );
    
    if (existingGrades.length === 0) {
      throw new CustomError('Grade not found', 404);
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
      `UPDATE grades SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    return this.getGradeById(id);
  }
  
  // Delete grade
  async deleteGrade(id: number): Promise<void> {
    const existingGrades = await executeQuery<Grade[]>(
      'SELECT id FROM grades WHERE id = ?',
      [id]
    );
    
    if (existingGrades.length === 0) {
      throw new CustomError('Grade not found', 404);
    }
    
    // Check if grade has sections
    const sections = await executeQuery<any[]>(
      'SELECT id FROM sections WHERE grade_id = ?',
      [id]
    );
    
    if (sections.length > 0) {
      throw new CustomError('Cannot delete grade. Grade has sections.', 409);
    }
    
    await executeQuery(
      'DELETE FROM grades WHERE id = ?',
      [id]
    );
  }
  
  // =============================================
  // SECTIONS MANAGEMENT
  // =============================================
  
  // Create new section
  async createSection(sectionData: Partial<Section>): Promise<Section> {
    const { grade_id, name, capacity, academic_year_id } = sectionData;
    
    // Check if section name already exists for this grade and academic year
    const existingSections = await executeQuery<Section[]>(
      'SELECT id FROM sections WHERE grade_id = ? AND name = ? AND academic_year_id = ?',
      [grade_id, name, academic_year_id]
    );
    
    if (existingSections.length > 0) {
      throw new CustomError('Section name already exists for this grade and academic year', 409);
    }
    
    const result = await executeQuery(
      'INSERT INTO sections (grade_id, name, capacity, academic_year_id) VALUES (?, ?, ?, ?)',
      [grade_id, name, capacity || 30, academic_year_id]
    );
    
    const sectionId = (result as any).insertId;
    
    const sections = await executeQuery<Section[]>(
      'SELECT * FROM sections WHERE id = ?',
      [sectionId]
    );
    
    return sections[0];
  }
  
  // Get all sections
  async getSections(query: PaginationQuery): Promise<{ sections: Section[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const gradeId = query.gradeId;
    const academicYearId = query.academicYearId;
    
    let whereClause = 'WHERE 1=1';
    let params: any[] = [];
    
    if (search) {
      whereClause += ` AND (
        s.name LIKE ? OR 
        g.name LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern];
    }
    
    if (gradeId) {
      whereClause += ' AND s.grade_id = ?';
      params.push(gradeId);
    }
    
    if (academicYearId) {
      whereClause += ' AND s.academic_year_id = ?';
      params.push(academicYearId);
    }
    
    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total 
       FROM sections s
       JOIN grades g ON s.grade_id = g.id
       ${whereClause}`,
      params
    );
    
    const total = countResult[0].total;
    
    // Get sections with pagination
    const sections = await executeQuery<Section[]>(
      `SELECT s.*, g.name as grade_name, g.level as grade_level
       FROM sections s
       JOIN grades g ON s.grade_id = g.id
       ${whereClause}
       ORDER BY g.level, s.name
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    return { sections, total };
  }
  
  // Get section by ID
  async getSectionById(id: number): Promise<Section> {
    const sections = await executeQuery<Section[]>(
      `SELECT s.*, g.name as grade_name, g.level as grade_level
       FROM sections s
       JOIN grades g ON s.grade_id = g.id
       WHERE s.id = ?`,
      [id]
    );
    
    if (sections.length === 0) {
      throw new CustomError('Section not found', 404);
    }
    
    return sections[0];
  }
  
  // Update section
  async updateSection(id: number, updateData: Partial<Section>): Promise<Section> {
    const existingSections = await executeQuery<Section[]>(
      'SELECT id FROM sections WHERE id = ?',
      [id]
    );
    
    if (existingSections.length === 0) {
      throw new CustomError('Section not found', 404);
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
      `UPDATE sections SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    return this.getSectionById(id);
  }
  
  // Delete section
  async deleteSection(id: number): Promise<void> {
    const existingSections = await executeQuery<Section[]>(
      'SELECT id FROM sections WHERE id = ?',
      [id]
    );
    
    if (existingSections.length === 0) {
      throw new CustomError('Section not found', 404);
    }
    
    // Check if section has students
    const students = await executeQuery<any[]>(
      'SELECT id FROM student_sections WHERE section_id = ?',
      [id]
    );
    
    if (students.length > 0) {
      throw new CustomError('Cannot delete section. Section has students.', 409);
    }
    
    await executeQuery(
      'DELETE FROM sections WHERE id = ?',
      [id]
    );
  }
  
  // =============================================
  // SUBJECTS MANAGEMENT
  // =============================================
  
  // Create new subject
  async createSubject(subjectData: Partial<Subject>): Promise<Subject> {
    const { name, code, description, is_core } = subjectData;
    
    // Check if subject code already exists
    const existingSubjects = await executeQuery<Subject[]>(
      'SELECT id FROM subjects WHERE code = ?',
      [code]
    );
    
    if (existingSubjects.length > 0) {
      throw new CustomError('Subject code already exists', 409);
    }
    
    const result = await executeQuery(
      'INSERT INTO subjects (name, code, description, is_core) VALUES (?, ?, ?, ?)',
      [name, code, description || null, is_core || true]
    );
    
    const subjectId = (result as any).insertId;
    
    const subjects = await executeQuery<Subject[]>(
      'SELECT * FROM subjects WHERE id = ?',
      [subjectId]
    );
    
    return subjects[0];
  }
  
  // Get all subjects
  async getSubjects(query: PaginationQuery): Promise<{ subjects: Subject[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    
    let whereClause = '';
    let params: any[] = [];
    
    if (search) {
      whereClause = 'WHERE name LIKE ? OR code LIKE ?';
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern];
    }
    
    // Get total count
    const countResult = await executeQuery<any[]>(
      `SELECT COUNT(*) as total FROM subjects ${whereClause}`,
      params
    );
    
    const total = countResult[0].total;
    
    // Get subjects with pagination
    const subjects = await executeQuery<Subject[]>(
      `SELECT * FROM subjects ${whereClause}
       ORDER BY name ASC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    return { subjects, total };
  }
  
  // Get subject by ID
  async getSubjectById(id: number): Promise<Subject> {
    const subjects = await executeQuery<Subject[]>(
      'SELECT * FROM subjects WHERE id = ?',
      [id]
    );
    
    if (subjects.length === 0) {
      throw new CustomError('Subject not found', 404);
    }
    
    return subjects[0];
  }
  
  // Update subject
  async updateSubject(id: number, updateData: Partial<Subject>): Promise<Subject> {
    const existingSubjects = await executeQuery<Subject[]>(
      'SELECT id FROM subjects WHERE id = ?',
      [id]
    );
    
    if (existingSubjects.length === 0) {
      throw new CustomError('Subject not found', 404);
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
      `UPDATE subjects SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    return this.getSubjectById(id);
  }
  
  // Delete subject
  async deleteSubject(id: number): Promise<void> {
    const existingSubjects = await executeQuery<Subject[]>(
      'SELECT id FROM subjects WHERE id = ?',
      [id]
    );
    
    if (existingSubjects.length === 0) {
      throw new CustomError('Subject not found', 404);
    }
    
    // Check if subject is assigned to grades
    const gradeSubjects = await executeQuery<any[]>(
      'SELECT id FROM grade_subjects WHERE subject_id = ?',
      [id]
    );
    
    if (gradeSubjects.length > 0) {
      throw new CustomError('Cannot delete subject. Subject is assigned to grades.', 409);
    }
    
    await executeQuery(
      'DELETE FROM subjects WHERE id = ?',
      [id]
    );
  }
  
  // Assign subject to grade
  async assignSubjectToGrade(gradeId: number, subjectId: number, isCompulsory: boolean = true): Promise<void> {
    // Check if grade exists
    const grades = await executeQuery<any[]>(
      'SELECT id FROM grades WHERE id = ?',
      [gradeId]
    );
    
    if (grades.length === 0) {
      throw new CustomError('Grade not found', 404);
    }
    
    // Check if subject exists
    const subjects = await executeQuery<any[]>(
      'SELECT id FROM subjects WHERE id = ?',
      [subjectId]
    );
    
    if (subjects.length === 0) {
      throw new CustomError('Subject not found', 404);
    }
    
    // Check if already assigned
    const existingAssignments = await executeQuery<any[]>(
      'SELECT id FROM grade_subjects WHERE grade_id = ? AND subject_id = ?',
      [gradeId, subjectId]
    );
    
    if (existingAssignments.length > 0) {
      throw new CustomError('Subject is already assigned to this grade', 409);
    }
    
    // Assign subject to grade
    await executeQuery(
      'INSERT INTO grade_subjects (grade_id, subject_id, is_compulsory) VALUES (?, ?, ?)',
      [gradeId, subjectId, isCompulsory]
    );
  }
  
  // Get subjects by grade
  async getSubjectsByGrade(gradeId: number): Promise<any[]> {
    const subjects = await executeQuery<any[]>(
      `SELECT s.*, gs.is_compulsory
       FROM subjects s
       JOIN grade_subjects gs ON s.id = gs.subject_id
       WHERE gs.grade_id = ?
       ORDER BY s.name`,
      [gradeId]
    );
    
    return subjects;
  }
  
  // =============================================
  // ACADEMIC YEARS MANAGEMENT
  // =============================================
  
  // Create new academic year
  async createAcademicYear(academicYearData: Partial<AcademicYear>): Promise<AcademicYear> {
    const { year, start_date, end_date } = academicYearData;
    
    // Check if academic year already exists
    const existingYears = await executeQuery<AcademicYear[]>(
      'SELECT id FROM academic_years WHERE year = ?',
      [year]
    );
    
    if (existingYears.length > 0) {
      throw new CustomError('Academic year already exists', 409);
    }
    
    const result = await executeQuery(
      'INSERT INTO academic_years (year, start_date, end_date, is_current) VALUES (?, ?, ?, ?)',
      [year, start_date, end_date, false]
    );
    
    const yearId = (result as any).insertId;
    
    const academicYears = await executeQuery<AcademicYear[]>(
      'SELECT * FROM academic_years WHERE id = ?',
      [yearId]
    );
    
    return academicYears[0];
  }
  
  // Get all academic years
  async getAcademicYears(): Promise<AcademicYear[]> {
    const academicYears = await executeQuery<AcademicYear[]>(
      'SELECT * FROM academic_years ORDER BY year DESC'
    );
    
    return academicYears;
  }
  
  // Get current academic year
  async getCurrentAcademicYear(): Promise<AcademicYear> {
    const academicYears = await executeQuery<AcademicYear[]>(
      'SELECT * FROM academic_years WHERE is_current = TRUE'
    );
    
    if (academicYears.length === 0) {
      throw new CustomError('No current academic year found', 404);
    }
    
    return academicYears[0];
  }
  
  // Set current academic year
  async setCurrentAcademicYear(yearId: number): Promise<void> {
    // Set all academic years as not current
    await executeQuery(
      'UPDATE academic_years SET is_current = FALSE'
    );
    
    // Set the specified year as current
    await executeQuery(
      'UPDATE academic_years SET is_current = TRUE WHERE id = ?',
      [yearId]
    );
  }
  
  // =============================================
  // TERMS MANAGEMENT
  // =============================================
  
  // Create new term
  async createTerm(termData: Partial<Term>): Promise<Term> {
    const { academic_year_id, name, start_date, end_date } = termData;
    
    // Check if term name already exists for this academic year
    const existingTerms = await executeQuery<Term[]>(
      'SELECT id FROM terms WHERE academic_year_id = ? AND name = ?',
      [academic_year_id, name]
    );
    
    if (existingTerms.length > 0) {
      throw new CustomError('Term name already exists for this academic year', 409);
    }
    
    const result = await executeQuery(
      'INSERT INTO terms (academic_year_id, name, start_date, end_date, is_current) VALUES (?, ?, ?, ?, ?)',
      [academic_year_id, name, start_date, end_date, false]
    );
    
    const termId = (result as any).insertId;
    
    const terms = await executeQuery<Term[]>(
      'SELECT * FROM terms WHERE id = ?',
      [termId]
    );
    
    return terms[0];
  }
  
  // Get terms by academic year
  async getTermsByAcademicYear(academicYearId: number): Promise<Term[]> {
    const terms = await executeQuery<Term[]>(
      'SELECT * FROM terms WHERE academic_year_id = ? ORDER BY start_date ASC',
      [academicYearId]
    );
    
    return terms;
  }
  
  // Get current term
  async getCurrentTerm(): Promise<Term> {
    const terms = await executeQuery<Term[]>(
      'SELECT * FROM terms WHERE is_current = TRUE'
    );
    
    if (terms.length === 0) {
      throw new CustomError('No current term found', 404);
    }
    
    return terms[0];
  }
  
  // Set current term
  async setCurrentTerm(termId: number): Promise<void> {
    // Set all terms as not current
    await executeQuery(
      'UPDATE terms SET is_current = FALSE'
    );
    
    // Set the specified term as current
    await executeQuery(
      'UPDATE terms SET is_current = TRUE WHERE id = ?',
      [termId]
    );
  }
}
