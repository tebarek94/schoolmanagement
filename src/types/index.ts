// TypeScript interfaces for School Management System

export interface User {
  id: number;
  email: string;
  password: string;
  role_id: number;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Student {
  id: number;
  user_id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  address?: string;
  date_of_birth: Date;
  gender: 'Male' | 'Female' | 'Other';
  admission_date: Date;
  admission_number: string;
  previous_school?: string;
  medical_info?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_image?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Teacher {
  id: number;
  user_id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  gender: 'Male' | 'Female' | 'Other';
  qualification?: string;
  specialization?: string;
  hire_date: Date;
  salary?: number;
  is_active: boolean;
  profile_image?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Parent {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
  email?: string;
  address?: string;
  occupation?: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Grade {
  id: number;
  name: string;
  level: number;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Section {
  id: number;
  grade_id: number;
  name: string;
  capacity: number;
  academic_year_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_core: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AcademicYear {
  id: number;
  year: string;
  start_date: Date;
  end_date: Date;
  is_current: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Term {
  id: number;
  academic_year_id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  is_current: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Attendance {
  id: number;
  student_id: number;
  section_id: number;
  date: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
  marked_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface Examination {
  id: number;
  exam_type_id: number;
  subject_id: number;
  grade_id: number;
  section_id: number;
  academic_year_id: number;
  term_id: number;
  title: string;
  description?: string;
  exam_date: Date;
  start_time?: string;
  end_time?: string;
  total_marks: number;
  passing_marks: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface ExamResult {
  id: number;
  examination_id: number;
  student_id: number;
  marks_obtained: number;
  grade?: string;
  remarks?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: number;
  student_id: number;
  fee_structure_id: number;
  amount: number;
  payment_date: Date;
  payment_method: 'Cash' | 'Bank Transfer' | 'Check' | 'Mobile Money' | 'Other';
  reference_number?: string;
  receipt_number: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  remarks?: string;
  received_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface FeeStructure {
  id: number;
  grade_id: number;
  academic_year_id: number;
  term_id: number;
  fee_type: 'Tuition' | 'Transport' | 'Library' | 'Sports' | 'Exam' | 'Other';
  amount: number;
  due_date: Date;
  is_mandatory: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value?: string;
  setting_type: 'String' | 'Number' | 'Boolean' | 'JSON';
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

// Request/Response DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
    profile?: Student | Teacher | Parent;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  profile: Partial<Student | Teacher | Parent>;
}

export interface CreateStudentRequest {
  email: string;
  password: string;
  student_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  address?: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  admission_date: string;
  admission_number: string;
  previous_school?: string;
  medical_info?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  parent_id?: number;
}

export interface CreateTeacherRequest {
  email: string;
  password: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender: 'Male' | 'Female' | 'Other';
  qualification?: string;
  specialization?: string;
  hire_date: string;
  salary?: number;
}

export interface CreateParentRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
  address?: string;
  occupation?: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  student_id?: number;
}

export interface AttendanceRequest {
  student_id: number;
  section_id: number;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

export interface ExamRequest {
  exam_type_id: number;
  subject_id: number;
  grade_id: number;
  section_id: number;
  academic_year_id: number;
  term_id: number;
  title: string;
  description?: string;
  exam_date: string;
  start_time?: string;
  end_time?: string;
  total_marks: number;
  passing_marks: number;
}

export interface ExamResultRequest {
  examination_id: number;
  student_id: number;
  marks_obtained: number;
  grade?: string;
  remarks?: string;
}

export interface PaymentRequest {
  student_id: number;
  fee_structure_id: number;
  amount: number;
  payment_date: string;
  payment_method: 'Cash' | 'Bank Transfer' | 'Check' | 'Mobile Money' | 'Other';
  reference_number?: string;
  remarks?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  // Additional query parameters
  studentId?: number;
  sectionId?: number;
  gradeId?: number;
  subjectId?: number;
  academicYearId?: number;
  termId?: number;
  examinationId?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Database connection options
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit?: number;
  acquireTimeout?: number;
  timeout?: number;
}

// File upload types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Report types
export interface AttendanceReport {
  student_id: number;
  student_name: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  attendance_percentage: number;
}

export interface ExamReport {
  student_id: number;
  student_name: string;
  subject_name: string;
  exam_title: string;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  exam_date: Date;
}

export interface PaymentReport {
  student_id: number;
  student_name: string;
  fee_type: string;
  amount: number;
  payment_date: Date;
  status: string;
  receipt_number: string;
}

// Statistics types
export interface DashboardStats {
  total_students: number;
  total_teachers: number;
  total_parents: number;
  total_classes: number;
  total_subjects: number;
  attendance_today: number;
  pending_payments: number;
  upcoming_exams: number;
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Validation error
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
