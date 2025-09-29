import React from 'react';
import { BarChart3, Users, FileText, TrendingUp, Eye, MessageCircle } from 'lucide-react';

const stats = [
  { name: 'Total des sondages', value: '24', change: '+12%', trend: 'up', icon: FileText },
  { name: 'Réponses totales', value: '1,234', change: '+18%', trend: 'up', icon: Users },
  { name: 'Taux de réponse', value: '78%', change: '+5%', trend: 'up', icon: TrendingUp },
  { name: 'Sondages actifs', value: '8', change: '+2', trend: 'up', icon: BarChart3 },
];

const recentSurveys = [
  {
    id: 1,
    title: 'Satisfaction client Q1 2024',
    responses: 156,
    status: 'active',
    completion: 78,
    date: '15 Mars 2024'
  },
  {
    id: 2,
    title: 'Étude de marché produit X',
    responses: 89,
    status: 'draft',
    completion: 45,
    date: '12 Mars 2024'
  },
  {
    id: 3,
    title: 'Feedback employés',
    responses: 234,
    status: 'completed',
    completion: 100,
    date: '10 Mars 2024'
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bonjour, Marie ! 👋</h1>
            <p className="text-blue-100 text-lg">
              Voici un aperçu de vos sondages aujourd'hui
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-emerald-600 font-medium">
                    {stat.change} ce mois
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Surveys */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Sondages récents</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentSurveys.map((survey) => (
                  <div key={survey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{survey.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {survey.responses} réponses
                        </span>
                        <span>{survey.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{survey.completion}%</div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${survey.completion}%` }}
                          />
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        survey.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        survey.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {survey.status === 'active' ? 'Actif' : 
                         survey.status === 'draft' ? 'Brouillon' : 'Terminé'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="h-5 w-5 mr-2" />
                Créer un sondage
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Eye className="h-5 w-5 mr-2" />
                Voir les résultats
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <MessageCircle className="h-5 w-5 mr-2" />
                Gérer les réponses
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Conseil du jour</h3>
            <p className="text-emerald-100 text-sm mb-4">
              Utilisez des questions ouvertes pour obtenir des insights plus profonds de vos répondants.
            </p>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm py-2 px-4 rounded-lg transition-colors">
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}