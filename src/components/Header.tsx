import React, { useState } from 'react';
import { Search, Menu, X, Bell, ShoppingCart, Gift } from 'lucide-react';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  onNotificationsClick: () => void;
  onEspaceCadeauClick: () => void;
  currentPage: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Header({ onNotificationsClick, onEspaceCadeauClick, currentPage, searchTerm, onSearchChange }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50 safe-area-top">
      <div className="px-4 py-4">
        {/* Top section with logo and menu items */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className="text-xl font-bold text-orange-500">myvoice</span>
            </div>
          </div>
      
          
          <div className="flex items-center space-x-4 text-sm">
                 {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Recherche dans myvoice974"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
              isSearchFocused ? 'shadow-md' : ''
            }`}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
            {currentPage === 'studies' ? (
              <button className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={onEspaceCadeauClick}
                className="p-2 text-gray-700 hover:text-orange-500 transition-colors rounded-full hover:bg-gray-100"
              >
                <Gift className="h-5 w-5" />
              </button>
            )}
            <button 
              onClick={onNotificationsClick}
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button 
              onClick={handleLoginClick}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 animate-pulse"
            >
              Log in
            </button>
          </div>
        </div>

       
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
}