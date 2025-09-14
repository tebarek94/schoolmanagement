import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { authService } from '../../services/authService';
import { RegisterRequest } from '../../types';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, MapPin, Calendar, GraduationCap, Briefcase, Users } from 'lucide-react';
import { getRoleBasedRedirect } from '../../utils/authUtils';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  address?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  // Student specific fields
  admissionNumber?: string;
  previousSchool?: string;
  medicalInfo?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  // Teacher specific fields
  employeeId?: string;
  qualification?: string;
  specialization?: string;
  experience?: string;
  salary?: string;
  // Parent specific fields
  occupation?: string;
  workplace?: string;
  relationship?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { user, isAuthenticated } = useAuth();

  // Handle redirect when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRoleBasedRedirect(user);
      console.log('User authenticated after registration, redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'parent', label: 'Parent' },
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare profile data based on role
      let profileData: any = {
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName,
        phone: data.phone,
        address: data.address,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
      };

      // Add role-specific fields
      if (data.role === 'student') {
        profileData = {
          ...profileData,
          admission_number: data.admissionNumber,
          previous_school: data.previousSchool,
          medical_info: data.medicalInfo,
          emergency_contact_name: data.emergencyContactName,
          emergency_contact_phone: data.emergencyContactPhone,
          admission_date: new Date().toISOString().split('T')[0],
        };
      } else if (data.role === 'teacher') {
        profileData = {
          ...profileData,
          employee_id: data.employeeId,
          qualification: data.qualification,
          specialization: data.specialization,
          experience: data.experience,
          salary: data.salary ? parseFloat(data.salary) : undefined,
          hire_date: new Date().toISOString().split('T')[0],
        };
      } else if (data.role === 'parent') {
        profileData = {
          ...profileData,
          occupation: data.occupation,
          workplace: data.workplace,
          relationship: data.relationship || 'Other',
        };
      }

      const registerData: RegisterRequest = {
        email: data.email,
        password: data.password,
        role: data.role.charAt(0).toUpperCase() + data.role.slice(1), // Capitalize first letter
        profile: profileData,
      };

      await authService.register(registerData);
      
      toast.success('Registration successful! Welcome to the School Management System.');
      // Redirect will be handled by useEffect when user state updates
      console.log('Registration successful, redirect will be handled by useEffect');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.status === 409) {
        toast.error('User with this email already exists. Please login instead.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the School Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>
              Please fill in all the required information to create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="Enter your email"
                    leftIcon={<Mail className="h-4 w-4" />}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    error={errors.email?.message}
                  />

                  <Select
                    label="Role *"
                    placeholder="Select your role"
                    options={roleOptions}
                    {...register('role', { required: 'Role is required' })}
                    error={errors.role?.message}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Password *"
                    type="password"
                    placeholder="Create a password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    error={errors.password?.message}
                  />

                  <Input
                    label="Confirm Password *"
                    type="password"
                    placeholder="Confirm your password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    error={errors.confirmPassword?.message}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="First Name *"
                    placeholder="Enter first name"
                    {...register('firstName', { required: 'First name is required' })}
                    error={errors.firstName?.message}
                  />

                  <Input
                    label="Middle Name"
                    placeholder="Enter middle name"
                    {...register('middleName')}
                  />

                  <Input
                    label="Last Name *"
                    placeholder="Enter last name"
                    {...register('lastName', { required: 'Last name is required' })}
                    error={errors.lastName?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    leftIcon={<Phone className="h-4 w-4" />}
                    {...register('phone')}
                  />

                  <Input
                    label="Date of Birth *"
                    type="date"
                    leftIcon={<Calendar className="h-4 w-4" />}
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                    error={errors.dateOfBirth?.message}
                  />

                  <Select
                    label="Gender *"
                    placeholder="Select gender"
                    options={genderOptions}
                    {...register('gender', { required: 'Gender is required' })}
                    error={errors.gender?.message}
                  />
                </div>

                <Input
                  label="Address"
                  placeholder="Enter your address"
                  leftIcon={<MapPin className="h-4 w-4" />}
                  {...register('address')}
                />
              </div>

              {/* Role-specific Information */}
              {selectedRole === 'student' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Student Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Admission Number *"
                      placeholder="Enter admission number"
                      {...register('admissionNumber', { required: 'Admission number is required' })}
                      error={errors.admissionNumber?.message}
                    />

                    <Input
                      label="Previous School"
                      placeholder="Enter previous school"
                      {...register('previousSchool')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Emergency Contact Name"
                      placeholder="Enter emergency contact name"
                      {...register('emergencyContactName')}
                    />

                    <Input
                      label="Emergency Contact Phone"
                      type="tel"
                      placeholder="Enter emergency contact phone"
                      {...register('emergencyContactPhone')}
                    />
                  </div>

                  <Input
                    label="Medical Information"
                    placeholder="Enter any medical information"
                    {...register('medicalInfo')}
                  />
                </div>
              )}

              {selectedRole === 'teacher' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Teacher Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Employee ID *"
                      placeholder="Enter employee ID"
                      {...register('employeeId', { required: 'Employee ID is required' })}
                      error={errors.employeeId?.message}
                    />

                    <Input
                      label="Qualification"
                      placeholder="Enter qualification"
                      {...register('qualification')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Specialization"
                      placeholder="Enter specialization"
                      {...register('specialization')}
                    />

                    <Input
                      label="Experience (years)"
                      type="number"
                      placeholder="Enter years of experience"
                      {...register('experience')}
                    />
                  </div>

                  <Input
                    label="Salary"
                    type="number"
                    placeholder="Enter salary"
                    {...register('salary')}
                  />
                </div>
              )}

              {selectedRole === 'parent' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Parent Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Occupation"
                      placeholder="Enter occupation"
                      {...register('occupation')}
                    />

                    <Input
                      label="Workplace"
                      placeholder="Enter workplace"
                      {...register('workplace')}
                    />
                  </div>

                  <Select
                    label="Relationship *"
                    placeholder="Select relationship"
                    options={[
                      { value: 'Father', label: 'Father' },
                      { value: 'Mother', label: 'Mother' },
                      { value: 'Guardian', label: 'Guardian' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    {...register('relationship', { required: 'Relationship is required' })}
                    error={errors.relationship?.message}
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <Link
                  to="/login"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Already have an account? Sign in
                </Link>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-8"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;



