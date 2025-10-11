import  { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import PWAInstaller from './components/PWAInstaller';
import OfflinePage from './components/OfflinePage';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { Home } from './pages/Home';
import { Studies } from './pages/Studies';
import { History } from './pages/History';
import { Notifications } from './pages/Notifications';
import { FAQ } from './pages/FAQ';
import { Profile } from './pages/Profile';
import { BoosteTaVoix } from './pages/BoosteTaVoix';
import { StudiesList } from './pages/StudiesList';
import { EchoVoix } from './pages/EchoVoix';
import { SocialFeed } from './pages/SocialFeed';
import { SignUp } from './pages/SignUp';
import { AdminLogin } from './pages/AdminLogin';
import { AdminPanel } from './pages/AdminPanel';
   
type Page = 'home' | 'booste' | 'studies' | 'history' | 'faq' | 'profile' | 'notifications' | 'studies-list' | 'echo-voix' | 'social-feed' | 'signup';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const { isOffline } = useNetworkStatus();

  // Check for admin session on component mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        // Check if session is not expired (24 hours)
        const sessionTime = new Date(session.loginTime).getTime();
        const now = new Date().getTime();
        const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setIsAdminLoggedIn(true);
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        localStorage.removeItem('adminSession');
      }
    }

    // Check if URL contains /admin
    if (window.location.pathname === '/admin') {
      setIsAdminMode(true);
    }
  }, []);

  // Handle admin login success
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAdminLoggedIn(false);
    setIsAdminMode(false);
    // Redirect to home page
    window.history.pushState({}, '', '/');
  };

  // If offline, show offline page
  if (isOffline) {
    return <OfflinePage />;
  }

  // If in admin mode, render admin components
  if (isAdminMode) {
    if (isAdminLoggedIn) {
      return <AdminPanel onLogout={handleAdminLogout} />;
    } else {
      return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home 
          onNavigateToStudies={() => setCurrentPage('studies-list')} 
          onNavigateToEcho={() => setCurrentPage('echo-voix')}
        />;
      case 'booste':
        return <BoosteTaVoix onNavigateToSocialFeed={() => setCurrentPage('social-feed')} />;
      case 'studies':
        return <Studies />;
      case 'studies-list':
        return <StudiesList onBack={() => setCurrentPage('home')} />;
      case 'echo-voix':
        return <EchoVoix onBack={() => setCurrentPage('home')} />;
      case 'social-feed':
        return <SocialFeed onBack={() => setCurrentPage('booste')} />;
      case 'signup':
        return <SignUp />;
      case 'history':
        return <History />;
      case 'notifications':
        return <Notifications />;
      case 'faq':
        return <FAQ />;
      case 'profile':
        return <Profile />;
      default:
        return <Home 
          onNavigateToStudies={() => setCurrentPage('studies-list')} 
          onNavigateToEcho={() => setCurrentPage('echo-voix')}
        />;
    }
  };

  const handleNotificationsClick = () => {
    setCurrentPage('notifications' as Page);
  };

  const handleEspaceCadeauClick = () => {
    setCurrentPage('studies');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onNotificationsClick={handleNotificationsClick} 
        onEspaceCadeauClick={handleEspaceCadeauClick}
        currentPage={currentPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <main className="pt-24 pb-20">
        {renderPage()}
      </main>
      <BottomNavigation 
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page as Page)}
      />
      <PWAInstaller />
    </div>
  );
}

export default App;