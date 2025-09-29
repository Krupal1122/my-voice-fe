import React from 'react';
import { Calendar, Euro, Clock, CheckCircle } from 'lucide-react';

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  reward: number;
  duration: number;
  status: 'completed' | 'pending' | 'cancelled';
}

const history: HistoryItem[] = [
  {
    id: 1,
    title: 'Satisfaction client e-commerce',
    date: '2024-03-15',
    reward: 20,
    duration: 25,
    status: 'completed'
  },
  {
    id: 2,
    title: 'Habitudes de transport urbain',
    date: '2024-03-12',
    reward: 15,
    duration: 20,
    status: 'completed'
  },
  {
    id: 3,
    title: 'Préférences culinaires régionales',
    date: '2024-03-10',
    reward: 25,
    duration: 30,
    status: 'pending'
  }
];

export function History() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const totalEarnings = history
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.reward, 0);

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon historique</h1>
        <p className="text-gray-600">Retrouvez toutes vos participations</p>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Vos gains totaux</h3>
        <div className="text-3xl font-bold">{totalEarnings}€</div>
        <p className="text-orange-100 text-sm mt-1">
          Sur {history.filter(item => item.status === 'completed').length} études complétées
        </p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex-1">{item.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {getStatusText(item.status)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{item.duration}min</span>
                </div>
              </div>
              
              <div className="flex items-center text-green-600 font-medium">
                <Euro className="h-4 w-4 mr-1" />
                <span>{item.reward}€</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune participation</h3>
          <p className="text-gray-600">
            Votre historique apparaîtra ici après votre première étude
          </p>
        </div>
      )}
    </div>
  );
}