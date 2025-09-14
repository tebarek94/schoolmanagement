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
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Payment, ApiResponse } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';

export const PaymentsPage: React.FC = () => {
  const { hasRole, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedFeeType, setSelectedFeeType] = useState('all');

  useEffect(() => {
    const fetchPayments = async () => {
      console.log('PaymentsPage: Authentication state:', { 
        authLoading, 
        isAuthenticated, 
        user: !!user, 
        token: !!localStorage.getItem('token') 
      });
      
      // Wait for auth to finish loading
      if (authLoading) {
        console.log('PaymentsPage: Auth still loading, waiting...');
        return;
      }
      
      // Only fetch payments if user is authenticated
      if (!isAuthenticated || !user) {
        console.log('PaymentsPage: User not authenticated, skipping API call');
        setLoading(false);
        return;
      }

      console.log('PaymentsPage: User authenticated, fetching payments...');
      try {
        setLoading(true);
        const response: ApiResponse<Payment[]> = await paymentService.getPayments();
        setPayments(response.data || []);
        setFilteredPayments(response.data || []);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [authLoading, isAuthenticated, user]);

  useEffect(() => {
    let filtered = payments.filter(payment =>
      payment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.fee_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === selectedStatus);
    }

    if (selectedMethod !== 'all') {
      filtered = filtered.filter(payment => payment.payment_method === selectedMethod);
    }

    if (selectedFeeType !== 'all') {
      filtered = filtered.filter(payment => payment.fee_type === selectedFeeType);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, selectedStatus, selectedMethod, selectedFeeType, payments]);

  const handleDeletePayment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentService.deletePayment(id);
        setPayments(payments.filter(payment => payment.id !== id));
        setFilteredPayments(filteredPayments.filter(payment => payment.id !== id));
      } catch (error) {
        console.error('Failed to delete payment:', error);
      }
    }
  };

  const handleExportPayments = async () => {
    try {
      // TODO: Implement export functionality when backend supports it
      alert('Export functionality will be available soon!');
      console.log('Export payments requested');
    } catch (error) {
      console.error('Failed to export payments:', error);
    }
  };

  const handleGenerateReceipt = async (paymentId: number) => {
    try {
      // TODO: Implement receipt generation when backend supports it
      alert('Receipt generation will be available soon!');
      console.log('Generate receipt requested for payment:', paymentId);
    } catch (error) {
      console.error('Failed to generate receipt:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'Partial':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Paid': 'success',
      'Pending': 'warning',
      'Overdue': 'error',
      'Partial': 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Cash':
        return <DollarSign className="w-4 h-4" />;
      case 'Bank Transfer':
        return <CreditCard className="w-4 h-4" />;
      case 'Check':
        return <FileText className="w-4 h-4" />;
      case 'Mobile Money':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getUniqueStatuses = () => {
    const statuses = Array.from(new Set(payments.map(payment => payment.status)));
    return [
      { value: 'all', label: 'All Status' },
      ...statuses.map(status => ({ value: status, label: status }))
    ];
  };

  const getUniqueMethods = () => {
    const methods = Array.from(new Set(payments.map(payment => payment.payment_method)));
    return [
      { value: 'all', label: 'All Methods' },
      ...methods.map(method => ({ value: method, label: method }))
    ];
  };

  const getUniqueFeeTypes = () => {
    const feeTypes = Array.from(new Set(payments.map(payment => payment.fee_type).filter(Boolean)));
    return [
      { value: 'all', label: 'All Fee Types' },
      ...feeTypes.map(feeType => ({ value: feeType || '', label: feeType || '' }))
    ];
  };

  const getTotalAmount = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getPaidAmount = () => {
    return payments.filter(p => p.status === 'Paid').reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getPendingAmount = () => {
    return payments.filter(p => p.status === 'Pending').reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getOverdueAmount = () => {
    return payments.filter(p => p.status === 'Overdue').reduce((sum, payment) => sum + payment.amount, 0);
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please log in to view payments.</p>
        </div>
      </div>
    );
  }

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
      <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Manage student payments and fee structures</p>
        </div>
        {hasRole('admin') && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalAmount())}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getPaidAmount())}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(getPendingAmount())}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(getOverdueAmount())}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={getUniqueStatuses()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Method
              </label>
              <Select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                options={getUniqueMethods()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Type
              </label>
              <Select
                value={selectedFeeType}
                onChange={(e) => setSelectedFeeType(e.target.value)}
                options={getUniqueFeeTypes()}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={handleExportPayments}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Receipt #</th>
                  <th className="table-head">Student</th>
                  <th className="table-head">Fee Type</th>
                  <th className="table-head">Amount</th>
                  <th className="table-head">Method</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Date</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="table-row">
                    <td className="table-cell">
                      <span className="font-medium text-primary-600">
                        {payment.receipt_number}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">
                          {payment.student_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.grade_name}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant="secondary">
                        {payment.fee_type}
                      </Badge>
                    </td>
                    <td className="table-cell">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        {getPaymentMethodIcon(payment.payment_method)}
                        <span className="ml-2 text-sm">{payment.payment_method}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        {getStatusBadge(payment.status)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">
                        {formatDate(payment.payment_date)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link to={`/payments/${payment.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateReceipt(payment.id)}
                        >
                          <Receipt className="w-4 h-4" />
                        </Button>
                        {hasRole('admin') && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePayment(payment.id)}
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

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};





