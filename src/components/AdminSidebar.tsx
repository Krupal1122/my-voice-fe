import React from 'react';
import { 
  Users, 
  FileText, 
  Bell, 
  HelpCircle, 
  BarChart3,
  Shield,
  BookOpen,
  Settings,
  Gift,
  MessageSquare
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'studies' | 'users' | 'notifications' | 'gifts' | 'my-questions' | 'faq' | 'settings';
  onTabChange: (tab: 'dashboard' | 'studies' | 'users' | 'notifications' | 'gifts' | 'my-questions' | 'faq' | 'settings') => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export function AdminSidebar({ activeTab, onTabChange, sidebarOpen, onCloseSidebar }: AdminSidebarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'studies', label: 'Current Studies', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'gifts', label: 'Gifts', icon: Gift },
    { id: 'my-questions', label: 'My Questions', icon: MessageSquare },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200 h-full transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <nav className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => {
                        onTabChange(tab.id as any);
                        onCloseSidebar(); // Close sidebar on mobile after selection
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Brand section */}
          <div className="flex-shrink-0 p-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-orange-500 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs text-gray-500 font-medium">Admin Dashboard</p>
              <p className="text-xs text-gray-400">MyVoice974</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
