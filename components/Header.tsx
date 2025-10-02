import React, { useState } from 'react';
import { Page } from '../types';
import { LogoIcon, ProfileIcon } from './icons';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentPage?: Page;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { page: Page.Home, label: 'Home', icon: '🏠' },
    { page: Page.Questionnaire, label: 'Questionario', icon: '📝' },
    { page: Page.Chat, label: 'Chat AI', icon: '🤖' },
  ];

  const isActivePage = (page: Page) => currentPage === page;

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate(Page.Home)}
            className="flex items-center space-x-3 group transition-all duration-200 hover:scale-105"
          >
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-soft">
              <LogoIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">UniGuida AI</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ page, label, icon }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${isActivePage(page)
                    ? 'bg-primary-50 text-primary-700 shadow-soft'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
              >
                <span className="text-sm">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Profile & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Profile Button */}
            <button
              onClick={() => onNavigate(Page.Profile)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActivePage(Page.Profile)
                  ? 'bg-primary-50 text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
            >
              <ProfileIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Profilo</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              {navItems.map(({ page, label, icon }) => (
                <button
                  key={page}
                  onClick={() => {
                    onNavigate(page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left ${isActivePage(page)
                      ? 'bg-primary-50 text-primary-700 shadow-soft'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
