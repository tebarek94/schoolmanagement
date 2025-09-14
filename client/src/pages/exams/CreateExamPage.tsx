import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const CreateExamPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create Exam</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Exam Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Exam creation form will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
