import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const SubjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Subjects Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Subjects management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
