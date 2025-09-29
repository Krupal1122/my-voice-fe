import React from 'react';
import { Heart, Gift, Calendar, TrendingUp, Users, Star } from 'lucide-react';

interface BoosteTaVoixProps {
  onNavigateToSocialFeed: () => void;
}

const promotionalOffer = {
  title: '2 BILLETS D\'AVION À GAGNER PAR AN',
  subtitle: 'Crée ton étude',
  description: 'Gagne des prix en créant tes propres sondages et en participant aux études communautaires. Plus tu participes, plus tu as de chances de gagner !',
  image: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400'
};

const pendingQuestions = [
  {
    id: 1,
    category: 'La musique',
    question: 'Comment percevez-vous l\'évolution de la musique de notre île ?',
    growth: '+20% month over month',
    date: 'ven 1er août 2025',
    responses: 156
  },
  {
    id: 2,
    category: 'L\'IA',
    question: 'Pensez-vous que l\'IA va révolutionner notre quotidien ?',
    growth: '+33% month over month',
    date: 'sam 2 août 2025',
    responses: 89
  },
  {
    id: 3,
    category: 'L\'inflation',
    question: 'En tenant compte de l\'inflation actuelle, quel pourcentage de votre budget mensuel devez-vous consacrer à l\'alimentation pour maintenir votre niveau de vie actuel ?',
    growth: '+20% month over month',
    date: 'lun 25 juillet 2025',
    responses: 234
  },
  {
    id: 4,
    category: 'La visite',
    question: 'Que pensez-vous de la nouvelle politique de visite ?',
    growth: '+33% month over month',
    date: 'lun 25 juillet 2025',
    responses: 67
  }
];

const monthlyDraws = [
  {
    id: 1,
    title: 'Tirage du mois',
    description: 'Les résultats du tirage du 1er semestre 2025',
    prize: 'Gagnez 30 euros',
    category: 'Les grandes vacances'
  },
  {
    id: 2,
    title: 'Jeu spécial',
    description: 'Participez à notre jeu mensuel',
    prize: 'Prix surprise',
    category: 'Jeu'
  }
];

export function BoosteTaVoix({ onNavigateToSocialFeed }: BoosteTaVoixProps) {
  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booste ta voix</h1>
        <p className="text-gray-600">Crée tes études et gagne des prix incroyables</p>
      </div>

      {/* Promotional Banner */}
      <div className="relative bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl p-6 text-white overflow-hidden min-h-[160px]">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">{promotionalOffer.title}</h2>
          <p className="text-pink-100 mb-4">{promotionalOffer.description}</p>
          <button className="bg-white text-pink-600 px-6 py-2 rounded-full font-semibold hover:bg-pink-50 transition-colors">
            {promotionalOffer.subtitle}
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-32 opacity-30">
          <img 
            src={promotionalOffer.image}
            alt="Airplane tickets"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </div>

      {/* Pending Questions Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Les questions en attente</h3>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors">
            <span onClick={() => onNavigateToSocialFeed()}>Mes questions</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                    {question.category}
                  </span>
                  <h4 className="font-medium text-gray-900 text-sm leading-tight mb-2">
                    {question.question}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{question.date}</span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {question.responses}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-600 text-xs font-medium">{question.growth}</span>
                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                  Voir plus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Draws */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tirages du mois</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {monthlyDraws.map((draw) => (
            <div key={draw.id} className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
              <div className="flex items-center mb-3">
                <Gift className="h-6 w-6 mr-2" />
                <span className="font-semibold">{draw.title}</span>
              </div>
              <p className="text-purple-100 text-sm mb-3">{draw.description}</p>
              <div className="flex items-center justify-between">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
                  {draw.category}
                </span>
                <span className="text-sm font-bold">{draw.prize}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Votre progression</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">8</div>
            <div className="text-xs text-gray-600">Questions créées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500">€45</div>
            <div className="text-xs text-gray-600">Gains potentiels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-500">2.1k</div>
            <div className="text-xs text-gray-600">Points cumulés</div>
          </div>
        </div>
      </section>
    </div>
  );
}