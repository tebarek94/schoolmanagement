import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Receipt,
  Download,
  TrendingUp,
  FileText,
  Banknote
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Payment, FeeStructure, ApiResponse } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';

export const MyPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeeType, setSelectedFeeType] = useState('all');

  useEffect(() => {
    const fetchStudentPayments = async () => {
      try {
        setLoading(true);
        
        // Fetch payments for the student
        if (user?.profile && 'id' in user.profile) {
          const paymentsResponse: ApiResponse<Payment[]> = await paymentService.getStudentPayments(user.profile.id);
          setPayments(paymentsResponse.data || []);
          
          // Fetch fee structures
          const feesResponse: ApiResponse<FeeStructure[]> = await paymentService.getFeeStructures();
          setFeeStructures(feesResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch student payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentPayments();
  }, [user]);

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
        return <Banknote className="w-4 h-4" />;
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

  const filteredPayments = payments.filter(payment => {
    if (selectedStatus !== 'all' && payment.status !== selectedStatus) {
      return false;
    }
    if (selectedFeeType !== 'all' && payment.fee_type !== selectedFeeType) {
      return false;
    }
    return true;
  });

  const getUniqueStatuses = () => {
    const statuses = Array.from(new Set(payments.map(payment => payment.status)));
    return [
      { value: 'all', label: 'All Status' },
      ...statuses.map(status => ({ value: status, label: status }))
    ];
  };

  const getUniqueFeeTypes = () => {
    const feeTypes = Array.from(new Set(payments.map(payment => payment.fee_type).filter(Boolean)));
    return [
      { value: 'all', label: 'All Fee Types' },
      ...feeTypes.map(feeType => ({ value: feeType || '', label: feeType || '' }))
    ];
  };

  const getTotalPaid = () => {
    return payments.filter(p => p.status === 'Paid').reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getTotalPending = () => {
    return payments.filter(p => p.status === 'Pending').reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getTotalOverdue = () => {
    return payments.filter(p => p.status === 'Overdue').reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getTotalAmount = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
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

  const handleGenerateFeeStatement = async () => {
    try {
      if (user?.profile && 'id' in user.profile) {
        // TODO: Implement fee statement generation when backend supports it
        alert('Fee statement generation will be available soon!');
        console.log('Generate fee statement requested for student:', user.profile.id);
      }
    } catch (error) {
      console.error('Failed to generate fee statement:', error);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">My Payments</h1>
          <p className="text-gray-600 mt-2">View your payment history and fee statements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleGenerateFeeStatement}>
            <FileText className="w-4 h-4 mr-2" />
            Fee Statement
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalPaid())}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(getTotalPending())}</p>
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
                <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalOverdue())}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalAmount())}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Fee Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          {feeStructures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feeStructures.map((fee) => (
                <div key={fee.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{fee.fee_type}</h3>
                    <Badge variant={fee.is_mandatory ? 'error' : 'secondary'}>
                      {fee.is_mandatory ? 'Mandatory' : 'Optional'}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(fee.amount)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {formatDate(fee.due_date)}
                  </p>
                  {fee.description && (
                    <p className="text-sm text-gray-600 mt-2">{fee.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No fee structure available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  options={getUniqueStatuses()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Fee Type
                </label>
                <Select
                  value={selectedFeeType}
                  onChange={(e) => setSelectedFeeType(e.target.value)}
                  options={getUniqueFeeTypes()}
                />
              </div>
            </div>
          </div>

          {/* Payments Table */}
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">Receipt #</th>
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
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(payment.payment_date)}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateReceipt(payment.id)}
                          >
                            <Receipt className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payment records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
