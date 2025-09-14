import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Users,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  UserCheck,
  UserX,
  Heart,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { parentService } from '../../services/parentService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Parent, ApiResponse } from '../../types';
import { formatDate, getFullName } from '../../utils/helpers';

interface ParentsStats {
  totalParents: number;
  primaryParents: number;
  secondaryParents: number;
  fathers: number;
  mothers: number;
  guardians: number;
}

export const ParentsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [stats, setStats] = useState<ParentsStats>({
    totalParents: 0,
    primaryParents: 0,
    secondaryParents: 0,
    fathers: 0,
    mothers: 0,
    guardians: 0
  });

  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Parent[]> = await parentService.getParents();
        setParents(response.data || []);
        setFilteredParents(response.data || []);
        
        // Calculate stats
        const parentsData = response.data || [];
        setStats({
          totalParents: parentsData.length,
          primaryParents: parentsData.filter(p => p.is_primary).length,
          secondaryParents: parentsData.filter(p => !p.is_primary).length,
          fathers: parentsData.filter(p => p.relationship === 'Father').length,
          mothers: parentsData.filter(p => p.relationship === 'Mother').length,
          guardians: parentsData.filter(p => p.relationship === 'Guardian').length
        });
      } catch (error) {
        console.error('Failed to fetch parents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  useEffect(() => {
    let filtered = parents.filter(parent =>
      getFullName(parent.first_name, parent.last_name, parent.middle_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedRelationship !== 'all') {
      filtered = filtered.filter(parent => parent.relationship === selectedRelationship);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(parent => 
        selectedStatus === 'primary' ? parent.is_primary : !parent.is_primary
      );
    }

    setFilteredParents(filtered);
  }, [searchTerm, selectedRelationship, selectedStatus, parents]);

  const handleDeleteParent = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      try {
        await parentService.deleteParent(id);
        setParents(parents.filter(parent => parent.id !== id));
        setFilteredParents(filteredParents.filter(parent => parent.id !== id));
      } catch (error) {
        console.error('Failed to delete parent:', error);
      }
    }
  };

  const handleExportParents = async () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Relationship,Phone,Email,Occupation,Address,Primary,Created Date\n" +
        filteredParents.map(parent => 
          `${getFullName(parent.first_name, parent.last_name, parent.middle_name)},${parent.relationship},${parent.phone},${parent.email || ''},${parent.occupation || ''},${parent.address || ''},${parent.is_primary ? 'Yes' : 'No'},${formatDate(parent.created_at)}`
        ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "parents.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export parents:', error);
    }
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'Father':
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'Mother':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'Guardian':
        return <Shield className="w-4 h-4 text-green-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRelationshipBadge = (relationship: string) => {
    const variants = {
      'Father': 'default',
      'Mother': 'secondary',
      'Guardian': 'success',
      'Other': 'warning'
    } as const;

    return (
      <Badge variant={variants[relationship as keyof typeof variants] || 'secondary'}>
        {relationship}
      </Badge>
    );
  };

  const getStatusBadge = (isPrimary: boolean) => {
    return (
      <Badge variant={isPrimary ? 'success' : 'secondary'}>
        {isPrimary ? 'Primary' : 'Secondary'}
      </Badge>
    );
  };

  const getUniqueRelationships = () => {
    const relationships = Array.from(new Set(parents.map(parent => parent.relationship)));
    return [
      { value: 'all', label: 'All Relationships' },
      ...relationships.map(relationship => ({ value: relationship, label: relationship }))
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parents Management</h1>
          <p className="text-gray-600 mt-2">Manage parent information and relationships</p>
        </div>
        {hasRole('admin') && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Parent
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Parents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalParents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Primary</p>
                <p className="text-2xl font-bold text-green-600">{stats.primaryParents}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Secondary</p>
                <p className="text-2xl font-bold text-purple-600">{stats.secondaryParents}</p>
              </div>
              <UserX className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fathers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.fathers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mothers</p>
                <p className="text-2xl font-bold text-pink-600">{stats.mothers}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Guardians</p>
                <p className="text-2xl font-bold text-orange-600">{stats.guardians}</p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search parents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <Select
                value={selectedRelationship}
                onChange={(e) => setSelectedRelationship(e.target.value)}
                options={getUniqueRelationships()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' }
                ]}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={handleExportParents}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Parents ({filteredParents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Parent</th>
                  <th className="table-head">Relationship</th>
                  <th className="table-head">Contact</th>
                  <th className="table-head">Occupation</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredParents.map((parent) => (
                  <tr key={parent.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        {getRelationshipIcon(parent.relationship)}
                        <div className="ml-2">
                          <div className="font-medium text-gray-900">
                            {getFullName(parent.first_name, parent.last_name, parent.middle_name)}
                          </div>
                          {parent.middle_name && (
                            <div className="text-sm text-gray-500">
                              {parent.middle_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {getRelationshipBadge(parent.relationship)}
                    </td>
                    <td className="table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="text-gray-900">{parent.phone}</span>
                        </div>
                        {parent.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="text-gray-600">{parent.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {parent.occupation || 'Not specified'}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(parent.is_primary)}
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">
                        {formatDate(parent.created_at)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link to={`/parents/${parent.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {hasRole('admin') && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteParent(parent.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredParents.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No parents found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};





