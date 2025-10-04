# 🔐 Firebase OTP-based Password Reset - Complete Setup Guide

## Overview
This implementation provides a complete OTP-based password reset flow using Firebase Cloud Functions, replacing the default Firebase password reset email with a custom OTP system.

## 🚀 Quick Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Functions
```bash
cd myvoice-fe/functions
npm install
```

### 3. Configure Email Service

#### Option A: Gmail (Development)
```bash
firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password"
```

#### Option B: SendGrid (Production)
```bash
firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
```

### 4. Deploy Functions
```bash
firebase deploy --only functions
```

## 📁 Files Created/Modified

### Frontend Changes
- ✅ `src/auth/firebase.tsx` - Added Functions support
- ✅ `src/components/LoginModal.tsx` - Updated to use Cloud Functions

### Backend Functions
- ✅ `functions/package.json` - Dependencies
- ✅ `functions/index.js` - Main Cloud Functions
- ✅ `firebase.json` - Firebase configuration
- ✅ `firestore.rules` - Security rules
- ✅ `firestore.indexes.json` - Database indexes

## 🔄 Complete Flow

### 1. User Requests Password Reset
```
User clicks "Mot de passe oublié?" → Enters email → Cloud Function sends OTP
```

### 2. OTP Verification & Password Reset
```
User enters OTP + new password → Cloud Function verifies & resets password
```

### 3. Success
```
User can login with new password
```

## 🛡️ Security Features

- **OTP Expiration**: 5 minutes
- **Single Use**: Each OTP can only be used once
- **User Verification**: Only existing Firebase Auth users
- **Password Validation**: Minimum 6 characters
- **Firestore Security**: OTP collection protected

## 📧 Email Templates

The system sends beautiful HTML emails with:
- MyVoice974 branding
- Clear OTP display
- Expiration warning
- Security notice

## 🔧 Configuration Options

### Environment Variables
```bash
# Gmail SMTP
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.pass="your-app-password"

# SendGrid
firebase functions:config:set sendgrid.api_key="your-api-key"
```

### Customization
- Modify email templates in `functions/index.js`
- Adjust OTP expiration time (currently 5 minutes)
- Change OTP length (currently 6 digits)

## 🧪 Testing

### Local Testing
```bash
firebase emulators:start --only functions
```

### Production Testing
1. Deploy functions: `firebase deploy --only functions`
2. Test forgot password flow in your app
3. Check Firebase Console for function logs

## 📊 Monitoring

### View Logs
```bash
firebase functions:log
```

### Firebase Console
- Go to Functions section
- Monitor execution count and errors
- Check Firestore for OTP records

## 🚨 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check email service credentials
   - Verify Firebase Functions config
   - Check function logs

2. **OTP not found**
   - Ensure Firestore rules allow Functions access
   - Check if OTP expired (5 minutes)

3. **User not found**
   - Verify user exists in Firebase Auth
   - Check email format

4. **Permission denied**
   - Verify Firebase project permissions
   - Check billing status

### Debug Steps
1. Check Firebase Console → Functions → Logs
2. Verify Firestore → OTPs collection
3. Test email service independently
4. Check Firebase Auth users

## 🔄 Migration from Simulated OTP

The old simulated OTP system has been completely replaced:
- ❌ Removed: `generateOTP()`, `checkEmailExists()`, `sendOTPEmail()`
- ❌ Removed: Simulated delays and alerts
- ✅ Added: Real Firebase Cloud Functions
- ✅ Added: Professional email sending
- ✅ Added: Proper error handling

## 📈 Production Considerations

1. **Email Service**: Use SendGrid/Mailgun for production
2. **Rate Limiting**: Implement to prevent abuse
3. **Monitoring**: Set up alerts for function failures
4. **Security**: Consider adding CAPTCHA
5. **Performance**: Monitor function execution times

## 🎯 Next Steps

1. **Deploy Functions**: `firebase deploy --only functions`
2. **Test Flow**: Try forgot password in your app
3. **Monitor**: Check Firebase Console for any issues
4. **Customize**: Modify email templates if needed

## 📞 Support

If you encounter issues:
1. Check Firebase Console logs
2. Verify email service configuration
3. Test functions locally first
4. Check Firestore security rules

---

**🎉 Your OTP-based password reset is now ready!**

The system will send professional emails with OTPs, verify them securely, and reset passwords using Firebase Admin SDK.
