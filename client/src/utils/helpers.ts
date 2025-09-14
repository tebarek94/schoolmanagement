import { clsx, type ClassValue } from 'clsx';

// Utility function for conditional class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format date to readable string
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

// Format date to short string (MM/DD/YYYY)
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

// Format time to readable string
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Calculate age from date of birth
export function calculateAge(dateOfBirth: string | Date): number {
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (Ethiopian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+251|0)?[79][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate student ID format
export function isValidStudentId(studentId: string): boolean {
  const studentIdRegex = /^[A-Z]{2,3}[0-9]{4,6}$/;
  return studentIdRegex.test(studentId);
}

// Validate employee ID format
export function isValidEmployeeId(employeeId: string): boolean {
  const employeeIdRegex = /^[A-Z]{2,3}[0-9]{4,6}$/;
  return employeeIdRegex.test(employeeId);
}

// Capitalize first letter of each word
export function capitalizeWords(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Get full name
export function getFullName(firstName: string, lastName: string, middleName?: string): string {
  return middleName 
    ? `${firstName} ${middleName} ${lastName}`
    : `${firstName} ${lastName}`;
}

// Convert file size to readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Check if file is image
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
}

// Check if file is PDF
export function isPdfFile(filename: string): boolean {
  return getFileExtension(filename).toLowerCase() === 'pdf';
}

// Generate random color
export function generateRandomColor(): string {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Get status color
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'Active': 'text-green-600 bg-green-100',
    'Inactive': 'text-red-600 bg-red-100',
    'Present': 'text-green-600 bg-green-100',
    'Absent': 'text-red-600 bg-red-100',
    'Late': 'text-yellow-600 bg-yellow-100',
    'Excused': 'text-blue-600 bg-blue-100',
    'Paid': 'text-green-600 bg-green-100',
    'Pending': 'text-yellow-600 bg-yellow-100',
    'Overdue': 'text-red-600 bg-red-100',
    'Partial': 'text-orange-600 bg-orange-100',
  };
  
  return statusColors[status] || 'text-gray-600 bg-gray-100';
}

// Get grade color
export function getGradeColor(grade: string): string {
  const gradeColors: Record<string, string> = {
    'A+': 'text-green-600 bg-green-100',
    'A': 'text-green-600 bg-green-100',
    'B+': 'text-blue-600 bg-blue-100',
    'B': 'text-blue-600 bg-blue-100',
    'C+': 'text-yellow-600 bg-yellow-100',
    'C': 'text-yellow-600 bg-yellow-100',
    'D': 'text-orange-600 bg-orange-100',
    'F': 'text-red-600 bg-red-100',
  };
  
  return gradeColors[grade] || 'text-gray-600 bg-gray-100';
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Check if date is today
export function isToday(date: string | Date): boolean {
  const today = new Date();
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  
  return checkDate.toDateString() === today.toDateString();
}

// Check if date is in the past
export function isPastDate(date: string | Date): boolean {
  const today = new Date();
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  
  return checkDate < today;
}

// Check if date is in the future
export function isFutureDate(date: string | Date): boolean {
  const today = new Date();
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  
  return checkDate > today;
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

// Download file from URL
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

// Generate QR code data URL
export function generateQRCodeDataURL(text: string): string {
  // This is a placeholder - you would typically use a QR code library
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
}

// Parse CSV data
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  return lines.map(line => line.split(',').map(cell => cell.trim()));
}

// Convert array to CSV
export function arrayToCSV(data: any[][]): string {
  return data.map(row => row.join(',')).join('\n');
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}




