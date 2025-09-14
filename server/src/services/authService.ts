import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { executeQuery, executeTransaction } from '@/config/database';
import { 
  User, 
  Role, 
  Student, 
  Teacher, 
  Parent, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  JWTPayload 
} from '@/types';
import { CustomError } from '@/middlewares/errorHandler';

export class AuthService {
  // Generate JWT token
  private generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  // Generate refresh token
  private generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.security.bcryptRounds);
  }

  // Compare password
  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Get user role name
  private async getUserRole(roleId: number): Promise<string> {
    const roles = await executeQuery<Role[]>(
      'SELECT name FROM roles WHERE id = ?',
      [roleId]
    );
    
    if (roles.length === 0) {
      throw new CustomError('Role not found', 404);
    }
    
    return roles[0].name;
  }

  // Get user profile based on role
  private async getUserProfileByRole(userId: number, role: string): Promise<Student | Teacher | Parent | null> {
    let profile: Student | Teacher | Parent | null = null;
    
    switch (role) {
      case 'Student':
        const students = await executeQuery<Student[]>(
          'SELECT * FROM students WHERE user_id = ?',
          [userId]
        );
        profile = students.length > 0 ? students[0] : null;
        break;
        
      case 'Teacher':
        const teachers = await executeQuery<Teacher[]>(
          'SELECT * FROM teachers WHERE user_id = ?',
          [userId]
        );
        profile = teachers.length > 0 ? teachers[0] : null;
        break;
        
      case 'Parent':
        const parents = await executeQuery<Parent[]>(
          'SELECT * FROM parents WHERE user_id = ?',
          [userId]
        );
        profile = parents.length > 0 ? parents[0] : null;
        break;
    }
    
    return profile;
  }

  // Login user
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginData;
    
    // Get user with role
    const users = await executeQuery<User[]>(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? AND u.is_active = TRUE`,
      [email]
    );
    
    if (users.length === 0) {
      throw new CustomError('Invalid email or password', 401);
    }
    
    const user = users[0];
    const role = (user as any).role_name;
    
    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }
    
    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    
    // Get user profile
    const profile = await this.getUserProfileByRole(user.id, role);
    
    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: role,
    };
    
    const token = this.generateToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);
    
    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: role,
        profile: profile || undefined,
      },
    };
  }

  // Register new user
  async register(registerData: RegisterRequest): Promise<LoginResponse> {
    const { email, password, role, profile } = registerData;
    
    // Check if user already exists
    const existingUsers = await executeQuery<User[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      throw new CustomError('User with this email already exists', 409);
    }
    
    // Get role ID
    const roles = await executeQuery<Role[]>(
      'SELECT id FROM roles WHERE name = ?',
      [role]
    );
    
    if (roles.length === 0) {
      throw new CustomError('Invalid role', 400);
    }
    
    const roleId = roles[0].id;
    
    // Hash password
    const hashedPassword = await this.hashPassword(password);
    
    // Start transaction
    const results = await executeTransaction([
      // Create user
      {
        query: 'INSERT INTO users (email, password, role_id, is_active) VALUES (?, ?, ?, ?)',
        params: [email, hashedPassword, roleId, true],
      },
    ]);
    
    const userId = (results[0] as any).insertId;
    
    // Create profile based on role
    let profileId: number;
    
    switch (role) {
      case 'Student':
        if (!profile || !('admission_number' in profile)) {
          throw new CustomError('Student profile data is required', 400);
        }
        
        const studentResult = await executeQuery(
          `INSERT INTO students (
            user_id, student_id, first_name, last_name, middle_name, 
            phone, address, date_of_birth, gender, admission_date, 
            admission_number, previous_school, medical_info, 
            emergency_contact_name, emergency_contact_phone, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            profile.admission_number, // Use admission_number as student_id
            profile.first_name,
            profile.last_name,
            profile.middle_name || null,
            profile.phone || null,
            profile.address || null,
            profile.date_of_birth,
            profile.gender,
            profile.admission_date,
            profile.admission_number,
            profile.previous_school || null,
            profile.medical_info || null,
            profile.emergency_contact_name || null,
            profile.emergency_contact_phone || null,
            true,
          ]
        );
        
        profileId = (studentResult as any).insertId;
        break;
        
      case 'Teacher':
        if (!profile || !('employee_id' in profile)) {
          throw new CustomError('Teacher profile data is required', 400);
        }
        
        const teacherResult = await executeQuery(
          `INSERT INTO teachers (
            user_id, employee_id, first_name, last_name, middle_name, 
            phone, address, date_of_birth, gender, qualification, 
            specialization, hire_date, salary, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            profile.employee_id,
            profile.first_name,
            profile.last_name,
            profile.middle_name || null,
            profile.phone || null,
            profile.address || null,
            profile.date_of_birth || null,
            profile.gender,
            profile.qualification || null,
            profile.specialization || null,
            profile.hire_date,
            profile.salary || null,
            true,
          ]
        );
        
        profileId = (teacherResult as any).insertId;
        break;
        
      case 'Parent':
        if (!profile || !('phone' in profile)) {
          throw new CustomError('Parent profile data is required', 400);
        }
        
        const parentProfile = profile as Parent;
        const parentResult = await executeQuery(
          `INSERT INTO parents (
            user_id, first_name, last_name, middle_name, phone, 
            email, address, occupation, relationship, is_primary
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            parentProfile.first_name,
            parentProfile.last_name,
            parentProfile.middle_name || null,
            parentProfile.phone,
            parentProfile.email || null,
            parentProfile.address || null,
            parentProfile.occupation || null,
            parentProfile.relationship || 'Other', // Default relationship
            parentProfile.is_primary || false,
          ]
        );
        
        profileId = (parentResult as any).insertId;
        break;
        
      default:
        throw new CustomError('Invalid role for registration', 400);
    }
    
    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: userId,
      email: email,
      role: role,
    };
    
    const token = this.generateToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);
    
    return {
      token,
      refreshToken,
      user: {
        id: userId,
        email: email,
        role: role,
        profile: profile as any,
      },
    };
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;
      
      // Verify user still exists and is active
      const users = await executeQuery<User[]>(
        'SELECT id FROM users WHERE id = ? AND is_active = TRUE',
        [decoded.userId]
      );
      
      if (users.length === 0) {
        throw new CustomError('User not found or inactive', 401);
      }
      
      // Generate new tokens
      const tokenPayload: JWTPayload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
      
      const newToken = this.generateToken(tokenPayload);
      const newRefreshToken = this.generateRefreshToken(tokenPayload);
      
      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError('Invalid refresh token', 401);
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new CustomError('Refresh token expired', 401);
      }
      throw error;
    }
  }

  // Change password
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    // Get current user
    const users = await executeQuery<User[]>(
      'SELECT password FROM users WHERE id = ? AND is_active = TRUE',
      [userId]
    );
    
    if (users.length === 0) {
      throw new CustomError('User not found', 404);
    }
    
    const user = users[0];
    
    // Verify current password
    const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new CustomError('Current password is incorrect', 400);
    }
    
    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);
    
    // Update password
    await executeQuery(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedNewPassword, userId]
    );
  }

  // Get user profile
  async getUserProfile(userId: number): Promise<{ user: User; profile: Student | Teacher | Parent | null }> {
    // Get user with role
    const users = await executeQuery<User[]>(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ? AND u.is_active = TRUE`,
      [userId]
    );
    
    if (users.length === 0) {
      throw new CustomError('User not found', 404);
    }
    
    const user = users[0];
    const role = (user as any).role_name;
    
    // Get user profile
    const profile = await this.getUserProfileByRole(user.id, role);
    
    return { user, profile };
  }

  // Logout (in a real app, you might want to blacklist the token)
  async logout(userId: number): Promise<void> {
    // For now, we'll just update the last login time
    // In a production app, you might want to implement token blacklisting
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [userId]
    );
  }
}
