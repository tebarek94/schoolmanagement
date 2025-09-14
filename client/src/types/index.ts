// User and Authentication Types
export interface User {
  id: number;
  email: string;
  role: string;
  profile?: Student | Teacher | Parent | Admin;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  profile: Partial<Student | Teacher | Parent | Admin>;
}

// Student Types
export interface Student {
  id: number;
  user_id: number;
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
  profile_image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  grade_name?: string;
  section_name?: string;
  academic_year?: string;
  parent_first_name?: string;
  parent_last_name?: string;
  parent_phone?: string;
  relationship?: string;
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

// Teacher Types
export interface Teacher {
  id: number;
  user_id: number;
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
  is_active: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  subjects?: string;
  grades?: string;
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

// Parent Types
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
  created_at: string;
  updated_at: string;
}

// Admin Types
export interface Admin {
  id: number;
  user_id: number;
  admin_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender: 'Male' | 'Female' | 'Other';
  department?: string;
  access_level: 'Full' | 'Limited' | 'Read Only';
  hire_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

// Academic Types
export interface Grade {
  id: number;
  name: string;
  level: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: number;
  grade_id: number;
  name: string;
  capacity: number;
  academic_year_id: number;
  created_at: string;
  updated_at: string;
  grade_name?: string;
  academic_year?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_core: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: number;
  year: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface Term {
  id: number;
  academic_year_id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

// Attendance Types
export interface Attendance {
  id: number;
  student_id: number;
  section_id: number;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
  marked_by: number;
  created_at: string;
  updated_at: string;
  student_name?: string;
  section_name?: string;
  grade_name?: string;
}

export interface AttendanceRequest {
  student_id: number;
  section_id: number;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

// Exam Types
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
  exam_date: string;
  start_time?: string;
  end_time?: string;
  total_marks: number;
  passing_marks: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  subject_name?: string;
  grade_name?: string;
  section_name?: string;
  academic_year?: string;
  term_name?: string;
}

export interface ExamResult {
  id: number;
  examination_id: number;
  student_id: number;
  marks_obtained: number;
  grade?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  student_name?: string;
  exam_title?: string;
  subject_name?: string;
  total_marks?: number;
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

// Payment Types
export interface Payment {
  id: number;
  student_id: number;
  fee_structure_id: number;
  amount: number;
  payment_date: string;
  payment_method: 'Cash' | 'Bank Transfer' | 'Check' | 'Mobile Money' | 'Other';
  reference_number?: string;
  receipt_number: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  remarks?: string;
  received_by: number;
  created_at: string;
  updated_at: string;
  student_name?: string;
  fee_type?: string;
  grade_name?: string;
}

export interface FeeStructure {
  id: number;
  grade_id: number;
  academic_year_id: number;
  term_id: number;
  fee_type: 'Tuition' | 'Transport' | 'Library' | 'Sports' | 'Exam' | 'Other';
  amount: number;
  due_date: string;
  is_mandatory: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  grade_name?: string;
  academic_year?: string;
  term_name?: string;
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

// API Response Types
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

// Dashboard Types
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

// Report Types
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
  exam_date: string;
}

export interface PaymentReport {
  student_id: number;
  student_name: string;
  fee_type: string;
  amount: number;
  payment_date: string;
  status: string;
  receipt_number: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  roles: string[];
  children?: NavItem[];
}

// Theme Types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

// Error Types
export interface AppError {
  message: string;
  statusCode?: number;
  field?: string;
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

