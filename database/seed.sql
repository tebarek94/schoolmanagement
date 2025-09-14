-- School Management System Seed Data
-- Sample data for testing and initial setup

USE school_management;

-- =============================================
-- INSERT ROLES
-- =============================================
INSERT INTO roles (name, description, permissions) VALUES
('Admin', 'System Administrator with full access', '{"all": true}'),
('Teacher', 'Teaching staff with academic access', '{"students": ["read", "update"], "attendance": ["create", "read", "update"], "exams": ["create", "read", "update"], "reports": ["read"]}'),
('Parent', 'Parent/Guardian with limited access to their children', '{"students": ["read"], "attendance": ["read"], "exams": ["read"], "payments": ["read"]}'),
('Student', 'Student with access to their own data', '{"attendance": ["read"], "exams": ["read"], "payments": ["read"]}');

-- =============================================
-- INSERT ACADEMIC YEARS AND TERMS
-- =============================================
INSERT INTO academic_years (year, start_date, end_date, is_current) VALUES
('2023-2024', '2023-09-01', '2024-08-31', TRUE),
('2024-2025', '2024-09-01', '2025-08-31', FALSE);

INSERT INTO terms (academic_year_id, name, start_date, end_date, is_current) VALUES
(1, 'First Term', '2023-09-01', '2023-12-15', FALSE),
(1, 'Second Term', '2024-01-08', '2024-04-12', FALSE),
(1, 'Third Term', '2024-04-22', '2024-08-31', TRUE),
(2, 'First Term', '2024-09-01', '2024-12-15', FALSE),
(2, 'Second Term', '2025-01-08', '2025-04-12', FALSE),
(2, 'Third Term', '2025-04-22', '2025-08-31', FALSE);

-- =============================================
-- INSERT GRADES
-- =============================================
INSERT INTO grades (name, level, description) VALUES
('Grade 1', 1, 'First grade - Beginning of primary education'),
('Grade 2', 2, 'Second grade'),
('Grade 3', 3, 'Third grade'),
('Grade 4', 4, 'Fourth grade'),
('Grade 5', 5, 'Fifth grade'),
('Grade 6', 6, 'Sixth grade'),
('Grade 7', 7, 'Seventh grade'),
('Grade 8', 8, 'Eighth grade - Final grade of primary education');

-- =============================================
-- INSERT SECTIONS
-- =============================================
INSERT INTO sections (grade_id, name, capacity, academic_year_id) VALUES
-- Grade 1 sections
(1, 'A', 30, 1),
(1, 'B', 30, 1),
-- Grade 2 sections
(2, 'A', 30, 1),
(2, 'B', 30, 1),
-- Grade 3 sections
(3, 'A', 30, 1),
(3, 'B', 30, 1),
-- Grade 4 sections
(4, 'A', 30, 1),
(4, 'B', 30, 1),
-- Grade 5 sections
(5, 'A', 30, 1),
(5, 'B', 30, 1),
-- Grade 6 sections
(6, 'A', 30, 1),
(6, 'B', 30, 1),
-- Grade 7 sections
(7, 'A', 30, 1),
(7, 'B', 30, 1),
-- Grade 8 sections
(8, 'A', 30, 1),
(8, 'B', 30, 1);

-- =============================================
-- INSERT SUBJECTS
-- =============================================
INSERT INTO subjects (name, code, description, is_core) VALUES
('English Language', 'ENG', 'English language and literature', TRUE),
('Mathematics', 'MATH', 'Mathematics and problem solving', TRUE),
('Science', 'SCI', 'General science', TRUE),
('Social Studies', 'SOC', 'History, geography, and civics', TRUE),
('Amharic', 'AMH', 'Amharic language and literature', TRUE),
('Physical Education', 'PE', 'Physical education and sports', FALSE),
('Art', 'ART', 'Art and creative activities', FALSE),
('Music', 'MUS', 'Music education', FALSE),
('Computer Science', 'CS', 'Basic computer skills', FALSE),
('Religious Studies', 'REL', 'Religious and moral education', TRUE);

