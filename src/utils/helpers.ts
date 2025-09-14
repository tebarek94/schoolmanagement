import moment from 'moment';

// Date formatting utilities
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  return moment(date).format(format);
};

export const parseDate = (dateString: string): Date => {
  return moment(dateString).toDate();
};

export const isValidDate = (dateString: string): boolean => {
  return moment(dateString).isValid();
};

// String utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const generateRandomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateStudentId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `STU${year}${random}`;
};

export const generateEmployeeId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `EMP${year}${random}`;
};

export const generateAdmissionNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ADM${year}${random}`;
};

export const generateReceiptNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `RCP-${year}-${month}-${day}-${random}`;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidPassword = (password: string): boolean => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

// Number utilities
export const formatCurrency = (amount: number, currency: string = 'ETB'): string => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-ET').format(num);
};

export const roundToTwoDecimals = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

// Array utilities
export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'ASC' | 'DESC' = 'ASC'): T[] => {
  return array.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'ASC' ? -1 : 1;
    if (aVal > bVal) return order === 'ASC' ? 1 : -1;
    return 0;
  });
};

// Pagination utilities
export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    offset,
    hasNextPage,
    hasPrevPage,
  };
};

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isValidImageFile = (filename: string): boolean => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = getFileExtension(filename);
  return validExtensions.includes(extension);
};

export const isValidDocumentFile = (filename: string): boolean => {
  const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
  const extension = getFileExtension(filename);
  return validExtensions.includes(extension);
};

// Grade calculation utilities
export const calculateGrade = (marks: number, totalMarks: number): string => {
  const percentage = (marks / totalMarks) * 100;
  
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 30) return 'D';
  return 'F';
};

export const getGradePoints = (grade: string): number => {
  const gradePoints: Record<string, number> = {
    'A+': 4.0,
    'A': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'C+': 2.7,
    'C': 2.3,
    'D': 2.0,
    'F': 0.0,
  };
  
  return gradePoints[grade] || 0.0;
};

// Attendance utilities
export const calculateAttendancePercentage = (presentDays: number, totalDays: number): number => {
  if (totalDays === 0) return 0;
  return roundToTwoDecimals((presentDays / totalDays) * 100);
};

export const getAttendanceStatus = (percentage: number): string => {
  if (percentage >= 75) return 'Good';
  if (percentage >= 50) return 'Average';
  return 'Poor';
};

// Academic year utilities
export const getCurrentAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  // If it's before September, it's still the previous academic year
  if (month < 9) {
    return `${year - 1}-${year}`;
  }
  
  return `${year}-${year + 1}`;
};

export const getCurrentTerm = (): string => {
  const now = new Date();
  const month = now.getMonth() + 1;
  
  if (month >= 9 && month <= 12) return 'First Term';
  if (month >= 1 && month <= 4) return 'Second Term';
  if (month >= 5 && month <= 8) return 'Third Term';
  
  return 'First Term'; // Default
};

// Age calculation
export const calculateAge = (birthDate: Date | string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Sanitization utilities
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = {} as T;
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      (sanitized as any)[key] = sanitizeString(obj[key]);
    } else {
      (sanitized as any)[key] = obj[key];
    }
  }
  
  return sanitized;
};
