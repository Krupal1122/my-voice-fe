import React from 'react';
import { Bell, Gift, Star, Info, Clock } from 'lucide-react';

interface Notification {
  id: number;
  type: 'reward' | 'study' | 'info' | 'reminder';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'reward',
    title: 'Récompense reçue !',
    message: 'Vous avez gagné 20€ pour votre participation à l\'étude "Satisfaction client"',
    date: '2024-03-15T10:30:00',
    isRead: false
  },
  {
    id: 2,
    type: 'study',
    title: 'Nouvelle étude disponible',
    message: 'Une étude sur les habitudes alimentaires est maintenant disponible',
    date: '2024-03-14T14:20:00',
    isRead: true
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Rappel d\'étude',
    message: 'N\'oubliez pas de terminer votre étude en cours avant demain',
    date: '2024-03-13T09:15:00',
    isRead: true
  }
];

export function Notifications() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'reward': return <Gift className="h-5 w-5 text-green-500" />;
      case 'study': return <Star className="h-5 w-5 text-blue-500" />;
      case 'info': return <Info className="h-5 w-5 text-gray-500" />;
      case 'reminder': return <Clock className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Restez informé de vos activités</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`bg-white rounded-xl p-4 shadow-sm border transition-colors ${
              notification.isRead ? 'border-gray-200' : 'border-orange-200 bg-orange-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className={`font-medium ${notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatDate(notification.date)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
          <p className="text-gray-600">
            Vos notifications apparaîtront ici
          </p>
        </div>
      )}
    </div>
  );
}