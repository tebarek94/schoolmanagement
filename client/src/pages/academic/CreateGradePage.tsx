import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { academicService } from '../../services/academicService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

interface GradeFormData {
  name: string;
  level: number;
  description: string;
}

export const CreateGradePage: React.FC = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<GradeFormData>({
    defaultValues: {
      level: 1
    }
  });

  const onSubmit = async (data: GradeFormData) => {
    if (!hasRole('admin')) {
      toast.error('You do not have permission to create grades');
      return;
    }

    setIsLoading(true);

    try {
      const gradeData = {
        name: data.name.trim(),
        level: data.level,
        description: data.description.trim()
      };

      await academicService.createGrade(gradeData);
      
      toast.success('Grade created successfully!');
      navigate('/academic/classes');
    } catch (error: any) {
      console.error('Failed to create grade:', error);
      toast.error(error.response?.data?.message || 'Failed to create grade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/academic/classes');
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Grade</h1>
            <p className="text-gray-600 mt-2">Add a new academic grade to the system</p>
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
                <GraduationCap className="w-5 h-5 mr-2" />
                Grade Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Name *
                    </label>
                    <Input
                      placeholder="Enter grade name (e.g., Grade 1, Class 5)"
                      {...register('name', { 
                        required: 'Grade name is required',
                        minLength: {
                          value: 2,
                          message: 'Grade name must be at least 2 characters'
                        },
                        maxLength: {
                          value: 50,
                          message: 'Grade name must not exceed 50 characters'
                        }
                      })}
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      placeholder="Enter grade level (1-12)"
                      {...register('level', { 
                        required: 'Grade level is required',
                        min: {
                          value: 1,
                          message: 'Grade level must be at least 1'
                        },
                        max: {
                          value: 12,
                          message: 'Grade level must not exceed 12'
                        }
                      })}
                      error={errors.level?.message}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Numeric level from 1 (lowest) to 12 (highest)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    placeholder="Enter grade description..."
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
                    Optional description of the grade level and curriculum.
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
                        Create Grade
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
                <h4 className="font-medium text-gray-900 mb-2">Grade Name</h4>
                <p className="text-sm text-gray-600">
                  Use clear, descriptive names that students and parents can easily understand.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Grade Level</h4>
                <p className="text-sm text-gray-600">
                  Use numeric levels from 1 to 12. Lower numbers represent younger students.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600">
                  Provide details about the curriculum, age group, or special characteristics.
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
                <div className="font-medium text-gray-900">Grade 1</div>
                <div className="text-gray-600">Level: 1</div>
                <div className="text-gray-500">Elementary foundation</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">Grade 5</div>
                <div className="text-gray-600">Level: 5</div>
                <div className="text-gray-500">Upper elementary</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">Grade 9</div>
                <div className="text-gray-600">Level: 9</div>
                <div className="text-gray-500">High school freshman</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">Grade 12</div>
                <div className="text-gray-600">Level: 12</div>
                <div className="text-gray-500">Senior year</div>
              </div>
            </CardContent>
          </Card>

          {/* Grade Level Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Level Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-blue-600">1-5:</span>
                <span className="text-gray-600 ml-2">Elementary School</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-green-600">6-8:</span>
                <span className="text-gray-600 ml-2">Middle School</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-purple-600">9-12:</span>
                <span className="text-gray-600 ml-2">High School</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
