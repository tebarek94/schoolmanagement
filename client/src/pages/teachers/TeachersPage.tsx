import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const TeachersPage: React.FC = () => {
  const { hasRole } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-2">Manage teacher records and assignments</p>
        </div>
        {hasRole('admin') && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Teachers management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};




