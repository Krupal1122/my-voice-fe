# Firebase Cloud Functions Setup for OTP-based Password Reset

This directory contains Firebase Cloud Functions for implementing OTP-based password reset functionality.

## Setup Instructions

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Functions
```bash
cd functions
npm install
```

### 4. Configure Email Service

#### Option A: Gmail SMTP (Development)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Set the email configuration:
```bash
firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password"
```

#### Option B: SendGrid (Production Recommended)
1. Sign up for SendGrid: https://sendgrid.com/
2. Get your API key
3. Update the transporter configuration in `functions/index.js`:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'sendgrid',
  auth: {
    user: 'apikey',
    pass: functions.config().sendgrid?.api_key || 'your-sendgrid-api-key'
  }
});
```

### 5. Deploy Functions
```bash
firebase deploy --only functions
```

### 6. Test Functions Locally (Optional)
```bash
firebase emulators:start --only functions
```

## Functions Overview

### `sendOtp`
- **Purpose**: Sends OTP to user's email for password reset
- **Input**: `{ email: string }`
- **Output**: `{ success: boolean }`
- **Error Codes**:
  - `invalid-argument`: Invalid email format
  - `not-found`: User not found
  - `internal`: Server error

### `verifyOtpAndReset`
- **Purpose**: Verifies OTP and resets user's password
- **Input**: `{ email: string, otp: string, newPassword: string }`
- **Output**: `{ success: boolean }`
- **Error Codes**:
  - `invalid-argument`: Missing or invalid parameters
  - `not-found`: User or OTP not found
  - `failed-precondition`: OTP already used
  - `deadline-exceeded`: OTP expired
  - `permission-denied`: Invalid OTP
  - `internal`: Server error

## Security Features

1. **OTP Expiration**: OTPs expire after 5 minutes
2. **Single Use**: Each OTP can only be used once
3. **User Verification**: Only existing Firebase Auth users can request OTPs
4. **Password Validation**: Minimum 6 characters required
5. **Firestore Security**: OTP collection is only accessible by Cloud Functions

## Environment Variables

Set these using Firebase Functions config:
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.pass="your-app-password"
```

## Monitoring

View function logs:
```bash
firebase functions:log
```

## Troubleshooting

1. **Email not sending**: Check email service configuration and credentials
2. **OTP not found**: Ensure Firestore rules allow Cloud Functions access
3. **User not found**: Verify user exists in Firebase Auth
4. **Permission denied**: Check Firebase project permissions and billing

## Production Considerations

1. Use a professional email service (SendGrid, Mailgun, etc.)
2. Implement rate limiting to prevent abuse
3. Add monitoring and alerting
4. Consider implementing CAPTCHA for additional security
5. Set up proper error logging and monitoring
