import { useState, useEffect } from 'react';
import { User, Settings, CreditCard, Shield, LogOut, Bell, ChevronRight } from 'lucide-react';
import { auth, db, signOut, onSnapshot, doc, updateDoc } from '../auth/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { getUserStats } from '../utils/userStats';

// User profile data interface
interface UserProfile {
  uid: string;
  name: string;
  email: string;
  joinDate: string;
  totalEarnings: number;
  completedStudies: number;
  level: string;
  totalPoints: number;
  lastActive?: string;
}

// Default profile data for new users
const defaultProfileData: UserProfile = {
  uid: '',
  name: 'Utilisateur',
  email: '',
  joinDate: new Date().toISOString(),
  totalEarnings: 0,
  completedStudies: 0,
  level: 'Débutant',
  totalPoints: 0
};

const menuItems = [
  {
    id: 'personal',
    icon: User,
    title: 'Informations personnelles',
    description: 'Gérez vos informations de profil'
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    description: 'Configurez vos préférences'
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Méthodes de paiement',
    description: 'Gérez vos moyens de paiement'
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Confidentialité et sécurité',
    description: 'Contrôlez vos données'
  },
  {
    id: 'settings',
    icon: Settings,
    title: 'Paramètres',
    description: 'Préférences de l\'application'
  }
];

export function Profile() {
  const [profileData, setProfileData] = useState<UserProfile>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        await loadUserProfile(user);
      } else {
        setCurrentUser(null);
        setProfileData(defaultProfileData);
        setIsDataLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user profile data from Firestore
  const loadUserProfile = async (user: FirebaseUser) => {
    try {
      setIsDataLoading(true);
      
      // Get user document from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      
      // Set up real-time listener for user data
      const unsubscribe = onSnapshot(userDocRef, async (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          
          // Calculate user statistics using utility function
          const stats = await getUserStats(user.uid);
          
          setProfileData({
            uid: user.uid,
            name: user.displayName || userData.username || 'Utilisateur',
            email: user.email || '',
            joinDate: userData.createdAt?.toDate ? userData.createdAt.toDate().toISOString() : new Date().toISOString(),
            totalEarnings: stats.totalEarnings,
            completedStudies: stats.completedStudies,
            level: stats.level,
            totalPoints: stats.totalPoints,
            lastActive: new Date().toISOString()
          });
        } else {
          // User document doesn't exist, create it
          await createUserProfile(user);
        }
        setIsDataLoading(false);
      }, (error) => {
        console.error('Error loading user profile:', error);
        setIsDataLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading user profile:', error);
      setIsDataLoading(false);
    }
  };

  // Create user profile if it doesn't exist
  const createUserProfile = async (user: FirebaseUser) => {
    try {
      const userData = {
        uid: user.uid,
        username: user.displayName || 'Utilisateur',
        email: user.email,
        createdAt: new Date(),
        totalEarnings: 0,
        completedStudies: 0,
        totalPoints: 0,
        level: 'Débutant'
      };

      await updateDoc(doc(db, 'users', user.uid), userData);
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };


  const formatPoints = (points: number) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}k`;
    }
    return points.toString();
  };

  const handleMenuClick = (itemId: string) => {
    console.log(`Navigating to ${itemId}`);
    // TODO: Implement navigation logic
    // Example: navigate(`/profile/${itemId}`);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while data is being fetched
  if (isDataLoading) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="h-6 bg-white bg-opacity-20 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded animate-pulse mb-2"></div>
              <div className="h-5 bg-white bg-opacity-20 rounded animate-pulse w-24"></div>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500">
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!currentUser) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Connectez-vous</h2>
          <p className="text-orange-100 text-sm">Connectez-vous pour accéder à votre profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profileData.name}</h2>
            <p className="text-orange-100 text-sm">{profileData.email}</p>
            <div className="flex items-center mt-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                Niveau {profileData.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{profileData.totalEarnings}€</div>
          <div className="text-xs text-gray-600 mt-1">Gains totaux</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{profileData.completedStudies}</div>
          <div className="text-xs text-gray-600 mt-1">Études terminées</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{formatPoints(profileData.totalPoints)}</div>
          <div className="text-xs text-gray-600 mt-1">Points cumulés</div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Account Actions */}
      <div className="space-y-2">
        <button 
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full bg-white rounded-xl p-4 shadow-sm border border-red-200 hover:bg-red-50 transition-colors text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium">
                {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
              </h3>
              <p className="text-sm text-red-500">
                {isLoading ? 'Veuillez patienter...' : 'Déconnexion de votre compte'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Version Info */}
      <div className="text-center text-gray-500 text-sm">
        <p>MyVoice974 v2.1.0</p>
        <p className="mt-1">Membre depuis {new Date(profileData.joinDate).toLocaleDateString('fr-FR')}</p>
      </div>
    </div>
  );
}