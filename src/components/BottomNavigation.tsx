import React from 'react';
import { Home, Gift, HelpCircle, User, Heart } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Accueil' },
  { id: 'booste', icon: Heart, label: 'Booste ta voix' },
  { id: 'faq', icon: HelpCircle, label: 'FAQ' },
  { id: 'profile', icon: User, label: 'Profil' },
];

export function BottomNavigation({ currentPage, onPageChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}