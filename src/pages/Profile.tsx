import React from 'react';
import { User, Settings, CreditCard, Shield, LogOut, Bell, ChevronRight } from 'lucide-react';

const profileData = {
  name: 'Marie Dubois',
  email: 'marie.dubois@email.com',
  joinDate: '2024-01-15',
  totalEarnings: 156,
  completedStudies: 12,
  level: 'Expert'
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
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800';
      case 'Avancé': return 'bg-blue-100 text-blue-800';
      case 'Débutant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(profileData.level)} bg-white bg-opacity-20 text-white`}>
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
          <div className="text-2xl font-bold text-purple-600">3.4k</div>
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
        <button className="w-full bg-white rounded-xl p-4 shadow-sm border border-red-200 hover:bg-red-50 transition-colors text-red-600">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium">Se déconnecter</h3>
              <p className="text-sm text-red-500">Déconnexion de votre compte</p>
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