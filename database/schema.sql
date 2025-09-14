-- School Management System Database Schema
-- Created for Primary Schools in Addis Ababa

-- Create database
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- =============================================
-- USERS AND ROLES MANAGEMENT
-- =============================================

-- Roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table (base table for all user types)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_email (email),
    INDEX idx_role (role_id),
    INDEX idx_active (is_active)
);

-- =============================================
-- ACADEMIC STRUCTURE
-- =============================================

-- Academic years
CREATE TABLE academic_years (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year VARCHAR(9) NOT NULL UNIQUE, -- e.g., "2023-2024"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_current (is_current)
);

-- Terms/Semesters
CREATE TABLE terms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    academic_year_id INT NOT NULL,
    name VARCHAR(50) NOT NULL, -- "First Term", "Second Term", "Third Term"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    INDEX idx_academic_year (academic_year_id),
    INDEX idx_current (is_current)
);

-- Grades/Classes
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE, -- "Grade 1", "Grade 2", etc.
    level INT NOT NULL UNIQUE, -- 1, 2, 3, etc.
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sections within grades
CREATE TABLE sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grade_id INT NOT NULL,
    name VARCHAR(50) NOT NULL, -- "A", "B", "C", etc.
    capacity INT DEFAULT 30,
    academic_year_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE KEY unique_section (grade_id, name, academic_year_id),
    INDEX idx_grade (grade_id),
    INDEX idx_academic_year (academic_year_id)
);

-- Subjects
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    is_core BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
);

-- Grade-Subject mapping
CREATE TABLE grade_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grade_id INT NOT NULL,
    subject_id INT NOT NULL,
    is_compulsory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_grade_subject (grade_id, subject_id)
);

-- =============================================
-- PERSONNEL MANAGEMENT
-- =============================================

-- Teachers
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    qualification VARCHAR(200),
    specialization VARCHAR(200),
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employee_id (employee_id),
    INDEX idx_user (user_id),
    INDEX idx_active (is_active)
);

-- Teacher-Subject assignments
CREATE TABLE teacher_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    grade_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE KEY unique_teacher_subject_grade_year (teacher_id, subject_id, grade_id, academic_year_id)
);

-- Teacher-Section assignments (Class Teachers)
CREATE TABLE teacher_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    section_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    is_class_teacher BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE KEY unique_teacher_section_year (teacher_id, section_id, academic_year_id)
);

-- =============================================
-- STUDENT MANAGEMENT
-- =============================================

-- Students
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    admission_date DATE NOT NULL,
    admission_number VARCHAR(50) NOT NULL UNIQUE,
    previous_school VARCHAR(200),
    medical_info TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_admission_number (admission_number),
    INDEX idx_user (user_id),
    INDEX idx_active (is_active)
);

-- Student-Section enrollment
CREATE TABLE student_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    status ENUM('Active', 'Transferred', 'Graduated', 'Dropped') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_section_year (student_id, section_id, academic_year_id),
    INDEX idx_student (student_id),
    INDEX idx_section (section_id),
    INDEX idx_academic_year (academic_year_id)
);

-- Parents
CREATE TABLE parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    occupation VARCHAR(100),
    relationship ENUM('Father', 'Mother', 'Guardian', 'Other') NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_phone (phone)
);

-- Student-Parent relationships
CREATE TABLE student_parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    parent_id INT NOT NULL,
    relationship ENUM('Father', 'Mother', 'Guardian', 'Other') NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_parent (student_id, parent_id),
    INDEX idx_student (student_id),
    INDEX idx_parent (parent_id)
);

-- =============================================
-- ATTENDANCE MANAGEMENT
-- =============================================

-- Attendance records
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
    remarks TEXT,
    marked_by INT NOT NULL, -- teacher_id who marked attendance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES teachers(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_student_date (student_id, date),
    INDEX idx_student (student_id),
    INDEX idx_section (section_id),
    INDEX idx_date (date),
    INDEX idx_status (status)
);

-- =============================================
-- EXAMINATION MANAGEMENT
-- =============================================

-- Exam types
CREATE TABLE exam_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    weight DECIMAL(5,2) DEFAULT 1.00, -- Weight in final grade calculation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Examinations
CREATE TABLE examinations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_type_id INT NOT NULL,
    subject_id INT NOT NULL,
    grade_id INT NOT NULL,
    section_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    term_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    exam_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    total_marks DECIMAL(5,2) NOT NULL,
    passing_marks DECIMAL(5,2) NOT NULL,
    created_by INT NOT NULL, -- teacher_id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_type_id) REFERENCES exam_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES teachers(id) ON DELETE RESTRICT,
    INDEX idx_exam_type (exam_type_id),
    INDEX idx_subject (subject_id),
    INDEX idx_grade (grade_id),
    INDEX idx_section (section_id),
    INDEX idx_academic_year (academic_year_id),
    INDEX idx_term (term_id),
    INDEX idx_exam_date (exam_date)
);

