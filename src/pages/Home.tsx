import { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { studiesAPI, Study } from '../services/api';

// Study interface is now imported from api.ts

interface HomeProps {
  onNavigateToStudies: () => void;
  onNavigateToEcho: () => void;
}

// Default studies for fallback
const defaultStudies = [
  {
    _id: '1',
    title: 'Satisfaction client e-commerce',
    description: 'Évaluation de la satisfaction des clients pour le premier trimestre',
    reward: 150,
    duration: 25,
    status: 'active',
    participants: 156,
    targetParticipants: 200,
    category: 'Market Research',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    _id: '2',
    title: 'Habitudes de transport urbain',
    description: 'Analyse des moyens de transport utilisés en ville',
    reward: 125,
    duration: 20,
    status: 'active',
    participants: 89,
    targetParticipants: 150,
    category: 'Social Research',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    _id: '3',
    title: 'Préférences culinaires régionales',
    description: 'Étude sur les habitudes alimentaires locales',
    reward: 175,
    duration: 30,
    status: 'active',
    participants: 234,
    targetParticipants: 300,
    category: 'Behavioral Research',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.pexels.com/photos/162553/tools-construct-craft-repair-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
  }
];

const voiceEchos = [
  {
    id: 1,
    category: 'L\'emploi',
    title: 'L\'engagement ne s\'improvise pas en mes...',
    percentage: '50%',
    description: 'POLITIQUE : N\'EST PAS TOUJOURS SIMPLEMENT',
    color: 'from-purple-600 to-indigo-700',
    textColor: 'text-white'
  },
  {
    id: 2,
    category: 'Consommation',
    title: 'Le baromètre de confiance des consommateurs',
    percentage: '55.7%',
    description: 'UN POINT BAISSE DE L\'INDICE CONFIANCE DES CONSOMMATEURS',
    color: 'from-teal-500 to-blue-600',
    textColor: 'text-white'
  }
];

export function Home({ onNavigateToStudies, onNavigateToEcho }: HomeProps) {
  const [activeStudies, setActiveStudies] = useState<Study[]>(defaultStudies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await studiesAPI.getAllStudies();
        setActiveStudies(response.data.studies || defaultStudies);
      } catch (error) {
        console.error('Error fetching studies:', error);
        setActiveStudies(defaultStudies);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, []);
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Promotional Banner */}
      <div className="relative bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl p-6 text-white overflow-hidden min-h-[140px]">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">30 EUROS À GAGNER</h2>
          <p className="text-pink-100 mb-4">Votre avis compte et peut vous rapporter gros !</p>
          <div className="flex items-center text-sm">
            <span className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              🎮 Jeu en cours
            </span>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-32 opacity-30">
          <img 
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="People celebrating"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
        <div className="absolute bottom-4 left-6 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Active Studies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Études en cours</h3>
          {activeStudies.length > 5 && (
            <button 
              onClick={onNavigateToStudies}
              className="text-orange-500 hover:text-orange-600 transition-colors flex items-center"
            >
              <span className="text-sm mr-1">Voir tout</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading studies...</div>
            </div>
          ) : (
            activeStudies.slice(0, 5).map((study) => (
              <div
                key={study._id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
              <div className="flex items-start space-x-4">
                <img 
                  src={study.image}
                  alt={study.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{study.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      study.status === 'active' || study.status === 'available' ? 'bg-green-100 text-green-800' :
                      study.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      study.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {study.status === 'active' || study.status === 'available' ? 'Disponible' :
                       study.status === 'draft' ? 'Brouillon' :
                       study.status === 'completed' ? 'Terminé' : 'En cours'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mb-2">{study.description}</p>
                  
                  {/* Mobile-friendly info layout */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <span className="mr-1">⏱️</span>
                          {study.duration}min
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">👥</span>
                          {study.participants}
                        </span>
                      </div>
                      <span className="text-green-600 font-medium text-sm">+{study.reward} points</span>
                    </div>
                    <div className="flex justify-end">
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors">
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
      </section>

      {/* Voice Echo */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">L'écho de vos voix</h3>
          <button 
            onClick={() => onNavigateToEcho()}
            className="text-orange-500 hover:text-orange-600 transition-colors flex items-center"
          >
            <span className="text-sm mr-1">Voir tout</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {voiceEchos.map((echo) => (
            <div
              key={echo.id}
              className={`relative bg-gradient-to-br ${echo.color} rounded-xl p-4 ${echo.textColor} overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm opacity-90">{echo.category}</span>
                  <span className="text-3xl font-bold">{echo.percentage}</span>
                </div>
                <p className="text-sm leading-relaxed">{echo.title}</p>
              </div>
              
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
                <TrendingUp className="w-full h-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Votre impact</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">12</div>
            <div className="text-xs text-gray-600">Études complétées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">€24</div>
            <div className="text-xs text-gray-600">Gains totaux</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">3.4k</div>
            <div className="text-xs text-gray-600">Points cumulés</div>
          </div>
        </div>
      </section>
    </div>
  );
}