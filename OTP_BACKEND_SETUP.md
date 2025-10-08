# OTP Password Reset Setup Guide

## Backend Setup (Node.js)

### 1. Install Dependencies
```bash
cd myvoice-be/server
npm install nodemailer
```

### 2. Environment Variables
Create a `.env` file in `myvoice-be/server/` with:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/myvoice

# Email configuration for OTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password

# OTP settings
OTP_TTL_MINUTES=10
```

### 3. Gmail App Password Setup
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an "App Password" for your application
4. Use this app password as `EMAIL_PASS`

### 4. Start Backend Server
```bash
cd myvoice-be/server
npm run dev
```

## Frontend Setup

The frontend is already configured to call the backend API at `http://localhost:5000/api/otp/`

## API Endpoints

### Request OTP
- **POST** `/api/otp/request-reset`
- **Body**: `{ "email": "user@example.com" }`
- **Response**: `{ "ok": true, "message": "Code de vérification envoyé à votre email" }`

### Verify OTP & Reset Password
- **POST** `/api/otp/verify-otp`
- **Body**: `{ "email": "user@example.com", "otp": "123456", "newPassword": "newpass123" }`
- **Response**: `{ "ok": true, "message": "Mot de passe réinitialisé avec succès" }`

## How It Works

1. User clicks "Mot de passe oublié ?"
2. User enters email address
3. Frontend calls `/api/otp/request-reset` with email
4. Backend generates 6-digit OTP and sends email via nodemailer
5. User enters OTP and new password
6. Frontend calls `/api/otp/verify-otp` to verify and reset
7. Success message shown and user redirected to login

## Testing

1. Start backend: `npm run dev` in `myvoice-be/server/`
2. Start frontend: `npm run dev` in `my-voice-fe/`
3. Open forgot password modal
4. Enter any email address
5. Check console logs for OTP (in development mode)
6. Enter OTP and new password to complete reset

## Security Features

- OTP expires in 10 minutes
- OTP is hashed before storing in database
- Old OTPs are automatically deleted
- Rate limiting can be added for production
- Email validation and sanitization
