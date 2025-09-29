import { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Key, 
  Database, 
  Zap,
  Save,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Check,
  X,
  AlertTriangle,
  Info,
  Settings as SettingsIcon
} from 'lucide-react';

interface SettingsProps {
  // Add any props if needed
}

export function Settings({}: SettingsProps) {
  const [activeSection, setActiveSection] = useState<'general' | 'security' >('general');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false
  });

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@myvoice974.com',
    role: 'Administrator',
    avatar: '',
    timezone: 'Indian/Reunion',
    language: 'fr'
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 3
  });

  const [system, setSystem] = useState({
    theme: 'light',
    sidebarCollapsed: false,
    autoSave: true,
    debugMode: false,
    analytics: true
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API', key: 'sk-prod-***', lastUsed: '2024-03-20', status: 'active' },
    { id: 2, name: 'Development API', key: 'sk-dev-***', lastUsed: '2024-03-18', status: 'active' }
  ]);

  const sections = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Shield }
    ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
    console.log('Settings saved');
  };

  const handleReset = () => {
    setIsEditing(false);
    // Reset to default values
    console.log('Settings reset');
  };

  const generateNewApiKey = () => {
    const newKey = {
      id: Date.now(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk-${Math.random().toString(36).substring(2, 15)}`,
      lastUsed: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const deleteApiKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-orange-500" />
          Profile Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={profile.role}
              onChange={(e) => setProfile({...profile, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={!isEditing}
            >
              <option value="Administrator">Administrator</option>
              <option value="Moderator">Moderator</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile({...profile, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={!isEditing}
            >
              <option value="Indian/Reunion">Indian/Reunion (GMT+4)</option>
              <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>
        </div>
      </div>

      
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Password Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Key className="h-5 w-5 mr-2 text-orange-500" />
          Password & Authentication
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
          
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            Update Password
          </button>
        </div>
      </div>
      
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* Appearance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="h-5 w-5 mr-2 text-orange-500" />
          Appearance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={system.theme}
              onChange={(e) => setSystem({...system, theme: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={profile.language}
              onChange={(e) => setProfile({...profile, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

     
    </div>
  );


  return (
    <div className="space-y-6 max-h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-1">Manage your account preferences and system configuration</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div>
        {activeSection === 'general' && renderGeneralSettings()}
        {activeSection === 'security' && renderSecuritySettings()}
      </div>
    </div>
  );
}
