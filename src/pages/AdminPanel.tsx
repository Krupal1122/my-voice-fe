import { useState, useEffect } from 'react';
import { LogOut, Shield, Menu, X } from 'lucide-react';
import { BASE_URL } from '../services/api';
import { AdminSidebar } from '../components/AdminSidebar';
import { Dashboard } from '../components/admin/Dashboard';
import { CurrentStudies } from '../components/admin/CurrentStudies';
import { Users } from '../components/admin/Users';
import { Notifications } from '../components/admin/Notifications';
import { Gifts } from '../components/admin/Gifts';
import { MyQuestions } from '../components/admin/MyQuestions';
import { FAQ } from '../components/admin/FAQ';
import { Settings } from '../components/admin/Settings';

interface AdminPanelProps {
  onLogout: () => void;
}

interface Study {
  _id: string;
  title: string;
  description: string;
  status: string;
  participants: number;
  targetParticipants: number;
  reward: number;
  duration: number;
  category: string;
  createdAt: string;
  deadline: string;
  image?: string;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'studies' | 'users' | 'notifications' | 'gifts' | 'my-questions' | 'faq' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStudies, setCurrentStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch studies from API
  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/studies`);
        if (response.ok) {
          const data = await response.json();
          setCurrentStudies(data.studies || []);
        } else {
          console.error('Failed to fetch studies');
        }
      } catch (error) {
        console.error('Error fetching studies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, []);

  const handleStudyUpdate = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/studies`);
      if (response.ok) {
        const data = await response.json();
        setCurrentStudies(data.studies || []);
      }
    } catch (error) {
      console.error('Error refreshing studies:', error);
    }
  };

  // Mock data
  const stats = {
    totalUsers: 1247,
    activeSurveys: 8,
    totalSurveys: 24,
    totalNotifications: 156
  };

  const surveys = [
    {
      id: 1,
      title: 'Satisfaction client Q1 2024',
      status: 'active',
      participants: 156,
      completion: 78,
      reward: 20,
      createdAt: '2024-03-15'
    },
    {
      id: 2,
      title: 'Étude de marché produit X',
      status: 'draft',
      participants: 0,
      completion: 0,
      reward: 15,
      createdAt: '2024-03-12'
    },
    {
      id: 3,
      title: 'Feedback employés',
      status: 'completed',
      participants: 234,
      completion: 100,
      reward: 25,
      createdAt: '2024-03-10'
    }
  ];

  // currentStudies is now fetched from API

  const users = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      surveysCompleted: 12,
      totalEarnings: 156,
      joinDate: '2024-01-15',
      isActive: true
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      surveysCompleted: 8,
      totalEarnings: 98,
      joinDate: '2024-02-20',
      isActive: true
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      surveysCompleted: 15,
      totalEarnings: 203,
      joinDate: '2024-01-08',
      isActive: false
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Nouvelle étude disponible',
      message: 'Une étude sur les habitudes alimentaires est maintenant disponible',
      type: 'study',
      sentAt: '2024-03-15T10:30:00',
      recipients: 1247
    },
    {
      id: 2,
      title: 'Maintenance programmée',
      message: 'Le système sera en maintenance demain de 2h à 4h',
      type: 'info',
      sentAt: '2024-03-14T14:20:00',
      recipients: 1247
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'Comment gagner de l\'argent sur MyVoice974 ?',
      category: 'Gains',
      isActive: true
    },
    {
      id: 2,
      question: 'Quand vais-je recevoir mes récompenses ?',
      category: 'Paiements',
      isActive: true
    },
    {
      id: 3,
      question: 'Comment puis-je me désinscrire d\'une étude ?',
      category: 'Participation',
      isActive: false
    }
  ];






  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard stats={stats} surveys={surveys} users={users} />;
      case 'studies': 
        return <CurrentStudies studies={currentStudies} onStudyUpdate={handleStudyUpdate} />;
      case 'users': 
        return <Users />;
      case 'notifications': 
        return <Notifications notifications={notifications} />;
      case 'gifts': 
        return <Gifts />;
      case 'my-questions': 
        return <MyQuestions />;
      case 'faq': 
        return <FAQ />;
      case 'settings': 
        return <Settings />;
      default: 
        return <Dashboard stats={stats} surveys={surveys} users={users} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
              </button>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Shield className="h-3 w-3 md:h-5 md:w-5 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-orange-500">Admin Panel</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-orange-500 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
