import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Eye, Edit2, Trash2, Copy } from 'lucide-react';

interface Survey {
  id: number;
  title: string;
  description: string;
  responses: number;
  status: 'active' | 'draft' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

interface SurveysProps {
  onCreateSurvey: () => void;
}

const mockSurveys: Survey[] = [
  {
    id: 1,
    title: 'Satisfaction client Q1 2024',
    description: 'Évaluation de la satisfaction des clients pour le premier trimestre',
    responses: 156,
    status: 'active',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-18'
  },
  {
    id: 2,
    title: 'Étude de marché produit X',
    description: 'Analyse du potentiel de marché pour notre nouveau produit',
    responses: 89,
    status: 'draft',
    createdAt: '2024-03-12',
    updatedAt: '2024-03-12'
  },
  {
    id: 3,
    title: 'Feedback employés',
    description: 'Enquête annuelle sur la satisfaction des employés',
    responses: 234,
    status: 'completed',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-15'
  },
  {
    id: 4,
    title: 'Évaluation UX application mobile',
    description: 'Test d\'utilisabilité de notre nouvelle application mobile',
    responses: 67,
    status: 'paused',
    createdAt: '2024-03-08',
    updatedAt: '2024-03-14'
  }
];

export function Surveys({ onCreateSurvey }: SurveysProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'completed': return 'Terminé';
      case 'paused': return 'En pause';
      default: return 'Inconnu';
    }
  };

  const filteredSurveys = mockSurveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes sondages</h1>
          <p className="mt-2 text-gray-600">Gérez et suivez tous vos sondages</p>
        </div>
        <button
          onClick={onCreateSurvey}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau sondage
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un sondage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="completed">Terminé</option>
              <option value="paused">En pause</option>
            </select>
          </div>
        </div>
      </div>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <div key={survey.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{survey.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{survey.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                      {getStatusText(survey.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {survey.responses} réponses
                    </span>
                  </div>
                </div>
                <div className="relative ml-4">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === survey.id ? null : survey.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {openDropdown === survey.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir les résultats
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Modifier
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                          <Copy className="h-4 w-4 mr-2" />
                          Dupliquer
                        </button>
                        <hr className="my-1" />
                        <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                <span>Créé le {new Date(survey.createdAt).toLocaleDateString('fr-FR')}</span>
                <span>Modifié le {new Date(survey.updatedAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun sondage trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par créer votre premier sondage'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={onCreateSurvey}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer un sondage
            </button>
          )}
        </div>
      )}
    </div>
  );
}