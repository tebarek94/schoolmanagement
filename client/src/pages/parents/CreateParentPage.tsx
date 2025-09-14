import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Users, Phone, Mail, MapPin, Briefcase, Heart, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { parentService } from '../../services/parentService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { CreateParentRequest } from '../../types';

interface ParentFormData {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  is_primary: boolean;
}

export const CreateParentPage: React.FC = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ParentFormData>({
    defaultValues: {
      relationship: 'Father',
      is_primary: true
    }
  });

  const onSubmit = async (data: ParentFormData) => {
    if (!hasRole('admin')) {
      toast.error('You do not have permission to create parents');
      return;
    }

    setIsLoading(true);

    try {
      const parentData: CreateParentRequest = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        middle_name: data.middle_name.trim() || undefined,
        phone: data.phone.trim(),
        email: data.email.trim(),
        password: 'temp_password_123', // Temporary password, should be changed
        address: data.address.trim() || undefined,
        occupation: data.occupation.trim() || undefined,
        relationship: data.relationship
      };

      await parentService.createParent(parentData);
      
      toast.success('Parent created successfully!');
      navigate('/parents');
    } catch (error: any) {
      console.error('Failed to create parent:', error);
      toast.error(error.response?.data?.message || 'Failed to create parent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/parents');
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'Father':
        return <UserCheck className="w-5 h-5 text-blue-500" />;
      case 'Mother':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'Guardian':
        return <Shield className="w-5 h-5 text-green-500" />;
      default:
        return <Users className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
      <h1 className="text-3xl font-bold text-gray-900">Add New Parent</h1>
            <p className="text-gray-600 mt-2">Create a new parent profile</p>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
      <Card>
        <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Parent Information
              </CardTitle>
        </CardHeader>
        <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        placeholder="Enter first name"
                        {...register('first_name', { 
                          required: 'First name is required',
                          minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters'
                          },
                          maxLength: {
                            value: 50,
                            message: 'First name must not exceed 50 characters'
                          }
                        })}
                        error={errors.first_name?.message}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Middle Name
                      </label>
                      <Input
                        placeholder="Enter middle name"
                        {...register('middle_name', {
                          maxLength: {
                            value: 50,
                            message: 'Middle name must not exceed 50 characters'
                          }
                        })}
                        error={errors.middle_name?.message}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        placeholder="Enter last name"
                        {...register('last_name', { 
                          required: 'Last name is required',
                          minLength: {
                            value: 2,
                            message: 'Last name must be at least 2 characters'
                          },
                          maxLength: {
                            value: 50,
                            message: 'Last name must not exceed 50 characters'
                          }
                        })}
                        error={errors.last_name?.message}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Enter phone number"
                          className="pl-10"
                          {...register('phone', { 
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[\+]?[1-9][\d]{0,15}$/,
                              message: 'Please enter a valid phone number'
                            }
                          })}
                          error={errors.phone?.message}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          className="pl-10"
                          {...register('email', {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Please enter a valid email address'
                            }
                          })}
                          error={errors.email?.message}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <textarea
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        placeholder="Enter full address..."
                        {...register('address', {
                          maxLength: {
                            value: 200,
                            message: 'Address must not exceed 200 characters'
                          }
                        })}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Enter occupation"
                          className="pl-10"
                          {...register('occupation', {
                            maxLength: {
                              value: 100,
                              message: 'Occupation must not exceed 100 characters'
                            }
                          })}
                          error={errors.occupation?.message}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <Select
                        value={watch('relationship')}
                        onChange={(e) => setValue('relationship', e.target.value as any)}
                        options={[
                          { value: 'Father', label: 'Father' },
                          { value: 'Mother', label: 'Mother' },
                          { value: 'Guardian', label: 'Guardian' },
                          { value: 'Other', label: 'Other' }
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Status
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="true"
                          checked={watch('is_primary') === true}
                          onChange={() => setValue('is_primary', true)}
                          className="mr-2"
                        />
                        <span className="text-sm">Primary Parent</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="false"
                          checked={watch('is_primary') === false}
                          onChange={() => setValue('is_primary', false)}
                          className="mr-2"
                        />
                        <span className="text-sm">Secondary Parent</span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Primary parents are the main contact for school communications.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Parent
                      </>
                    )}
                  </Button>
                </div>
              </form>
        </CardContent>
      </Card>
    </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                <p className="text-sm text-gray-600">
                  Provide accurate personal details. Middle name is optional.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                <p className="text-sm text-gray-600">
                  Phone number is required. Email is optional but recommended for communications.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Relationship</h4>
                <p className="text-sm text-gray-600">
                  Select the appropriate relationship to the student(s).
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Primary Status</h4>
                <p className="text-sm text-gray-600">
                  Primary parents receive priority communications and notifications.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Relationship Types */}
          <Card>
            <CardHeader>
              <CardTitle>Relationship Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                {getRelationshipIcon('Father')}
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Father</div>
                  <div className="text-gray-500">Biological or adoptive father</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                {getRelationshipIcon('Mother')}
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Mother</div>
                  <div className="text-gray-500">Biological or adoptive mother</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                {getRelationshipIcon('Guardian')}
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Guardian</div>
                  <div className="text-gray-500">Legal guardian or caregiver</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                {getRelationshipIcon('Other')}
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Other</div>
                  <div className="text-gray-500">Other family member or relative</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900">John Smith</div>
                <div className="text-gray-600">Father, Primary Parent</div>
                <div className="text-gray-500">Engineer, +1-555-0123</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">Sarah Johnson</div>
                <div className="text-gray-600">Mother, Secondary Parent</div>
                <div className="text-gray-500">Teacher, sarah@email.com</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">Michael Brown</div>
                <div className="text-gray-600">Guardian, Primary Parent</div>
                <div className="text-gray-500">Doctor, +1-555-0456</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};