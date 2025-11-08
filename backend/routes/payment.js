const express = require('express');
const axios = require('axios');
const router = express.Router();

// Cache for Pesapal token
let pesapalToken = null;
let tokenExpiry = null;

/**
 * Get Pesapal authentication token
 */
const getPesapalToken = async () => {
  // Return cached token if still valid
  if (pesapalToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('✅ Using cached Pesapal token');
    return pesapalToken;
  }

  try {
    console.log('🔑 Requesting new Pesapal token...');
    console.log('📍 API URL:', process.env.PESAPAL_API_URL);
    console.log('🔑 Consumer Key:', process.env.PESAPAL_CONSUMER_KEY ? '***' + process.env.PESAPAL_CONSUMER_KEY.slice(-4) : 'MISSING');
    console.log('🔒 Consumer Secret:', process.env.PESAPAL_CONSUMER_SECRET ? '***' + process.env.PESAPAL_CONSUMER_SECRET.slice(-4) : 'MISSING');
    
    const response = await axios.post(
      `${process.env.PESAPAL_API_URL}/api/Auth/RequestToken`,
      {
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('📥 Pesapal response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.token) {
      pesapalToken = response.data.token;
      // Token valid for ~5 minutes, expire cache after 4 minutes
      tokenExpiry = Date.now() + (4 * 60 * 1000);
      console.log('✅ Pesapal token obtained');
      return pesapalToken;
    } else {
      throw new Error('Invalid token response: ' + JSON.stringify(response.data));
    }
  } catch (error) {
    console.error('❌ Token error:', error.response?.data || error.message);
    console.error('❌ Full response:', error.response);
    throw new Error('Failed to authenticate with Pesapal');
  }
};

/**
 * Register IPN URL (run once or when needed)
 */
const registerIPN = async (token) => {
  try {
    console.log('📡 Registering IPN URL...');
    
    // IPN URL should point to your backend, not frontend
    const ipnUrl = process.env.IPN_URL || `http://localhost:${process.env.PORT || 5001}/api/payment/ipn`;
    
    const response = await axios.post(
      `${process.env.PESAPAL_API_URL}/api/URLSetup/RegisterIPN`,
      {
        url: ipnUrl,
        ipn_notification_type: 'GET'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ IPN registered:', response.data);
    return response.data.ipn_id || null;
  } catch (error) {
    console.warn('⚠️ IPN registration warning:', error.response?.data?.message || error.message);
    // Don't throw - IPN might already be registered
    return null;
  }
};

/**
 * POST /api/payment/initialize
 * Initialize payment with Pesapal
 */
router.post('/initialize', async (req, res) => {
  try {
    const { product, customer } = req.body;

    // Validate input
    if (!product || !customer || !customer.email || !customer.firstName) {
      return res.status(400).json({
        success: false,
        message: 'Product and customer information (email, firstName) are required'
      });
    }

    console.log('💳 Payment request:', {
      product: product.name,
      amount: product.price,
      customer: customer.email
    });

    // MOCK MODE for testing without Pesapal credentials
    if (process.env.MOCK_PAYMENT === 'true') {
      console.log('🧪 MOCK PAYMENT MODE - Skipping Pesapal');
      const mockOrderId = `MOCK-${Date.now()}`;
      
      // Simulate redirect URL - this should redirect to your frontend success page
      const mockRedirectUrl = `${process.env.FRONTEND_URL}/payment-success?OrderTrackingId=${mockOrderId}&product=${encodeURIComponent(product.name)}`;
      
      return res.json({
        success: true,
        message: 'Payment initialized (MOCK MODE)',
        data: {
          orderTrackingId: mockOrderId,
          merchantReference: mockOrderId,
          redirectUrl: mockRedirectUrl
        }
      });
    }

    // Real Pesapal flow
    const token = await getPesapalToken();

    // Register IPN (optional - can be done once)
    const ipnId = await registerIPN(token);

    // Generate unique order reference
    const orderReference = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Prepare payment data
    const paymentData = {
      id: orderReference,
      currency: 'UGX',
      amount: parseFloat(product.price),
      description: `Purchase: ${product.name}`,
      callback_url: `${process.env.PESAPAL_CALLBACK_URL}?product=${encodeURIComponent(product.name)}`,
      notification_id: ipnId,
      billing_address: {
        email_address: customer.email,
        phone_number: customer.phone || '',
        country_code: 'UG',
        first_name: customer.firstName,
        middle_name: customer.middleName || '',
        last_name: customer.lastName || '',
        line_1: customer.address || '',
        line_2: '',
        city: customer.city || '',
        state: customer.state || '',
        postal_code: '',
        zip_code: ''
      }
    };

    console.log('📤 Submitting order to Pesapal...');

    // Submit order
    const response = await axios.post(
      `${process.env.PESAPAL_API_URL}/api/Transactions/SubmitOrderRequest`,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Pesapal response received');

    if (response.data && response.data.redirect_url) {
      res.json({
        success: true,
        message: 'Payment initialized successfully',
        data: {
          orderTrackingId: response.data.order_tracking_id,
          merchantReference: orderReference,
          redirectUrl: response.data.redirect_url
        }
      });
    } else {
      throw new Error('Invalid payment response from Pesapal');
    }

  } catch (error) {
    console.error('❌ Payment error:', error.response?.data || error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.response?.data?.error?.message || error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/payment/status/:orderTrackingId
 * Check payment status
 */
router.get('/status/:orderTrackingId', async (req, res) => {
  try {
    const { orderTrackingId } = req.params;
    
    console.log('🔍 Checking status for:', orderTrackingId);

    // MOCK MODE
    if (process.env.MOCK_PAYMENT === 'true' || orderTrackingId.startsWith('MOCK-')) {
      console.log('🧪 MOCK PAYMENT STATUS - Returning success');
      return res.json({
        success: true,
        data: {
          order_tracking_id: orderTrackingId,
          payment_status_description: 'Completed',
          status: 200,
          amount: 0,
          currency: 'UGX'
        }
      });
    }

    const token = await getPesapalToken();

    const response = await axios.get(
      `${process.env.PESAPAL_API_URL}/api/Transactions/GetTransactionStatus`,
      {
        params: { orderTrackingId },
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Status:', response.data.payment_status_description);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('❌ Status check error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message
    });
  }
});

/**
 * GET /api/payment/ipn
 * Pesapal IPN (Instant Payment Notification) endpoint
 */
router.get('/ipn', (req, res) => {
  try {
    console.log('📬 IPN notification received:', req.query);
    
    const { OrderTrackingId, OrderMerchantReference } = req.query;
    
    // Log the payment notification
    console.log('💰 Payment notification:', {
      orderTrackingId: OrderTrackingId,
      merchantReference: OrderMerchantReference,
      timestamp: new Date().toISOString()
    });

    // Respond to Pesapal
    res.status(200).send('IPN received');
    
  } catch (error) {
    console.error('❌ IPN error:', error);
    res.status(500).send('IPN error');
  }
});

/**
 * GET /api/payment/PesapalIPN
 * Alternative IPN endpoint (handles Pesapal's cached URL)
 */
router.get('/PesapalIPN', (req, res) => {
  try {
    console.log('📬 IPN notification received (PesapalIPN):', req.query);
    
    const { OrderTrackingId, OrderMerchantReference } = req.query;
    
    console.log('💰 Payment notification:', {
      orderTrackingId: OrderTrackingId,
      merchantReference: OrderMerchantReference,
      timestamp: new Date().toISOString()
    });

    res.status(200).send('IPN received');
    
  } catch (error) {
    console.error('❌ IPN error:', error);
    res.status(500).send('IPN error');
  }
});

module.exports = router;