import { useState, useEffect } from 'react';
import { BookOpen, Star, Clock, Users, Target } from 'lucide-react';
import { studiesAPI, Study } from '../services/api';

export function Studies() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Load studies from API
  useEffect(() => {
    loadStudies();
  }, []);

  const loadStudies = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await studiesAPI.getAllStudies();
      setStudies(response.data.studies || []);
    } catch (err: any) {
      console.error('Error loading studies:', err);
      setError(err.message || 'Failed to load studies');
      
      // Fallback to mock data if API fails
      const mockStudies: Study[] = [
        {
          _id: '1',
          title: 'Satisfaction client e-commerce',
          description: 'Évaluation de la satisfaction des clients pour le premier trimestre',
          reward: 150,
          duration: 25,
          status: 'available',
          participants: 156,
          targetParticipants: 200,
          maxParticipants: 200,
          category: 'Market Research',
          image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
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
          maxParticipants: 150,
          category: 'Social Research',
          image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
        }
      ];
      
      setStudies(mockStudies);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudies = studies.filter(study => {
    if (filter === 'all') return true;
    return study.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'available': return 'Disponible';
      case 'completed': return 'Terminé';
      case 'paused': return 'En pause';
      case 'draft': return 'Brouillon';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Études disponibles</h1>
        <p className="text-gray-600">Participez aux études et gagnez des points</p>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Études actives</h3>
            <div className="text-3xl font-bold">{studies.filter(s => s.status === 'active' || s.status === 'available').length}</div>
            <p className="text-orange-100 text-sm mt-1">
              Participez maintenant et gagnez des points !
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-full">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Tous' },
          { key: 'active', label: 'Actifs' },
          { key: 'available', label: 'Disponibles' },
          { key: 'completed', label: 'Terminés' }
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Chargement des études...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Erreur: {error}</p>
          <button 
            onClick={loadStudies}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Studies Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredStudies.map((study) => (
            <div key={study._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={study.image}
                alt={study.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(study.status)}`}>
                  {getStatusText(study.status)}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{study.title}</h3>
              </div>
              
              <p className="text-gray-600 text-xs mb-3 leading-relaxed">{study.description}</p>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-orange-600">
                    <Star className="h-3 w-3 mr-1" />
                    <span className="font-bold">{study.reward} points</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{study.duration} min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{study.participants}/{study.targetParticipants}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Target className="h-3 w-3 mr-1" />
                    <span>{study.category}</span>
                  </div>
                </div>
              </div>
              
              <button 
                disabled={study.status === 'completed' || study.status === 'paused'}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  study.status === 'completed' || study.status === 'paused'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {study.status === 'completed' ? 'Terminé' : 
                 study.status === 'paused' ? 'En pause' : 'Participer'}
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Popular Categories */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories populaires</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Market Research', icon: BookOpen, color: 'from-blue-400 to-blue-600' },
            { name: 'Social Research', icon: Users, color: 'from-green-400 to-green-600' },
            { name: 'Digital', icon: Target, color: 'from-purple-400 to-purple-600' },
            { name: 'Alimentation', icon: Star, color: 'from-orange-400 to-orange-600' }
          ].map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className={`bg-gradient-to-br ${category.color} rounded-xl p-4 text-white hover:scale-105 transition-transform`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-xs font-medium">{category.name}</div>
              </button>
            );
          })}
        </div>
      </section>

      {!loading && !error && filteredStudies.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
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