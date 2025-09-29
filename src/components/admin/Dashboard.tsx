import { useState, useEffect } from 'react';
import { Users, FileText, Bell, BarChart3, X } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import { BASE_URL } from '../../services/api';

interface FirebaseUser {
  id: string;
  uid: string;
  username?: string;
  email?: string;
  createdAt?: any;
}

interface Study {
  _id: string;
  title: string;
  description: string;
  status: string;
  participants: number;
  targetParticipants?: number;
  maxParticipants?: number;
  reward: number;
  duration: number;
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

interface DashboardProps {
  stats: {
    totalUsers: number;
    activeSurveys: number;
    totalSurveys: number;
    totalNotifications: number;
  };
  surveys: Array<{
    id: number;
    title: string;
    status: string;
    participants: number;
    completion: number;
    reward: number;
    createdAt: string;
  }>;
  users: Array<{
    id: number;
    name: string;
    email: string;
    surveysCompleted: number;
    totalEarnings: number;
    joinDate: string;
    isActive: boolean;
  }>;
}

export function Dashboard({ stats, surveys, users }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    data: any[];
    type: 'users' | 'surveys' | 'notifications';
  } | null>(null);
  const [firebaseUsers, setFirebaseUsers] = useState<FirebaseUser[]>([]);
  const [currentStudies, setCurrentStudies] = useState<Study[]>([]);

  // Fetch Firebase users data
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const firebaseUsersData: FirebaseUser[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            uid: data.uid || "N/A",
            username: data.username || "Unknown",
            email: data.email || "N/A",
            createdAt: data.createdAt,
          };
        });
        setFirebaseUsers(firebaseUsersData);
      },
      (err) => {
        console.error("Firebase error:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch current studies data from API
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
      }
    };

    fetchStudies();
  }, []);

  const handleCardClick = (type: 'users' | 'surveys' | 'notifications', title: string) => {
    let data: any[] = [];
    
    switch (type) {
      case 'users':
        // Use Firebase users data instead of mock users
        data = firebaseUsers.map(user => ({
          id: user.id,
          name: user.username,
          email: user.email,
          surveysCompleted: 0, // Default value
          totalEarnings: 0, // Default value
          joinDate: user.createdAt?.toDate ? user.createdAt.toDate().toISOString() : new Date().toISOString(),
          isActive: true // Default value
        }));
        break;
      case 'surveys':
        // Use current studies data instead of mock surveys
        data = currentStudies.map(study => ({
          id: study._id,
          title: study.title,
          status: study.status,
          participants: study.participants,
          completion: study.targetParticipants ? Math.round((study.participants / study.targetParticipants) * 100) : 0,
          reward: study.reward,
          createdAt: study.createdAt
        }));
        break;
      case 'notifications':
        // For notifications, we'll create mock data since it's not provided in props
        data = Array.from({ length: stats.totalNotifications }, (_, i) => ({
          id: i + 1,
          title: `Notification ${i + 1}`,
          message: `This is notification message ${i + 1}`,
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
          read: i % 3 === 0
        }));
        break;
    }
    
    setModalData({ title, data, type });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="space-y-4 md:space-y-6">
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div 
          className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick('users', 'All Users')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-lg md:text-2xl font-bold text-orange-500">{firebaseUsers.length.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-2 md:p-3 rounded-lg">
              <Users className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick('surveys', 'Active Surveys')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Active Surveys</p>
              <p className="text-lg md:text-2xl font-bold text-green-500">{currentStudies.filter(s => s.status === 'active' || s.status === 'available').length}</p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-lg">
              <FileText className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick('surveys', 'All Surveys')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Surveys</p>
              <p className="text-lg md:text-2xl font-bold text-blue-500">{currentStudies.length}</p>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
              <BarChart3 className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick('notifications', 'All Notifications')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Notifications Sent</p>
              <p className="text-lg md:text-2xl font-bold text-pink-500">{stats.totalNotifications}</p>
            </div>
            <div className="bg-pink-100 p-2 md:p-3 rounded-lg">
              <Bell className="h-4 w-4 md:h-6 md:w-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Recent Surveys</h3>
          <div className="space-y-3">
            {surveys.slice(0, 3).map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{survey.title}</p>
                  <p className="text-sm text-gray-600">{survey.participants} participants</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  survey.status === 'active' ? 'bg-green-100 text-green-800' :
                  survey.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {survey.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Recent Users</h3>
          <div className="space-y-3">
            {users.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.surveysCompleted} surveys</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 !mt-0 !mb-0">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">{modalData.title}</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] hide-scrollbar">
              <div className="space-y-3">
                {modalData.data.map((item, index) => (
                  <div key={item.id || index} className="p-4 bg-gray-50 rounded-lg">
                    {modalData.type === 'users' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.email}</p>
                          <p className="text-sm text-gray-500">
                            {item.surveysCompleted} surveys • ${item.totalEarnings} earned
                          </p>
                          <p className="text-xs text-gray-400">Joined: {new Date(item.joinDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    )}
                    
                    {modalData.type === 'surveys' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.participants} participants</p>
                          <p className="text-sm text-gray-500">
                            {item.completion}% completion • ${item.reward} reward
                          </p>
                          <p className="text-xs text-gray-400">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'active' ? 'bg-green-100 text-green-800' :
                          item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    )}
                    
                    {modalData.type === 'notifications' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.read ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.read ? 'Read' : 'Unread'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {modalData.data.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
