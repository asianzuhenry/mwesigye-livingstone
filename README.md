# Personal Shopping Web App

A full-stack e-commerce application with React frontend and Node.js backend, integrated with Pesapal payment gateway.

## 🚀 Features

- Modern React + Vite frontend with Tailwind CSS
- Node.js + Express backend
- Pesapal payment integration (Visa, Mastercard, Mobile Money)
- Responsive design
- Real-time payment status verification
- Mock payment mode for testing

## 📁 Project Structure

```
personal-shop/
├── backend/          # Node.js Express server
│   ├── routes/       # API routes
│   ├── server.js     # Entry point
│   └── .env          # Environment variables (not in git)
│
└── frontend/         # React + Vite app
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── data/
    └── .env          # Environment variables (not in git)
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Pesapal account (for payment integration)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your Pesapal credentials
nano .env

# Start the server
npm run dev
```

Backend will run on: `http://localhost:5001`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Start the development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=5001
PESAPAL_CONSUMER_KEY=your-key
PESAPAL_CONSUMER_SECRET=your-secret
PESAPAL_API_URL=https://cybqa.pesapal.com/pesapalv3
PESAPAL_CALLBACK_URL=http://localhost:5173/payment-success
FRONTEND_URL=http://localhost:5173
MOCK_PAYMENT=false
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5001/api
```

## 💳 Pesapal Setup

1. Sign up at [Pesapal Developer Portal](https://developer.pesapal.com/)
2. Create a new app
3. Get your **Sandbox** Consumer Key and Secret
4. Add them to `backend/.env`

## 🧪 Testing

### Mock Payment Mode

For testing without Pesapal credentials:

1. Set `MOCK_PAYMENT=true` in `backend/.env`
2. Restart backend
3. Payment flow will simulate success

### Real Pesapal Testing

Use Pesapal sandbox test cards:
- Visa: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date

## 🚀 Deployment

### Backend (Render/Railway)

1. Push code to GitHub
2. Create new Web Service
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

### Frontend (Render/Netlify/Vercel)

1. Create new Static Site
2. Set root directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL`

## 📝 API Endpoints

- `POST /api/payment/initialize` - Initialize payment
- `GET /api/payment/status/:id` - Check payment status
- `GET /api/payment/ipn` - IPN notification handler

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router

**Backend:**
- Node.js
- Express
- Axios
- CORS
- dotenv

## 📄 License

MIT

## 👤 Author

Your Name

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.