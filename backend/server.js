require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRouter = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/payment', paymentRouter);

// Handle Pesapal IPN at root level (if they call /api/Payment/PesapalIPN)
app.get('/api/Payment/PesapalIPN', (req, res) => {
  console.log('📬 IPN received at root level:', req.query);
  res.status(200).send('IPN received');
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Shop API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/payment`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});