import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const ParentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Parents</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Parents List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Parents management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};