-- Exam results
CREATE TABLE exam_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    examination_id INT NOT NULL,
    student_id INT NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    grade VARCHAR(2), -- A+, A, B+, B, C+, C, D, F
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (examination_id) REFERENCES examinations(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_exam_student (examination_id, student_id),
    INDEX idx_examination (examination_id),
    INDEX idx_student (student_id),
    INDEX idx_marks (marks_obtained)
);

-- =============================================
-- PAYMENT MANAGEMENT
-- =============================================

-- Fee structures
CREATE TABLE fee_structures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grade_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    term_id INT NOT NULL,
    fee_type ENUM('Tuition', 'Transport', 'Library', 'Sports', 'Exam', 'Other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
    INDEX idx_grade (grade_id),
    INDEX idx_academic_year (academic_year_id),
    INDEX idx_term (term_id),
    INDEX idx_fee_type (fee_type)
);

-- Payment records
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    fee_structure_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('Cash', 'Bank Transfer', 'Check', 'Mobile Money', 'Other') NOT NULL,
    reference_number VARCHAR(100),
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('Paid', 'Partial', 'Pending', 'Overdue') DEFAULT 'Paid',
    remarks TEXT,
    received_by INT NOT NULL, -- staff_id who received payment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE RESTRICT,
    FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_student (student_id),
    INDEX idx_fee_structure (fee_structure_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_receipt_number (receipt_number),
    INDEX idx_status (status)
);

-- =============================================
-- SYSTEM SETTINGS
-- =============================================

-- System settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('String', 'Number', 'Boolean', 'JSON') DEFAULT 'String',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_public (is_public)
);

-- Audit logs
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Additional indexes for better performance
CREATE INDEX idx_users_email_active ON users(email, is_active);
CREATE INDEX idx_students_active ON students(is_active);
CREATE INDEX idx_teachers_active ON teachers(is_active);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_exam_results_student_exam ON exam_results(student_id, examination_id);
CREATE INDEX idx_payments_student_date ON payments(student_id, payment_date);

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Student details with parent information
CREATE VIEW student_details AS
SELECT 
    s.id,
    s.student_id,
    s.first_name,
    s.last_name,
    s.middle_name,
    s.date_of_birth,
    s.gender,
    s.admission_date,
    s.admission_number,
    s.is_active,
    g.name as grade_name,
    sec.name as section_name,
    ay.year as academic_year,
    p.first_name as parent_first_name,
    p.last_name as parent_last_name,
    p.phone as parent_phone,
    p.relationship
FROM students s
LEFT JOIN student_sections ss ON s.id = ss.student_id AND ss.status = 'Active'
LEFT JOIN sections sec ON ss.section_id = sec.id
LEFT JOIN grades g ON sec.grade_id = g.id
LEFT JOIN academic_years ay ON ss.academic_year_id = ay.id
LEFT JOIN student_parents sp ON s.id = sp.student_id AND sp.is_primary = TRUE
LEFT JOIN parents p ON sp.parent_id = p.id;

-- Teacher details with subjects
CREATE VIEW teacher_details AS
SELECT 
    t.id,
    t.employee_id,
    t.first_name,
    t.last_name,
    t.middle_name,
    t.phone,
    t.qualification,
    t.specialization,
    t.hire_date,
    t.is_active,
    GROUP_CONCAT(DISTINCT s.name) as subjects,
    GROUP_CONCAT(DISTINCT g.name) as grades
FROM teachers t
LEFT JOIN teacher_subjects ts ON t.id = ts.teacher_id
LEFT JOIN subjects s ON ts.subject_id = s.id
LEFT JOIN grades g ON ts.grade_id = g.id
GROUP BY t.id;

-- =============================================
-- TRIGGERS FOR DATA INTEGRITY
-- =============================================

-- Trigger to update student_sections when student is transferred
DELIMITER //
CREATE TRIGGER update_student_section_status
BEFORE UPDATE ON student_sections
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status AND NEW.status = 'Transferred' THEN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
END//
DELIMITER ;

-- Trigger to generate receipt number
DELIMITER //
CREATE TRIGGER generate_receipt_number
BEFORE INSERT ON payments
FOR EACH ROW
BEGIN
    IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
        SET NEW.receipt_number = CONCAT('RCP-', YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(DAY(NOW()), 2, '0'), '-', LPAD(NEW.id, 6, '0'));
    END IF;
END//
DELIMITER ;
