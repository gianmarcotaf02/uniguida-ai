import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import MURIntegrationPanel from '../components/MURIntegrationPanel';
import { supabaseService } from '../services/supabaseService';
import { HighSchool, UserProfile } from '../types';

interface ProfilePageProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  interestAreas: { id: string; label: string }[];
  highSchools: HighSchool[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onSave, interestAreas, highSchools }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'local-only' | 'error'>('local-only');

  useEffect(() => {
    setSyncStatus(supabaseService.getConnectionStatus());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHighSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSchool = highSchools.find(school => school.name === e.target.value) || null;
    setFormData(prev => ({ ...prev, highSchool: selectedSchool }));
  }

  const handleInterestChange = (interestId: string) => {
    setFormData(prev => {
      const newInterests = prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests: newInterests };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Salva con Supabase
      await supabaseService.saveUserProfile(formData);

      // Aggiorna lo stato locale
      onSave(formData);

      setSaveMessage(
        syncStatus === 'connected'
          ? '✅ Profilo salvato e sincronizzato nel cloud!'
          : '📱 Profilo salvato localmente!'
      );
    } catch (error) {
      console.error('Errore salvataggio profilo:', error);
      setSaveMessage('❌ Errore durante il salvataggio. Riprova.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-4">Il tuo Profilo</h1>

      {/* Sync Status */}
      <div className="mb-6 p-3 rounded-lg text-center text-sm">
        {syncStatus === 'connected' && (
          <div className="bg-green-50 text-green-700 border border-green-200">
            ☁️ Sincronizzazione cloud attiva
          </div>
        )}
        {syncStatus === 'local-only' && (
          <div className="bg-blue-50 text-blue-700 border border-blue-200">
            📱 Salvataggio locale attivo
          </div>
        )}
        {syncStatus === 'error' && (
          <div className="bg-red-50 text-red-700 border border-red-200">
            ⚠️ Problemi di sincronizzazione
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Come ti chiami?"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">Città di residenza</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Es. Roma"
          />
        </div>
        <div>
          <label htmlFor="highSchool" className="block text-sm font-medium text-gray-700">Scuola superiore frequentata</label>
          <input
            list="highSchools"
            id="highSchool"
            name="highSchool"
            defaultValue={formData.highSchool?.name}
            onChange={handleHighSchoolChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Inizia a digitare..."
          />
          <datalist id="highSchools">
            {highSchools.map(school => <option key={school.id} value={school.name} />)}
          </datalist>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Aree di interesse</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interestAreas.map(area => (
              <div key={area.id} className="flex items-center">
                <input
                  id={area.id}
                  type="checkbox"
                  checked={formData.interests.includes(area.id)}
                  onChange={() => handleInterestChange(area.id)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor={area.id} className="ml-3 text-sm text-gray-600">{area.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Sezione Integrazione Dati MUR */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">🏛️ Database Università</h3>
          <p className="text-sm text-gray-600 mb-4">
            Integra i dati ufficiali del MUR per avere accesso a informazioni aggiornate su tutte le università italiane.
          </p>
          <MURIntegrationPanel />
        </div>

        <div className="flex items-center justify-end gap-4">
          {saveMessage && <p className="text-sm font-medium">{saveMessage}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Salvando...</span>
              </>
            ) : (
              <span>💾 Salva Profilo</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
