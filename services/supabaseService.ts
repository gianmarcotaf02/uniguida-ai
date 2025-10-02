import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️ Supabase configuration missing. Data will be stored locally only.');
}

interface UserData {
  id?: string;
  user_id: string;
  profile: UserProfile;
  quiz_results?: Record<string, number>;
  created_at?: string;
  updated_at?: string;
}

interface QuizSession {
  id?: string;
  user_id: string;
  quiz_results: Record<string, number>;
  top_area: string;
  completed_at: string;
}

class SupabaseService {
  private isAvailable(): boolean {
    return supabase !== null;
  }

  private generateUserId(): string {
    // Genera un ID utente basato su localStorage o crea uno nuovo
    let userId = localStorage.getItem('uniguida_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('uniguida_user_id', userId);
    }
    return userId;
  }

  async saveUserProfile(profile: UserProfile): Promise<boolean> {
    if (!this.isAvailable()) {
      console.log('📱 Saving profile locally (Supabase not configured)');
      localStorage.setItem('userProfile', JSON.stringify(profile));
      return true;
    }

    try {
      const userId = this.generateUserId();
      const userData: UserData = {
        user_id: userId,
        profile: profile,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase!
        .from('user_profiles')
        .upsert(userData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('Errore salvataggio profilo Supabase:', error);
        // Fallback to localStorage
        localStorage.setItem('userProfile', JSON.stringify(profile));
        return true;
      }

      console.log('✅ Profilo salvato su Supabase');
      // Salva anche localmente come backup
      localStorage.setItem('userProfile', JSON.stringify(profile));
      return true;

    } catch (error) {
      console.error('Errore connessione Supabase:', error);
      // Fallback to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));
      return true;
    }
  }

  async loadUserProfile(): Promise<UserProfile | null> {
    // Prova prima dal localStorage per performance
    const localProfile = localStorage.getItem('userProfile');

    if (!this.isAvailable()) {
      return localProfile ? JSON.parse(localProfile) : null;
    }

    try {
      const userId = this.generateUserId();

      const { data, error } = await supabase!
        .from('user_profiles')
        .select('profile')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        console.log('📱 Caricamento profilo da localStorage');
        return localProfile ? JSON.parse(localProfile) : null;
      }

      console.log('☁️ Profilo caricato da Supabase');
      // Aggiorna localStorage con i dati cloud
      localStorage.setItem('userProfile', JSON.stringify(data.profile));
      return data.profile;

    } catch (error) {
      console.error('Errore caricamento profilo Supabase:', error);
      return localProfile ? JSON.parse(localProfile) : null;
    }
  }

  async saveQuizResults(results: Record<string, number>): Promise<boolean> {
    if (!this.isAvailable()) {
      console.log('📱 Saving quiz results locally');
      localStorage.setItem('quizResults', JSON.stringify(results));
      return true;
    }

    try {
      const userId = this.generateUserId();
      const topArea = Object.entries(results)
        .sort((a, b) => b[1] - a[1])[0][0];

      const quizSession: QuizSession = {
        user_id: userId,
        quiz_results: results,
        top_area: topArea,
        completed_at: new Date().toISOString()
      };

      const { error } = await supabase!
        .from('quiz_sessions')
        .insert(quizSession);

      if (error) {
        console.error('Errore salvataggio quiz Supabase:', error);
        localStorage.setItem('quizResults', JSON.stringify(results));
        return true;
      }

      console.log('✅ Risultati quiz salvati su Supabase');
      localStorage.setItem('quizResults', JSON.stringify(results));

      // Aggiorna anche il profilo utente con i risultati più recenti
      await this.updateUserQuizResults(userId, results);

      return true;

    } catch (error) {
      console.error('Errore connessione Supabase:', error);
      localStorage.setItem('quizResults', JSON.stringify(results));
      return true;
    }
  }

  private async updateUserQuizResults(userId: string, results: Record<string, number>): Promise<void> {
    try {
      await supabase!
        .from('user_profiles')
        .update({
          quiz_results: results,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Errore aggiornamento quiz results in profilo:', error);
    }
  }

  async loadQuizResults(): Promise<Record<string, number> | null> {
    const localResults = localStorage.getItem('quizResults');

    if (!this.isAvailable()) {
      return localResults ? JSON.parse(localResults) : null;
    }

    try {
      const userId = this.generateUserId();

      const { data, error } = await supabase!
        .from('user_profiles')
        .select('quiz_results')
        .eq('user_id', userId)
        .single();

      if (error || !data?.quiz_results) {
        return localResults ? JSON.parse(localResults) : null;
      }

      localStorage.setItem('quizResults', JSON.stringify(data.quiz_results));
      return data.quiz_results;

    } catch (error) {
      console.error('Errore caricamento quiz results:', error);
      return localResults ? JSON.parse(localResults) : null;
    }
  }

  async getUserStats(): Promise<{
    totalQuizzes: number;
    lastQuizDate: string | null;
    topAreas: Array<{ area: string; count: number }>;
  } | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const userId = this.generateUserId();

      const { data, error } = await supabase!
        .from('quiz_sessions')
        .select('top_area, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error || !data) {
        return null;
      }

      const totalQuizzes = data.length;
      const lastQuizDate = data[0]?.completed_at || null;

      const areaCount = data.reduce((acc, session) => {
        acc[session.top_area] = (acc[session.top_area] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topAreas = Object.entries(areaCount)
        .map(([area, count]) => ({ area, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        totalQuizzes,
        lastQuizDate,
        topAreas
      };

    } catch (error) {
      console.error('Errore caricamento statistiche:', error);
      return null;
    }
  }

  async clearUserData(): Promise<boolean> {
    const userId = this.generateUserId();

    // Pulisci localStorage
    localStorage.removeItem('userProfile');
    localStorage.removeItem('quizResults');
    localStorage.removeItem('uniguida_user_id');

    if (!this.isAvailable()) {
      return true;
    }

    try {
      // Elimina dati da Supabase
      await supabase!.from('user_profiles').delete().eq('user_id', userId);
      await supabase!.from('quiz_sessions').delete().eq('user_id', userId);

      console.log('🗑️ Dati utente eliminati da Supabase');
      return true;

    } catch (error) {
      console.error('Errore eliminazione dati Supabase:', error);
      return true; // Ritorna true comunque perché localStorage è stato pulito
    }
  }

  isCloudSyncEnabled(): boolean {
    return this.isAvailable();
  }

  getConnectionStatus(): 'connected' | 'local-only' | 'error' {
    if (!this.isAvailable()) {
      return 'local-only';
    }
    return 'connected';
  }
}

// Esporta un'istanza singleton
export const supabaseService = new SupabaseService();

// Esporta anche il client Supabase per usi avanzati
export { supabase };
