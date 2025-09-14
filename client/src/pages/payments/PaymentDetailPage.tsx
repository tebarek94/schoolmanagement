import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Receipt, 
  Download,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Building,
  GraduationCap,
  Hash,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Payment, ApiResponse } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';

export const PaymentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!id) {
        setError('Payment ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response: ApiResponse<Payment> = await paymentService.getPaymentById(parseInt(id));
        if (response.success && response.data) {
          setPayment(response.data);
        } else {
          setError(response.message || 'Failed to load payment details');
        }
      } catch (error) {
        console.error('Failed to fetch payment:', error);
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handleDeletePayment = async () => {
    if (!payment || !window.confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
      return;
    }

    try {
      await paymentService.deletePayment(payment.id);
      navigate('/payments');
    } catch (error) {
      console.error('Failed to delete payment:', error);
      alert('Failed to delete payment. Please try again.');
    }
  };

  const handleGenerateReceipt = async () => {
    if (!payment) return;
    
    try {
      // TODO: Implement receipt generation when backend supports it
      alert('Receipt generation will be available soon!');
      console.log('Generate receipt requested for payment:', payment.id);
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
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'Bank Transfer':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'Check':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'Mobile Money':
        return <CreditCard className="w-5 h-5 text-orange-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
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
          <p className="text-gray-500">Please log in to view payment details.</p>
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

  if (error || !payment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Not Found</h3>
          <p className="text-gray-500 mb-4">{error || 'The requested payment could not be found.'}</p>
          <Button onClick={() => navigate('/payments')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/payments')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
            <p className="text-gray-600 mt-1">Receipt #{payment.receipt_number}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={handleGenerateReceipt}
          >
            <Receipt className="w-4 h-4 mr-2" />
            Generate Receipt
          </Button>
          
          {hasRole('admin') && (
            <>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Payment
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDeletePayment}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Payment Status Banner */}
      <Card className={`border-l-4 ${
        payment.status === 'Paid' ? 'border-l-green-500' :
        payment.status === 'Pending' ? 'border-l-yellow-500' :
        payment.status === 'Overdue' ? 'border-l-red-500' :
        'border-l-blue-500'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(payment.status)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Payment Status: {payment.status}
                </h3>
                <p className="text-sm text-gray-600">
                  Amount: {formatCurrency(payment.amount)}
                </p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(payment.status)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Number
                  </label>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-lg font-semibold text-primary-600">
                      {payment.receipt_number}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Amount
                  </label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="flex items-center space-x-2">
                    {getPaymentMethodIcon(payment.payment_method)}
                    <span className="text-sm text-gray-900">{payment.payment_method}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {formatDate(payment.payment_date)}
                    </span>
                  </div>
                </div>
                
                {payment.reference_number && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference Number
                    </label>
                    <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {payment.reference_number}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {payment.student_name || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade/Class
                  </label>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {payment.grade_name || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee Type
                  </label>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <Badge variant="secondary">
                      {payment.fee_type || 'N/A'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                    #{payment.student_id}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {(payment.remarks || payment.created_at || payment.updated_at) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payment.remarks && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {payment.remarks}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span> {formatDate(payment.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {formatDate(payment.updated_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start"
                onClick={handleGenerateReceipt}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Generate Receipt
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              
              {hasRole('admin') && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Payment
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={handleDeletePayment}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Payment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(payment.status)}
                  {getStatusBadge(payment.status)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(payment.amount)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Method</span>
                <div className="flex items-center space-x-1">
                  {getPaymentMethodIcon(payment.payment_method)}
                  <span className="text-sm text-gray-900">{payment.payment_method}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm text-gray-900">
                  {formatDate(payment.payment_date)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Related Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Related</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={`/students/${payment.student_id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  View Student Profile
                </Button>
              </Link>
              
              <Link to={`/payments?studentId=${payment.student_id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View All Payments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
