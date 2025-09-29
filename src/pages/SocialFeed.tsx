import React, { useEffect, useState } from 'react';
import { ChevronLeft, Heart, MessageCircle, Share2, MoreVertical, Users, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { BASE_URL } from '../services/api';

interface FeedItem {
  id: number;
  author: string;
  avatar: string;
  category: string;
  question: string;
  description: string;
  image: string;
  pollOptions: string[];
  responses: number;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  trending: boolean;
}

interface SocialFeedProps {
  onBack: () => void;
}

const feedItems: FeedItem[] = [
  {
    id: 1,
    author: 'Marie L.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'La musique',
    question: 'Comment percevez-vous l\'évolution de la musique de notre île ?',
    description: 'Je m\'interroge sur les changements dans les goûts musicaux locaux ces dernières années. Qu\'en pensez-vous ?',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    pollOptions: ['Elle s\'améliore beaucoup', 'Elle reste stable', 'Elle se dégrade', 'Je ne sais pas'],
    responses: 156,
    likes: 89,
    comments: 23,
    shares: 12,
    timeAgo: 'il y a 2h',
    trending: true
  },
  {
    id: 2,
    author: 'Jean-Paul M.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'L\'IA',
    question: 'Pensez-vous que l\'IA va révolutionner notre quotidien ?',
    description: 'L\'intelligence artificielle progresse rapidement. Comment voyez-vous son impact sur notre vie de tous les jours ?',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    pollOptions: ['Oui, complètement', 'Partiellement', 'Très peu', 'Pas du tout'],
    responses: 234,
    likes: 145,
    comments: 67,
    shares: 34,
    timeAgo: 'il y a 4h',
    trending: true
  },
  {
    id: 3,
    author: 'Sophie R.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'L\'inflation',
    question: 'Quel pourcentage de votre budget consacrez-vous à l\'alimentation ?',
    description: 'Avec l\'inflation actuelle, j\'aimerais connaître la répartition des budgets familiaux pour l\'alimentation.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    pollOptions: ['Moins de 20%', '20-30%', '30-40%', 'Plus de 40%'],
    responses: 189,
    likes: 76,
    comments: 45,
    shares: 18,
    timeAgo: 'il y a 6h',
    trending: false
  },
  {
    id: 4,
    author: 'David K.',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'La visite',
    question: 'Que pensez-vous de la nouvelle politique de visite ?',
    description: 'Les nouvelles mesures concernant les visites ont été mises en place. Votre avis nous intéresse.',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    pollOptions: ['Très satisfaisante', 'Satisfaisante', 'Peu satisfaisante'],
    responses: 98,
    likes: 54,
    comments: 29,
    shares: 8,
    timeAgo: 'il y a 8h',
    trending: false
  },
  {
    id: 5,
    author: 'Isabelle T.',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Environnement',
    question: 'Comment réduire notre impact environnemental au quotidien ?',
    description: 'Partageons nos astuces pour adopter un mode de vie plus respectueux de l\'environnement.',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
    pollOptions: ['Réduire les déchets', 'Utiliser les transports verts', 'Consommer local', 'Économiser l\'énergie'],
    responses: 267,
    likes: 198,
    comments: 78,
    shares: 45,
    timeAgo: 'il y a 12h',
    trending: true
  },
  {
    id: 6,
    author: 'Thomas B.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Transport',
    question: 'Quels moyens de transport utilisez-vous le plus ?',
    description: 'Étude sur les habitudes de déplacement dans notre région. Votre participation compte !',
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
    pollOptions: ['Voiture personnelle', 'Transports en commun', 'Vélo/Marche'],
    responses: 145,
    likes: 87,
    comments: 34,
    shares: 16,
    timeAgo: 'il y a 1j',
    trending: false
  }
];

export function SocialFeed({ onBack }: SocialFeedProps) {
  const [filter, setFilter] = useState('all');
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/questions`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data.success && data.questions) {
          setQuestions(data.questions);
          console.log("Questions from API:", data.questions);
        } else {
          console.log("No questions found in API response");
          setQuestions([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...Array.from(new Set(feedItems.map(item => item.category)))];

  const filteredItems = filter === 'all' 
    ? feedItems 
    : feedItems.filter(item => item.category === filter);

  const handlePollAnswer = (questionId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
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
          <h1 className="text-2xl font-bold text-gray-900">Mes questions</h1>
          <p className="text-gray-600">Créez vos sondages et partagez vos résultats sur les réseaux sociaux</p>
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
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Toutes' : category}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading API data...</span>
        </div>
      )}

      {/* API Data Display */}
      {!loading && (
        <div className="space-y-4">
          

          {/* Display API Questions */}
          <div className="space-y-4">
            {questions.map((question: any) => (
              <div key={question._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Question Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{question.author}</span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-500 text-sm">
                          {question.publishedAt ? new Date(question.publishedAt).toLocaleDateString() : 'Draft'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{question.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{question.description}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {question.tags?.map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {question.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.status === 'published' ? 'bg-green-100 text-green-800' :
                        question.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.status}
                      </span>
                    </div>
                  </div>

                  {/* Question Image */}
                  {question.image && (
                    <div className="mb-3">
                      <img
                        src={question.image}
                        alt={question.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Poll Options Preview */}
                  <div className="space-y-2 mb-4">
                    {question.options?.map((option: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{option.text}</span>
                        <span className="text-xs text-gray-500">{option.votes} votes</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{question.totalVotes} answers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{question.totalLikes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{question.totalComments}</span>
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>

          {/* Empty State for API */}
          {questions.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions from API</h3>
              <p className="text-gray-600">No questions found in the API response</p>
            </div>
          )}
        </div>
      )}

      

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question trouvée</h3>
          <p className="text-gray-600">
            Essayez de sélectionner une autre catégorie
          </p>
        </div>
      )}
    </div>
  );
}