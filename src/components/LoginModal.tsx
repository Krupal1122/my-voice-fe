import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, User, Shield, KeyRound, Timer, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, db } from '../auth/firebase';
import { setDoc, doc } from '../auth/firebase';

interface LoginModalProps {
  onClose: () => void;
}

type ModalView = 'login' | 'signup' | 'forgot' | 'otp-verify';

export function LoginModal({ onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>('login');
  
  // OTP and Password Reset States
  const [otp, setOtp] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Save current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scrolling when modal closes
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with email and password
      const trimmedEmail = email.trim();
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      console.log('User signed in successfully:', userCredential.user);
      setLoading(false);
      onClose();
    } catch (error: any) {
      setLoading(false);
      // Handle Firebase-specific errors
      if (typeof error === 'object' && error !== null && 'code' in error) {
        // @ts-ignore
        switch (error.code) {
          case 'auth/user-not-found':
            setError('Aucun compte trouvé avec cette adresse email.');
            break;
          case 'auth/wrong-password':
            setError('Mot de passe incorrect.');
            break;
          case 'auth/invalid-credential':
            setError('Email ou mot de passe incorrect.');
            break;
          case 'auth/invalid-email':
            setError('Adresse email invalide.');
            break;
          case 'auth/user-disabled':
            setError('Ce compte a été désactivé.');
            break;
          case 'auth/too-many-requests':
            setError('Trop de tentatives. Veuillez réessayer plus tard.');
            break;
          default:
            // Surface the underlying error message when available to help debugging
            console.error('Login error:', error);
            // @ts-ignore
            setError(error?.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
        }
      } else {
        setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!acceptTerms) {
      setError('Vous devez accepter les Conditions Générales d\'Utilisation');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
  
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
  
    setLoading(true);
    try {
      // Firebase Auth user create
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Update profile (Firebase Auth)
      await updateProfile(user, {
        displayName: username,
      });
  
      // Save user data using UID as document ID to match Firestore security rules
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username,
        email,
        createdAt: new Date(),
      });
  
      console.log('User signed up and saved in Firestore:', user);
      setLoading(false);
      onClose();
    } catch (error: any) {
      setLoading(false);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Cet email est déjà utilisé.');
          break;
        default:
          console.error('Signup error:', error);
          setError(error?.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };
  


  // Handle forgot password - send OTP via backend API
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    console.log("Attempting to send OTP for email:", email);
  
    // Validate email
    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email');
      setLoading(false);
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      setLoading(false);
      return;
    }
  
    try {
      // Call backend API to send OTP
      const response = await fetch('http://localhost:5000/api/otp/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.ok) {
        setResetEmail(email);
        setLoading(false);
        setCurrentView('otp-verify');
        setError('');
      } else {
        setError(data.message || 'Erreur lors de l\'envoi du code');
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.error('OTP generation error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    }
  };
  // Handle OTP verification
  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate OTP and passwords
    if (otp.length !== 6) {
      setError('Veuillez entrer un code de vérification à 6 chiffres');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      // Call backend API to verify OTP and reset password
      const response = await fetch('http://localhost:5000/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail,
          otp: otp,
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setLoading(false);
        
        // Show success message
        alert(`✅ Mot de passe mis à jour avec succès!\n\nVous pouvez maintenant vous connecter avec votre nouveau mot de passe.`);
        
        // Clear all reset states and return to login
        setOtp('');
        setResetEmail('');
        setNewPassword('');
        setConfirmNewPassword('');
        setCurrentView('login');
        setError('');
      } else {
        setError(data.message || 'Erreur lors de la vérification du code. Veuillez réessayer.');
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.error('OTP verification error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    }
  };


  // Resend OTP
  const handleResendOTP = async () => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Call backend API to resend OTP
      const response = await fetch('http://localhost:5000/api/otp/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (data.ok) {
        setLoading(false);  
        alert('📧 Nouveau code de vérification envoyé!');
      } else {
        setError(data.message || 'Erreur lors de l\'envoi. Veuillez réessayer.');
        setLoading(false);
      }
    } catch (error: any) {
      setError('Erreur de connexion. Veuillez réessayer.');
      setLoading(false);
      console.error('Resend OTP error:', error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2"
              >
                Connexion
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600"
              >
                Connectez-vous à votre compte MyVoice974
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  {error}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="pl-10 focus:ring-orange-500"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="pl-10 pr-10 focus:ring-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center space-y-4"
            >
              <button
                onClick={() => setCurrentView('forgot')}
                className="text-sm text-orange-600 hover:text-orange-700 underline"
              >
                Mot de passe oublié ?
              </button>

              <div className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <button
                  onClick={() => setCurrentView('signup')}
                  className="text-orange-600 hover:text-orange-700 font-medium underline"
                >
                  Créer un compte
                </button>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'signup':
        return (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <UserPlus className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2"
              >
                Créer un compte
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600"
              >
                Rejoignez MyVoice974 et commencez à gagner des points
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  {error}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Identifiant
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Votre identifiant"
                    className="pl-10 focus:ring-orange-500"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="pl-10 focus:ring-orange-500"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="pl-10 pr-10 focus:ring-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    className="pl-10 pr-10 focus:ring-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-start space-x-3"
              >
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="accept-terms" className="text-sm text-gray-700">
                  En cochant cette case, je reconnais avoir pris connaissance des{' '}
                  <button className="text-blue-600 hover:text-blue-700 underline font-medium">
                    Conditions Générales d'Utilisation
                  </button>
                  {' '}et je les accepte.
                </label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? 'Création...' : 'Créer mon compte'}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center"
            >
              <div className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-orange-600 hover:text-orange-700 font-medium underline"
                >
                  Se connecter
                </button>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'forgot':
        return (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2"
              >
                Mot de passe oublié
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600"
              >
                Entrez votre email pour recevoir un code de vérification
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  {error}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="pl-10 focus:ring-orange-500"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? 'Envoi...' : 'Envoyer le code'}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <button
                onClick={() => setCurrentView('login')}
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </button>
            </motion.div>
          </motion.div>
        );

      case 'otp-verify':
        return (
          <motion.div
            key="otp-verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2"
              >
                Vérification du code
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600"
              >
                Entrez le code à 6 chiffres envoyé à<br />
                <span className="font-semibold text-gray-800">{resetEmail}</span>
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  {error}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleOTPVerification} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                    }}
                    placeholder="123456"
                    className="pl-10 text-center text-lg font-mono tracking-widest focus:ring-orange-500"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500 flex items-center justify-center">
                  <Timer className="w-4 h-4 mr-1" />
                  Le code expire dans 5 minutes
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Votre nouveau mot de passe"
                    className="pl-10 pr-10 focus:ring-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    id="confirm-new-password"
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    className="pl-10 pr-10 focus:ring-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Password strength indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="bg-gray-50 rounded-lg p-3"
              >
                <p className="text-sm font-medium text-gray-700 mb-2">Critères du mot de passe:</p>
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center ${newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    Au moins 6 caractères
                  </div>
                  <div className={`flex items-center ${newPassword !== confirmNewPassword || !confirmNewPassword ? 'text-gray-400' : 'text-green-600'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${newPassword === confirmNewPassword && confirmNewPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    Les mots de passe correspondent
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6 || newPassword.length < 6 || newPassword !== confirmNewPassword}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Vérification...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <KeyRound className="w-4 h-4 mr-2" />
                      Vérifier et Réinitialiser
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center space-y-4"
            >
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Renvoyer le code
              </button>
              
              <div>
                <button
                  onClick={() => setCurrentView('forgot')}
                  className="inline-flex items-center text-gray-600 hover:text-gray-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Changer l'adresse email
                </button>
              </div>
            </motion.div>
          </motion.div>
        );

    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ 
          touchAction: 'none',
          overflow: 'hidden',
          overscrollBehavior: 'none'
        }}
      >
        {/* Backdrop with blur effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          style={{ touchAction: 'none' }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.5
          }}
          className="relative w-full max-w-md"
        >
          <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Content */}
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}