-- =============================================
-- INSERT GRADE-SUBJECT MAPPING
-- =============================================
INSERT INTO grade_subjects (grade_id, subject_id, is_compulsory) VALUES
-- Grade 1 subjects
(1, 1, TRUE), (1, 2, TRUE), (1, 3, TRUE), (1, 4, TRUE), (1, 5, TRUE), (1, 6, FALSE), (1, 7, FALSE), (1, 8, FALSE), (1, 10, TRUE),
-- Grade 2 subjects
(2, 1, TRUE), (2, 2, TRUE), (2, 3, TRUE), (2, 4, TRUE), (2, 5, TRUE), (2, 6, FALSE), (2, 7, FALSE), (2, 8, FALSE), (2, 10, TRUE),
-- Grade 3 subjects
(3, 1, TRUE), (3, 2, TRUE), (3, 3, TRUE), (3, 4, TRUE), (3, 5, TRUE), (3, 6, FALSE), (3, 7, FALSE), (3, 8, FALSE), (3, 10, TRUE),
-- Grade 4 subjects
(4, 1, TRUE), (4, 2, TRUE), (4, 3, TRUE), (4, 4, TRUE), (4, 5, TRUE), (4, 6, FALSE), (4, 7, FALSE), (4, 8, FALSE), (4, 9, FALSE), (4, 10, TRUE),
-- Grade 5 subjects
(5, 1, TRUE), (5, 2, TRUE), (5, 3, TRUE), (5, 4, TRUE), (5, 5, TRUE), (5, 6, FALSE), (5, 7, FALSE), (5, 8, FALSE), (5, 9, FALSE), (5, 10, TRUE),
-- Grade 6 subjects
(6, 1, TRUE), (6, 2, TRUE), (6, 3, TRUE), (6, 4, TRUE), (6, 5, TRUE), (6, 6, FALSE), (6, 7, FALSE), (6, 8, FALSE), (6, 9, FALSE), (6, 10, TRUE),
-- Grade 7 subjects
(7, 1, TRUE), (7, 2, TRUE), (7, 3, TRUE), (7, 4, TRUE), (7, 5, TRUE), (7, 6, FALSE), (7, 7, FALSE), (7, 8, FALSE), (7, 9, FALSE), (7, 10, TRUE),
-- Grade 8 subjects
(8, 1, TRUE), (8, 2, TRUE), (8, 3, TRUE), (8, 4, TRUE), (8, 5, TRUE), (8, 6, FALSE), (8, 7, FALSE), (8, 8, FALSE), (8, 9, FALSE), (8, 10, TRUE);

-- =============================================
-- INSERT EXAM TYPES
-- =============================================
INSERT INTO exam_types (name, description, weight) VALUES
('Quiz', 'Short assessment', 0.1),
('Assignment', 'Homework and projects', 0.2),
('Mid-term Exam', 'Mid-term examination', 0.3),
('Final Exam', 'Final examination', 0.4);

-- =============================================
-- INSERT SYSTEM SETTINGS
-- =============================================
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('school_name', 'Addis Ababa Primary School', 'String', 'Name of the school', TRUE),
('school_address', 'Addis Ababa, Ethiopia', 'String', 'School address', TRUE),
('school_phone', '+251-11-123-4567', 'String', 'School contact phone', TRUE),
('school_email', 'info@aaps.edu.et', 'String', 'School email address', TRUE),
('max_students_per_section', '30', 'Number', 'Maximum students allowed per section', FALSE),
('attendance_percentage_pass', '75', 'Number', 'Minimum attendance percentage to pass', FALSE),
('exam_pass_percentage', '50', 'Number', 'Minimum percentage to pass exams', FALSE),
('late_fee_amount', '50', 'Number', 'Late payment fee amount', FALSE),
('currency', 'ETB', 'String', 'School currency', TRUE),
('timezone', 'Africa/Addis_Ababa', 'String', 'School timezone', FALSE);

-- =============================================
-- INSERT SAMPLE USERS
-- =============================================
-- Admin user
INSERT INTO users (email, password, role_id, is_active) VALUES
('admin@school.edu.et', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 1, TRUE);

-- Sample teachers
INSERT INTO users (email, password, role_id, is_active) VALUES
('teacher1@school.edu.et', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 2, TRUE),
('teacher2@school.edu.et', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 2, TRUE),
('teacher3@school.edu.et', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 2, TRUE);

