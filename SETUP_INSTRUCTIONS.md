# Firebase OTP Setup Script

echo "🔐 Setting up Firebase OTP Password Reset..."

echo "📋 Step 1: Login to Firebase"
echo "Please run: firebase login"
echo "Then press any key to continue..."
 
echo ""
echo "📋 Step 2: Initialize Firebase Project"
echo "Please run: firebase init"
echo "Select: Functions, Firestore, Hosting (if needed)"
echo "Choose your existing Firebase project"

echo ""
echo "📋 Step 3: Install Functions Dependencies"
echo "Please run: cd functions && npm install"

echo ""
echo "📋 Step 4: Configure Email Service"
echo "For Gmail (Development):"
echo "firebase functions:config:set email.user=\"your-email@gmail.com\" email.pass=\"your-app-password\""
echo ""
echo "For SendGrid (Production):"
echo "firebase functions:config:set sendgrid.api_key=\"your-sendgrid-api-key\""

echo ""
echo "📋 Step 5: Deploy Functions"
echo "firebase deploy --only functions"

echo ""
echo "✅ After deployment, your OTP system will work!"
echo "The 'Erreur interne du serveur' error will be resolved."
