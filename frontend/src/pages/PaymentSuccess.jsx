import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Home, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('checking');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    checkPaymentStatus();
    
    // Get product name from URL or localStorage
    const productFromUrl = searchParams.get('product');
    const productFromStorage = localStorage.getItem('productName');
    setProductName(productFromUrl || productFromStorage || 'Product');
  }, []);

  const checkPaymentStatus = async () => {
    try {
      // Get order tracking ID from URL params or localStorage
      const orderTrackingId = 
        searchParams.get('OrderTrackingId') || 
        searchParams.get('orderTrackingId') ||
        localStorage.getItem('orderTrackingId');

      if (!orderTrackingId) {
        console.error('No order tracking ID found');
        setStatus('failed');
        return;
      }

      console.log('🔍 Checking payment status for:', orderTrackingId);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payment/status/${orderTrackingId}`
      );

      console.log('📊 Payment status:', response.data);

      if (response.data.success) {
        const statusDescription = response.data.data.payment_status_description;
        
        if (statusDescription === 'Completed' || response.data.data.status === 200) {
          setStatus('success');
          setPaymentDetails(response.data.data);
          // Clear localStorage
          localStorage.removeItem('orderTrackingId');
          localStorage.removeItem('productName');
        } else if (statusDescription === 'Failed' || statusDescription === 'Cancelled') {
          setStatus('failed');
          setPaymentDetails(response.data.data);
        } else {
          // Still pending
          setStatus('pending');
          setPaymentDetails(response.data.data);
        }
      } else {
        setStatus('failed');
      }

    } catch (error) {
      console.error('❌ Error checking status:', error);
      setStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        
        {/* Checking Status */}
        {status === 'checking' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-10 text-center"
          >
            <Loader2 className="w-20 h-20 text-blue-600 animate-spin mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your transaction...
            </p>
          </motion.div>
        )}

        {/* Success */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Payment Successful! 🎉
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase of <span className="font-semibold">{productName}</span>
            </p>
            
            {paymentDetails && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm font-semibold text-gray-800">
                    {paymentDetails.order_tracking_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-600">
                    UGX {paymentDetails.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                    {paymentDetails.payment_status_description}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-10 text-center"
          >
            <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-8">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
            
            {paymentDetails && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-red-700">
                  <span className="font-semibold">Status:</span>{' '}
                  {paymentDetails.payment_status_description || 'Failed'}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Package className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Pending */}
        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-10 text-center"
          >
            <Loader2 className="w-20 h-20 text-yellow-500 animate-spin mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Payment Pending
            </h2>
            <p className="text-gray-600 mb-8">
              Your payment is being processed. This may take a few moments.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={checkPaymentStatus}
                className="w-full btn-primary"
              >
                Check Status Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;