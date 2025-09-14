import { User } from '../types';

/**
 * Get role-based redirect path after login/registration
 * @param user - The logged-in user object
 * @returns The appropriate redirect path based on user role
 */
export const getRoleBasedRedirect = (user: User): string => {
  // Safety check for user object
  if (!user || !user.role) {
    console.warn('User object is incomplete:', user);
    return '/dashboard';
  }

  switch (user.role) {
    case 'Admin':
      return '/dashboard'; // Admin dashboard with full system access
    case 'Teacher':
      return '/dashboard'; // Teacher dashboard with teaching features
    case 'Student':
      return '/dashboard'; // Student dashboard with grades and courses
    case 'Parent':
      return '/dashboard'; // Parent dashboard with child's progress
    default:
      return '/dashboard';
  }
};

/**
 * Get role-specific welcome message
 * @param user - The logged-in user object
 * @returns A personalized welcome message
 */
export const getRoleWelcomeMessage = (user: User): string => {
  // Safety check for user object
  if (!user) {
    console.warn('User object is undefined in getRoleWelcomeMessage');
    return 'Welcome to the School Management System!';
  }

  // Get the first name from profile, handling different profile structures
  const getFirstName = (): string => {
    if (user.profile) {
      // Check if profile has first_name property
      if ('first_name' in user.profile && user.profile.first_name) {
        return user.profile.first_name as string;
      }
      // Check if profile has firstName property (camelCase)
      if ('firstName' in user.profile && user.profile.firstName) {
        return user.profile.firstName as string;
      }
    }
    return '';
  };

      const firstName = getFirstName();

      switch (user.role) {
    case 'Admin':
      return firstName ? `Welcome, ${firstName}! You have full access to the system.` : 'Welcome, Admin! You have full access to the system.';
    case 'Teacher':
      return firstName ? `Welcome, ${firstName}! Ready to manage your classes?` : 'Welcome, Teacher! Ready to manage your classes?';
    case 'Student':
      return firstName ? `Welcome, ${firstName}! Check out your profile and grades.` : 'Welcome, Student! Check out your profile and grades.';
    case 'Parent':
      return firstName ? `Welcome, ${firstName}! Stay updated on your child's progress.` : "Welcome, Parent! Stay updated on your child's progress.";
    default:
      return firstName ? `Welcome, ${firstName}!` : 'Welcome to the School Management System!';
  }
};

/**
 * Check if user has permission to access a specific route
 * @param userRole - The user's role
 * @param allowedRoles - Array of roles allowed to access the route
 * @returns True if user has permission
 */
export const hasPermission = (userRole: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(userRole.toLowerCase());
};
