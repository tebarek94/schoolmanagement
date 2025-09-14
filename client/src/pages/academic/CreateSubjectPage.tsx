import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { academicService } from '../../services/academicService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Subject } from '../../types';

interface SubjectFormData {
  name: string;
  code: string;
  description: string;
  is_core: boolean;
}

export const CreateSubjectPage: React.FC = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<SubjectFormData>({
    defaultValues: {
      is_core: true
    }
  });

  const onSubmit = async (data: SubjectFormData) => {
    if (!hasRole('admin')) {
      toast.error('You do not have permission to create subjects');
      return;
    }

    setIsLoading(true);

    try {
      const subjectData = {
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        description: data.description.trim(),
        is_core: data.is_core
      };

      await academicService.createSubject(subjectData);
      
      toast.success('Subject created successfully!');
      navigate('/academic/subjects');
    } catch (error: any) {
      console.error('Failed to create subject:', error);
      toast.error(error.response?.data?.message || 'Failed to create subject. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/academic/subjects');
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Subject</h1>
            <p className="text-gray-600 mt-2">Add a new subject to the curriculum</p>
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
                <BookOpen className="w-5 h-5 mr-2" />
                Subject Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Name *
                    </label>
                    <Input
                      placeholder="Enter subject name"
                      {...register('name', { 
                        required: 'Subject name is required',
                        minLength: {
                          value: 2,
                          message: 'Subject name must be at least 2 characters'
                        },
                        maxLength: {
                          value: 100,
                          message: 'Subject name must not exceed 100 characters'
                        }
                      })}
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Code *
                    </label>
                    <Input
                      placeholder="Enter subject code (e.g., MATH101)"
                      {...register('code', { 
                        required: 'Subject code is required',
                        pattern: {
                          value: /^[A-Z0-9]+$/,
                          message: 'Subject code must contain only uppercase letters and numbers'
                        },
                        minLength: {
                          value: 3,
                          message: 'Subject code must be at least 3 characters'
                        },
                        maxLength: {
                          value: 20,
                          message: 'Subject code must not exceed 20 characters'
                        }
                      })}
                      error={errors.code?.message}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                        register('code').onChange(e);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Type *
                  </label>
                  <Select
                    value={watch('is_core') ? 'core' : 'elective'}
                    onChange={(e) => setValue('is_core', e.target.value === 'core')}
                    options={[
                      { value: 'core', label: 'Core Subject' },
                      { value: 'elective', label: 'Elective Subject' }
                    ]}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Core subjects are mandatory for all students, while elective subjects are optional.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    placeholder="Enter subject description..."
                    {...register('description', {
                      maxLength: {
                        value: 500,
                        message: 'Description must not exceed 500 characters'
                      }
                    })}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Optional description of the subject content and objectives.
                  </p>
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
                        Create Subject
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
                <h4 className="font-medium text-gray-900 mb-2">Subject Name</h4>
                <p className="text-sm text-gray-600">
                  Use clear, descriptive names that students and teachers can easily understand.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Subject Code</h4>
                <p className="text-sm text-gray-600">
                  Use uppercase letters and numbers. Keep it short but meaningful (e.g., MATH101, ENG201).
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Subject Type</h4>
                <p className="text-sm text-gray-600">
                  Core subjects are mandatory. Elective subjects are optional and students can choose them.
                </p>
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
                <div className="font-medium text-gray-900">Mathematics</div>
                <div className="text-gray-600">Code: MATH101</div>
                <div className="text-gray-500">Type: Core</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">Computer Science</div>
                <div className="text-gray-600">Code: CS201</div>
                <div className="text-gray-500">Type: Elective</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">English Literature</div>
                <div className="text-gray-600">Code: ENG301</div>
                <div className="text-gray-500">Type: Core</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