-- Sample parents
INSERT INTO users (email, password, role_id, is_active) VALUES
('parent1@email.com', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 3, TRUE),
('parent2@email.com', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 3, TRUE),
('parent3@email.com', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 3, TRUE);

-- Sample students
INSERT INTO users (email, password, role_id, is_active) VALUES
('student1@school.edu.et', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 4, TRUE),
('student2@school.edu.et', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 4, TRUE),
('student3@school.edu.et', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ', 4, TRUE);

-- =============================================
-- INSERT SAMPLE TEACHERS
-- =============================================
INSERT INTO teachers (user_id, employee_id, first_name, last_name, phone, gender, qualification, specialization, hire_date, salary, is_active) VALUES
(2, 'EMP001', 'Alemayehu', 'Tadesse', '+251-91-123-4567', 'Male', 'B.Ed in Mathematics', 'Mathematics Education', '2020-09-01', 15000.00, TRUE),
(3, 'EMP002', 'Meron', 'Gebre', '+251-92-234-5678', 'Female', 'B.Ed in English', 'English Language', '2021-09-01', 15000.00, TRUE),
(4, 'EMP003', 'Tewodros', 'Mengistu', '+251-93-345-6789', 'Male', 'B.Ed in Science', 'Science Education', '2022-09-01', 15000.00, TRUE);

-- =============================================
-- INSERT SAMPLE PARENTS
-- =============================================
INSERT INTO parents (user_id, first_name, last_name, phone, email, occupation, relationship, is_primary) VALUES
(5, 'Kebede', 'Worku', '+251-94-456-7890', 'parent1@email.com', 'Engineer', 'Father', TRUE),
(6, 'Selam', 'Tesfaye', '+251-95-567-8901', 'parent2@email.com', 'Teacher', 'Mother', TRUE),
(7, 'Abebe', 'Kebede', '+251-96-678-9012', 'parent3@email.com', 'Business Owner', 'Father', TRUE);

-- =============================================
-- INSERT SAMPLE STUDENTS
-- =============================================
INSERT INTO students (user_id, student_id, first_name, last_name, date_of_birth, gender, admission_date, admission_number, emergency_contact_name, emergency_contact_phone, is_active) VALUES
(8, 'STU001', 'Dawit', 'Kebede', '2015-03-15', 'Male', '2023-09-01', 'ADM2023001', 'Kebede Worku', '+251-94-456-7890', TRUE),
(9, 'STU002', 'Meron', 'Selam', '2015-07-22', 'Female', '2023-09-01', 'ADM2023002', 'Selam Tesfaye', '+251-95-567-8901', TRUE),
(10, 'STU003', 'Yonas', 'Abebe', '2015-11-08', 'Male', '2023-09-01', 'ADM2023003', 'Abebe Kebede', '+251-96-678-9012', TRUE);

-- =============================================
-- INSERT STUDENT-PARENT RELATIONSHIPS
-- =============================================
INSERT INTO student_parents (student_id, parent_id, relationship, is_primary) VALUES
(1, 1, 'Father', TRUE),
(2, 2, 'Mother', TRUE),
(3, 3, 'Father', TRUE);

-- =============================================
-- INSERT STUDENT-SECTION ENROLLMENTS
-- =============================================
INSERT INTO student_sections (student_id, section_id, academic_year_id, enrollment_date, status) VALUES
(1, 1, 1, '2023-09-01', 'Active'), -- Dawit in Grade 1A
(2, 1, 1, '2023-09-01', 'Active'), -- Meron in Grade 1A
(3, 2, 1, '2023-09-01', 'Active'); -- Yonas in Grade 1B

-- =============================================
-- INSERT TEACHER-SUBJECT ASSIGNMENTS
-- =============================================
INSERT INTO teacher_subjects (teacher_id, subject_id, grade_id, academic_year_id) VALUES
(1, 2, 1, 1), -- Alemayehu teaches Math to Grade 1
(1, 2, 2, 1), -- Alemayehu teaches Math to Grade 2
(2, 1, 1, 1), -- Meron teaches English to Grade 1
(2, 1, 2, 1), -- Meron teaches English to Grade 2
(3, 3, 1, 1), -- Tewodros teaches Science to Grade 1
(3, 3, 2, 1); -- Tewodros teaches Science to Grade 2

-- =============================================
-- INSERT TEACHER-SECTION ASSIGNMENTS
-- =============================================
INSERT INTO teacher_sections (teacher_id, section_id, academic_year_id, is_class_teacher) VALUES
(1, 1, 1, TRUE), -- Alemayehu is class teacher for Grade 1A
(2, 2, 1, TRUE); -- Meron is class teacher for Grade 1B

-- =============================================
-- INSERT FEE STRUCTURES
-- =============================================
INSERT INTO fee_structures (grade_id, academic_year_id, term_id, fee_type, amount, due_date, is_mandatory, description) VALUES
-- Grade 1 fees for current term
(1, 1, 3, 'Tuition', 2000.00, '2024-04-22', TRUE, 'Third term tuition fee'),
(1, 1, 3, 'Transport', 500.00, '2024-04-22', FALSE, 'Transportation fee'),
(1, 1, 3, 'Library', 100.00, '2024-04-22', FALSE, 'Library fee'),
-- Grade 2 fees for current term
(2, 1, 3, 'Tuition', 2000.00, '2024-04-22', TRUE, 'Third term tuition fee'),
(2, 1, 3, 'Transport', 500.00, '2024-04-22', FALSE, 'Transportation fee'),
(2, 1, 3, 'Library', 100.00, '2024-04-22', FALSE, 'Library fee');

-- =============================================
-- INSERT SAMPLE EXAMINATIONS
-- =============================================
INSERT INTO examinations (exam_type_id, subject_id, grade_id, section_id, academic_year_id, term_id, title, exam_date, total_marks, passing_marks, created_by) VALUES
(1, 2, 1, 1, 1, 3, 'Math Quiz - Addition', '2024-05-15', 20.00, 10.00, 1),
(2, 1, 1, 1, 1, 3, 'English Assignment - Reading', '2024-05-20', 25.00, 12.50, 2),
(3, 3, 1, 1, 1, 3, 'Science Mid-term Exam', '2024-06-10', 50.00, 25.00, 3);

-- =============================================
-- INSERT SAMPLE ATTENDANCE RECORDS
-- =============================================
INSERT INTO attendance (student_id, section_id, date, status, marked_by) VALUES
(1, 1, '2024-04-22', 'Present', 1),
(2, 1, '2024-04-22', 'Present', 1),
(3, 2, '2024-04-22', 'Present', 2),
(1, 1, '2024-04-23', 'Present', 1),
(2, 1, '2024-04-23', 'Late', 1),
(3, 2, '2024-04-23', 'Present', 2);

-- =============================================
-- INSERT SAMPLE PAYMENTS
-- =============================================
INSERT INTO payments (student_id, fee_structure_id, amount, payment_date, payment_method, reference_number, receipt_number, status, received_by) VALUES
(1, 1, 2000.00, '2024-04-22', 'Cash', 'CASH001', 'RCP-2024-04-22-000001', 'Paid', 1),
(2, 1, 2000.00, '2024-04-22', 'Bank Transfer', 'BT001', 'RCP-2024-04-22-000002', 'Paid', 1),
(3, 4, 2000.00, '2024-04-23', 'Mobile Money', 'MM001', 'RCP-2024-04-23-000001', 'Paid', 1);

-- =============================================
-- INSERT SAMPLE EXAM RESULTS
-- =============================================
INSERT INTO exam_results (examination_id, student_id, marks_obtained, grade) VALUES
(1, 1, 18.00, 'A'),
(1, 2, 15.00, 'B+'),
(2, 1, 22.00, 'A'),
(2, 2, 20.00, 'A-'),
(3, 1, 45.00, 'A'),
(3, 2, 38.00, 'B+');

-- =============================================
-- UPDATE ACADEMIC YEAR AND TERM STATUS
-- =============================================
-- Set only one academic year as current
UPDATE academic_years SET is_current = FALSE WHERE id != 1;
UPDATE academic_years SET is_current = TRUE WHERE id = 1;

-- Set only one term as current
UPDATE terms SET is_current = FALSE WHERE id != 3;
UPDATE terms SET is_current = TRUE WHERE id = 3;
