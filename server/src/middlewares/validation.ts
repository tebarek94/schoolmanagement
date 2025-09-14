import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from '@/types';

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const validationErrors: ValidationError[] = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined,
    }));
    
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors,
    });
    return;
  }
  
  next();
};

// Common validation rules
export const commonValidations = {
  // Email validation
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  // Password validation
  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  // Name validation
  firstName: body('first_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  
  lastName: body('last_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  
  // Phone validation
  phone: body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  // Date validation
  date: (field: string) => body(field)
    .isISO8601()
    .withMessage(`Please provide a valid date for ${field}`),
  
  // Gender validation
  gender: body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  
  // ID validation
  id: param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
};

// Authentication validations
export const authValidations = {
  login: [
    commonValidations.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors,
  ],
  
  register: [
    commonValidations.email,
    commonValidations.password,
    body('role')
      .isIn(['Admin', 'Teacher', 'Parent', 'Student'])
      .withMessage('Role must be Admin, Teacher, Parent, or Student'),
    body('profile')
      .isObject()
      .withMessage('Profile data is required'),
    handleValidationErrors,
  ],
  
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match');
        }
        return true;
      }),
    handleValidationErrors,
  ],
};

// Student validations
export const studentValidations = {
  create: [
    commonValidations.email,
    commonValidations.password,
    body('student_id')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Student ID must be between 3 and 20 characters'),
    commonValidations.firstName,
    commonValidations.lastName,
    body('middle_name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Middle name must not exceed 100 characters'),
    commonValidations.phone,
    commonValidations.date('date_of_birth'),
    commonValidations.gender,
    commonValidations.date('admission_date'),
    body('admission_number')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('Admission number must be between 5 and 50 characters'),
    body('previous_school')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Previous school must not exceed 200 characters'),
    body('emergency_contact_name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Emergency contact name must not exceed 100 characters'),
    body('emergency_contact_phone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Please provide a valid emergency contact phone number'),
    handleValidationErrors,
  ],
  
  update: [
    commonValidations.id,
    body('first_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('First name must be between 2 and 100 characters'),
    body('last_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Last name must be between 2 and 100 characters'),
    body('middle_name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Middle name must not exceed 100 characters'),
    commonValidations.phone,
    body('date_of_birth')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid date of birth'),
    body('gender')
      .optional()
      .isIn(['Male', 'Female', 'Other'])
      .withMessage('Gender must be Male, Female, or Other'),
    handleValidationErrors,
  ],
};

// Teacher validations
export const teacherValidations = {
  create: [
    commonValidations.email,
    commonValidations.password,
    body('employee_id')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Employee ID must be between 3 and 20 characters'),
    commonValidations.firstName,
    commonValidations.lastName,
    body('middle_name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Middle name must not exceed 100 characters'),
    commonValidations.phone,
    body('date_of_birth')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid date of birth'),
    commonValidations.gender,
    body('qualification')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Qualification must not exceed 200 characters'),
    body('specialization')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Specialization must not exceed 200 characters'),
    commonValidations.date('hire_date'),
    body('salary')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Salary must be a positive number'),
    handleValidationErrors,
  ],
  
  update: [
    commonValidations.id,
    body('first_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('First name must be between 2 and 100 characters'),
    body('last_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Last name must be between 2 and 100 characters'),
    body('middle_name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Middle name must not exceed 100 characters'),
    commonValidations.phone,
    body('qualification')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Qualification must not exceed 200 characters'),
    body('specialization')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Specialization must not exceed 200 characters'),
    body('salary')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Salary must be a positive number'),
    handleValidationErrors,
  ],
};

// Parent validations
export const parentValidations = {
  create: [
    commonValidations.email,
    commonValidations.password,
    commonValidations.firstName,
    commonValidations.lastName,
    body('middle_name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Middle name must not exceed 100 characters'),
    body('phone')
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('occupation')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Occupation must not exceed 100 characters'),
    body('relationship')
      .isIn(['Father', 'Mother', 'Guardian', 'Other'])
      .withMessage('Relationship must be Father, Mother, Guardian, or Other'),
    handleValidationErrors,
  ],
  
  update: [
    commonValidations.id,
    body('first_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('First name must be between 2 and 100 characters'),
    body('last_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Last name must be between 2 and 100 characters'),
    body('middle_name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Middle name must not exceed 100 characters'),
    body('phone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('occupation')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Occupation must not exceed 100 characters'),
    handleValidationErrors,
  ],
};

// Attendance validations
export const attendanceValidations = {
  mark: [
    body('student_id')
      .isInt({ min: 1 })
      .withMessage('Student ID must be a positive integer'),
    body('section_id')
      .isInt({ min: 1 })
      .withMessage('Section ID must be a positive integer'),
    body('date')
      .isISO8601()
      .withMessage('Please provide a valid date'),
    body('status')
      .isIn(['Present', 'Absent', 'Late', 'Excused'])
      .withMessage('Status must be Present, Absent, Late, or Excused'),
    body('remarks')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Remarks must not exceed 500 characters'),
    handleValidationErrors,
  ],
};

// Exam validations
export const examValidations = {
  create: [
    body('exam_type_id')
      .isInt({ min: 1 })
      .withMessage('Exam type ID must be a positive integer'),
    body('subject_id')
      .isInt({ min: 1 })
      .withMessage('Subject ID must be a positive integer'),
    body('grade_id')
      .isInt({ min: 1 })
      .withMessage('Grade ID must be a positive integer'),
    body('section_id')
      .isInt({ min: 1 })
      .withMessage('Section ID must be a positive integer'),
    body('academic_year_id')
      .isInt({ min: 1 })
      .withMessage('Academic year ID must be a positive integer'),
    body('term_id')
      .isInt({ min: 1 })
      .withMessage('Term ID must be a positive integer'),
    body('title')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('exam_date')
      .isISO8601()
      .withMessage('Please provide a valid exam date'),
    body('start_time')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Please provide a valid start time (HH:MM)'),
    body('end_time')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Please provide a valid end time (HH:MM)'),
    body('total_marks')
      .isFloat({ min: 1 })
      .withMessage('Total marks must be a positive number'),
    body('passing_marks')
      .isFloat({ min: 0 })
      .withMessage('Passing marks must be a non-negative number'),
    handleValidationErrors,
  ],
  
  result: [
    body('examination_id')
      .isInt({ min: 1 })
      .withMessage('Examination ID must be a positive integer'),
    body('student_id')
      .isInt({ min: 1 })
      .withMessage('Student ID must be a positive integer'),
    body('marks_obtained')
      .isFloat({ min: 0 })
      .withMessage('Marks obtained must be a non-negative number'),
    body('grade')
      .optional()
      .isIn(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'])
      .withMessage('Grade must be a valid grade'),
    body('remarks')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Remarks must not exceed 500 characters'),
    handleValidationErrors,
  ],
};

// Payment validations
export const paymentValidations = {
  create: [
    body('student_id')
      .isInt({ min: 1 })
      .withMessage('Student ID must be a positive integer'),
    body('fee_structure_id')
      .isInt({ min: 1 })
      .withMessage('Fee structure ID must be a positive integer'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a positive number'),
    body('payment_date')
      .isISO8601()
      .withMessage('Please provide a valid payment date'),
    body('payment_method')
      .isIn(['Cash', 'Bank Transfer', 'Check', 'Mobile Money', 'Other'])
      .withMessage('Payment method must be Cash, Bank Transfer, Check, Mobile Money, or Other'),
    body('reference_number')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Reference number must not exceed 100 characters'),
    body('remarks')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Remarks must not exceed 500 characters'),
    handleValidationErrors,
  ],
};
