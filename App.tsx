import React, { useCallback, useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import { HIGH_SCHOOLS, INTEREST_AREAS } from './constants';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultsPage from './pages/ResultsPage';
import { supabaseService } from './services/supabaseService';
import { Page, UserProfile } from './types';
import { loadFromStorage, saveToStorage } from './utils/storage';

const defaultProfile: UserProfile = {
  name: '',
  highSchool: null,
  city: '',
  interests: [],
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [quizResults, setQuizResults] = useState<Record<string, number> | null>(() => loadFromStorage('quizResults'));
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load user profile from Supabase on app initialization
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await supabaseService.loadUserProfile();
        if (profile) {
          setUserProfile(profile);
        } else {
          // Try loading from localStorage as fallback
          const localProfile = loadFromStorage('userProfile') as UserProfile | null;
          if (localProfile) {
            setUserProfile(localProfile);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        const localProfile = loadFromStorage('userProfile') as UserProfile | null;
        if (localProfile) {
          setUserProfile(localProfile);
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // Load quiz results from Supabase
  useEffect(() => {
    const loadQuizResults = async () => {
      try {
        const results = await supabaseService.loadQuizResults();
        if (results) {
          setQuizResults(results);
        }
      } catch (error) {
        console.error('Error loading quiz results:', error);
      }
    };

    if (!isLoadingProfile) {
      loadQuizResults();
    }
  }, [isLoadingProfile]);

  useEffect(() => {
    saveToStorage('quizResults', quizResults);
  }, [quizResults]);

  useEffect(() => {
    saveToStorage('userProfile', userProfile);
  }, [userProfile]);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleQuizComplete = useCallback((scores: Record<string, number>) => {
    setQuizResults(scores);
    navigate(Page.Results);
  }, [navigate]);

  const handleProfileSave = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    // Optionally navigate away or show a success message
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Questionnaire:
        return <QuestionnairePage onComplete={handleQuizComplete} />;
      case Page.Results:
        return <ResultsPage scores={quizResults} />;
      case Page.Chat:
        return <ChatPage userProfile={userProfile} quizResults={quizResults} />;
      case Page.Profile:
        return <ProfilePage userProfile={userProfile} onSave={handleProfileSave} interestAreas={INTEREST_AREAS} highSchools={HIGH_SCHOOLS} />;
      case Page.Home:
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header onNavigate={navigate} currentPage={currentPage} />
      <main className="pb-16">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
