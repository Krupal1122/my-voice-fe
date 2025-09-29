import { useState, useEffect } from 'react';
import { Gift, Star, ShoppingCart, Heart, Zap } from 'lucide-react';
import { BASE_URL } from '../services/api';

interface Gift {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  image: string;
  availability: 'available' | 'limited' | 'out-of-stock';
  originalPrice?: number;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function Studies() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Load gifts from API
  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${BASE_URL}/api/gifts`);
      if (!response.ok) {
        throw new Error('Failed to fetch gifts');
      }
      
      const data = await response.json();
      if (data.success) {
        setGifts(data.gifts);
      } else {
        throw new Error(data.message || 'Failed to load gifts');
      }
    } catch (err: any) {
      console.error('Error loading gifts:', err);
      setError(err.message || 'Failed to load gifts');
      
      // Fallback to mock data if API fails
      const mockGifts: Gift[] = [
        {
          _id: '1',
          title: 'Bon d\'achat Amazon 20€',
          description: 'Utilisable sur tous les produits Amazon',
          points: 2000,
          category: 'E-commerce',
          image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
          availability: 'available',
          originalPrice: 20,
          discount: 0
        },
        {
          _id: '2',
          title: 'Carte cadeau Fnac 15€',
          description: 'Valable en magasin et sur fnac.com',
          points: 1500,
          category: 'Culture',
          image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400',
          availability: 'limited',
          originalPrice: 15,
          discount: 10
        },
        {
          _id: '3',
          title: 'Abonnement Spotify 1 mois',
          description: 'Profitez de la musique en illimité',
          points: 1000,
          category: 'Streaming',
          image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
          availability: 'available',
          originalPrice: 10,
          discount: 0
        }
      ];
      
      setGifts(mockGifts);
    } finally {
      setLoading(false);
    }
  };

  const filteredGifts = gifts.filter(gift => {
    if (filter === 'all') return true;
    return gift.availability === filter;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Disponible';
      case 'limited': return 'Stock limité';
      case 'out-of-stock': return 'Épuisé';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">L'espace cadeau</h1>
        <p className="text-gray-600">Échangez vos points contre des cadeaux</p>
      </div>

      {/* Points Balance */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Vos points cumulés</h3>
            <div className="text-3xl font-bold">3,400</div>
            <p className="text-orange-100 text-sm mt-1">
              Continuez à participer pour gagner plus de points !
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-full">
            <Star className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Tous' },
          { key: 'available', label: 'Disponibles' },
          { key: 'limited', label: 'Stock limité' },
          { key: 'out-of-stock', label: 'Épuisés' }
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
          <span className="ml-3 text-gray-600">Chargement des cadeaux...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Erreur: {error}</p>
          <button 
            onClick={loadGifts}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Gifts Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredGifts.map((gift) => (
            <div key={gift._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={gift.image}
                alt={gift.title}
                className="w-full h-32 object-cover"
              />
              {gift.discount && gift.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{gift.discount}%
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(gift.availability)}`}>
                  {getAvailabilityText(gift.availability)}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{gift.title}</h3>
              </div>
              
              <p className="text-gray-600 text-xs mb-3 leading-relaxed">{gift.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-orange-600">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="font-bold text-sm">{gift.points.toLocaleString()}</span>
                  </div>
                  {gift.originalPrice && (
                    <div className="text-xs text-gray-500">
                      (≈ {gift.originalPrice}€)
                    </div>
                  )}
                </div>
                
                <button 
                  disabled={gift.availability === 'out-of-stock'}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    gift.availability === 'out-of-stock'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {gift.availability === 'out-of-stock' ? 'Épuisé' : 'Échanger'}
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Catégorie: {gift.category}
              </div>
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
            { name: 'E-commerce', icon: ShoppingCart, color: 'from-blue-400 to-blue-600' },
            { name: 'Restauration', icon: Heart, color: 'from-red-400 to-red-600' },
            { name: 'Culture', icon: Gift, color: 'from-purple-400 to-purple-600' },
            { name: 'Streaming', icon: Zap, color: 'from-green-400 to-green-600' }
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

      {!loading && !error && filteredGifts.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cadeau trouvé</h3>
          <p className="text-gray-600">
            Essayez de modifier vos filtres ou revenez plus tard
          </p>
        </div>
      )}
    </div>
  );
}