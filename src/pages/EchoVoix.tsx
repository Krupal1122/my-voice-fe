import React, { useState } from 'react';
import { ChevronLeft, TrendingUp, Users, MessageCircle, Heart, Share2 } from 'lucide-react';

interface EchoItem {
  id: number;
  category: string;
  title: string;
  percentage: string;
  description: string;
  color: string;
  textColor: string;
  participants: number;
  comments: number;
  likes: number;
  date: string;
}

interface EchoVoixProps {
  onBack: () => void;
}

const echoItems: EchoItem[] = [
  {
    id: 1,
    category: 'L\'emploi',
    title: 'L\'engagement ne s\'improvise pas en mes...',
    percentage: '50%',
    description: 'POLITIQUE : N\'EST PAS TOUJOURS SIMPLEMENT',
    color: 'from-purple-600 to-indigo-700',
    textColor: 'text-white',
    participants: 1234,
    comments: 89,
    likes: 456,
    date: '15 Mars 2024'
  },
  {
    id: 2,
    category: 'Consommation',
    title: 'Le baromètre de confiance des consommateurs',
    percentage: '55.7%',
    description: 'UN POINT BAISSE DE L\'INDICE CONFIANCE DES CONSOMMATEURS',
    color: 'from-teal-500 to-blue-600',
    textColor: 'text-white',
    participants: 987,
    comments: 67,
    likes: 234,
    date: '12 Mars 2024'
  },
  {
    id: 3,
    category: 'Environnement',
    title: 'L\'impact du changement climatique sur notre île',
    percentage: '78%',
    description: 'PRÉOCCUPATION CROISSANTE POUR L\'ENVIRONNEMENT LOCAL',
    color: 'from-green-500 to-emerald-600',
    textColor: 'text-white',
    participants: 1567,
    comments: 123,
    likes: 789,
    date: '10 Mars 2024'
  },
  {
    id: 4,
    category: 'Éducation',
    title: 'La digitalisation de l\'enseignement',
    percentage: '62%',
    description: 'ADAPTATION AUX NOUVELLES TECHNOLOGIES ÉDUCATIVES',
    color: 'from-orange-500 to-red-600',
    textColor: 'text-white',
    participants: 856,
    comments: 45,
    likes: 312,
    date: '8 Mars 2024'
  },
  {
    id: 5,
    category: 'Santé',
    title: 'L\'accès aux soins de santé en région',
    percentage: '43%',
    description: 'DÉFIS DE L\'ACCESSIBILITÉ AUX SERVICES MÉDICAUX',
    color: 'from-pink-500 to-rose-600',
    textColor: 'text-white',
    participants: 1123,
    comments: 78,
    likes: 445,
    date: '5 Mars 2024'
  },
  {
    id: 6,
    category: 'Transport',
    title: 'Mobilité urbaine et transports en commun',
    percentage: '67%',
    description: 'AMÉLIORATION DES INFRASTRUCTURES DE TRANSPORT',
    color: 'from-blue-500 to-cyan-600',
    textColor: 'text-white',
    participants: 743,
    comments: 56,
    likes: 289,
    date: '3 Mars 2024'
  }
];

export function EchoVoix({ onBack }: EchoVoixProps) {
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...Array.from(new Set(echoItems.map(item => item.category)))];

  const filteredItems = filter === 'all' 
    ? echoItems 
    : echoItems.filter(item => item.category === filter);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">L'écho de ta voix</h1>
          <p className="text-gray-600">Découvrez l'impact de vos opinions</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === category
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Toutes' : category}
          </button>
        ))}
      </div>

      {/* Echo Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`relative bg-gradient-to-br ${item.color} rounded-xl p-6 ${item.textColor} overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm opacity-90 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {item.category}
                </span>
                <span className="text-4xl font-bold">{item.percentage}</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm opacity-90 mb-4 leading-relaxed">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {item.participants.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {item.comments}
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {item.likes}
                  </span>
                </div>
                <span className="opacity-75">{item.date}</span>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white border-opacity-20">
                <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">J'aime</span>
                </button>
                <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">Commenter</span>
                </button>
                <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Partager</span>
                </button>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <TrendingUp className="w-full h-full" />
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun écho trouvé</h3>
          <p className="text-gray-600">
            Essayez de sélectionner une autre catégorie
          </p>
        </div>
      )}
    </div>
  );
}