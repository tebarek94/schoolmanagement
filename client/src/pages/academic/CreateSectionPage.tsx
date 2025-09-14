import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { academicService } from '../../services/academicService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Grade, ApiResponse } from '../../types';

interface SectionFormData {
  name: string;
  grade_id: number;
  capacity: number;
  academic_year_id: number;
}

export const CreateSectionPage: React.FC = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SectionFormData>({
    defaultValues: {
      capacity: 30
    }
  });

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoadingGrades(true);
        const response: ApiResponse<Grade[]> = await academicService.getGrades();
        setGrades(response.data || []);
      } catch (error) {
        console.error('Failed to fetch grades:', error);
        toast.error('Failed to load grades');
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchGrades();
  }, []);

  const onSubmit = async (data: SectionFormData) => {
    if (!hasRole('admin')) {
      toast.error('You do not have permission to create sections');
      return;
    }

    setIsLoading(true);

    try {
      const sectionData = {
        name: data.name.trim(),
        grade_id: data.grade_id,
        capacity: data.capacity,
        academic_year_id: data.academic_year_id || 1 // Default to current academic year
      };

      await academicService.createSection(sectionData);
      
      toast.success('Section created successfully!');
      navigate('/academic/classes');
    } catch (error: any) {
      console.error('Failed to create section:', error);
      toast.error(error.response?.data?.message || 'Failed to create section. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/academic/classes');
  };

  const selectedGrade = grades.find(grade => grade.id === watch('grade_id'));

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
            <h1 className="text-3xl font-bold text-gray-900">Create New Section</h1>
            <p className="text-gray-600 mt-2">Add a new class section to a grade</p>
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
                <Building className="w-5 h-5 mr-2" />
                Section Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Name *
                    </label>
                    <Input
                      placeholder="Enter section name (e.g., A, B, Alpha, Beta)"
                      {...register('name', { 
                        required: 'Section name is required',
                        minLength: {
                          value: 1,
                          message: 'Section name must be at least 1 character'
                        },
                        maxLength: {
                          value: 20,
                          message: 'Section name must not exceed 20 characters'
                        }
                      })}
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade *
                    </label>
                    {loadingGrades ? (
                      <div className="flex items-center justify-center h-10 border border-gray-300 rounded-md">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      </div>
                    ) : (
                      <Select
                        {...register('grade_id', { 
                          required: 'Grade is required',
                          valueAsNumber: true
                        })}
                        options={[
                          { value: '', label: 'Select a grade' },
                          ...grades.map(grade => ({ 
                            value: grade.id.toString(), 
                            label: `${grade.name} (Level ${grade.level})` 
                          }))
                        ]}
                        error={errors.grade_id?.message}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      placeholder="Enter maximum capacity"
                      {...register('capacity', { 
                        required: 'Capacity is required',
                        min: {
                          value: 1,
                          message: 'Capacity must be at least 1'
                        },
                        max: {
                          value: 50,
                          message: 'Capacity must not exceed 50'
                        }
                      })}
                      error={errors.capacity?.message}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum number of students in this section
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year
                    </label>
                    <Select
                      {...register('academic_year_id', { 
                        valueAsNumber: true
                      })}
                      options={[
                        { value: '1', label: '2024-2025' },
                        { value: '2', label: '2025-2026' },
                        { value: '3', label: '2026-2027' }
                      ]}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Academic year for this section
                    </p>
                  </div>
                </div>

                {selectedGrade && (
                  <div className="p-4 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-900 mb-2">Selected Grade Information</h4>
                    <div className="text-sm text-blue-800">
                      <p><strong>Grade:</strong> {selectedGrade.name}</p>
                      <p><strong>Level:</strong> {selectedGrade.level}</p>
                      {selectedGrade.description && (
                        <p><strong>Description:</strong> {selectedGrade.description}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || loadingGrades}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Section
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
                <h4 className="font-medium text-gray-900 mb-2">Section Name</h4>
                <p className="text-sm text-gray-600">
                  Use simple identifiers like A, B, Alpha, Beta, or descriptive names.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Grade Selection</h4>
                <p className="text-sm text-gray-600">
                  Choose the grade level this section belongs to. Each grade can have multiple sections.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Capacity</h4>
                <p className="text-sm text-gray-600">
                  Set the maximum number of students. Consider classroom size and teaching effectiveness.
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
                <div className="font-medium text-gray-900">Grade 1 - Section A</div>
                <div className="text-gray-600">Capacity: 25 students</div>
                <div className="text-gray-500">Elementary foundation</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">Grade 5 - Alpha</div>
                <div className="text-gray-600">Capacity: 30 students</div>
                <div className="text-gray-500">Upper elementary</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-gray-900">Grade 9 - Section B</div>
                <div className="text-gray-600">Capacity: 35 students</div>
                <div className="text-gray-500">High school freshman</div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Capacity Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-green-600">1-20:</span>
                <span className="text-gray-600 ml-2">Small class (optimal)</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-yellow-600">21-35:</span>
                <span className="text-gray-600 ml-2">Medium class (standard)</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-red-600">36-50:</span>
                <span className="text-gray-600 ml-2">Large class (maximum)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
