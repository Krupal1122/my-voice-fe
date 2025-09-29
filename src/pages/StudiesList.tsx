import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Users, Star } from 'lucide-react';
import { BASE_URL } from '../services/api';

interface Study {
  _id: string;
  title: string;
  description: string;
  reward: number;
  duration: number;
  status: string;
  participants: number;
  targetParticipants?: number;
  maxParticipants?: number;
  category: string;
  createdAt: string;
  deadline?: string;
  endDate?: string;
  startDate?: string;
  image?: string;
  requirements?: string;
  instructions?: string;
  tags?: string[];
  isActive?: boolean;
}

interface StudiesListProps {
  onBack: () => void;
}

// Default studies for fallback
const defaultStudies: Study[] = [
  {
    _id: '1',
    title: 'Satisfaction client e-commerce',
    description: 'Évaluation de la satisfaction des clients pour le premier trimestre',
    reward: 150,
    duration: 25,
    status: 'available',
    participants: 156,
    targetParticipants: 200,
    category: 'Market Research',
    createdAt: new Date().toISOString(),
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    _id: '2',
    title: 'Habitudes de transport urbain',
    description: 'Analyse des moyens de transport utilisés en ville',
    reward: 125,
    duration: 20,
    status: 'available',
    participants: 89,
    targetParticipants: 150,
    category: 'Social Research',
    createdAt: new Date().toISOString(),
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export function StudiesList({ onBack }: StudiesListProps) {
  const [filter, setFilter] = useState('all');
  const [allStudies, setAllStudies] = useState<Study[]>(defaultStudies);
  const [loading, setLoading] = useState(true);

  // Fetch studies from API
  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/studies`);
        if (response.ok) {
          const data = await response.json();
          setAllStudies(data.studies || defaultStudies);
        } else {
          console.error('Failed to fetch studies, using defaults');
          setAllStudies(defaultStudies);
        }
      } catch (error) {
        console.error('Error fetching studies:', error);
        setAllStudies(defaultStudies);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, []);

  const filteredStudies = allStudies.filter(study => {
    if (filter === 'all') return true;
    return study.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'active': return 'Disponible';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'draft': return 'Brouillon';
      default: return 'Inconnu';
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Études en cours</h1>
          <p className="text-gray-600">Participez aux études disponibles</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'available', label: 'Disponibles' },
          { key: 'in-progress', label: 'En cours' },
          { key: 'completed', label: 'Terminées' }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === item.key
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Studies List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading studies...</div>
          </div>
        ) : (
          filteredStudies.map((study) => (
            <div
              key={study._id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
            <div className="flex items-start space-x-4">
              <img 
                src={study.image}
                alt={study.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-base">{study.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(study.status)}`}>
                    {getStatusText(study.status)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{study.description}</p>
                
                {/* Mobile-friendly layout */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {study.duration}min
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {study.participants}
                      </span>
                    </div>
                    <span className="text-green-600 font-medium text-base">+{study.reward} points</span>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                      Participer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {filteredStudies.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune étude trouvée</h3>
          <p className="text-gray-600">
            Essayez de modifier vos filtres ou revenez plus tard
          </p>
        </div>
      )}
    </div>
  );
}