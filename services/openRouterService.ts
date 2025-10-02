import axios from 'axios';
import { UserProfile } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
const MODEL = (import.meta as any).env.VITE_OPENROUTER_MODEL || 'nvidia/nemotron-nano-9b-v2:free';
const ENABLE_REASONING = (import.meta as any).env.VITE_OPENROUTER_ENABLE_REASONING === 'true';

if (!API_KEY) {
  console.warn("⚠️ OpenRouter API key not found. Please set VITE_OPENROUTER_API_KEY in your environment variables.");
}

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
      reasoning?: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterService {
  private conversationHistory: OpenRouterMessage[] = [];

  private buildSystemInstruction(userProfile: UserProfile, quizResults: Record<string, number> | null): string {
    let context = `Sei UniGuida AI, un consulente esperto di orientamento universitario specializzato nel sistema educativo italiano.

🎯 **Il tuo ruolo:**
- Fornisci consigli personalizzati e precisi sull'orientamento universitario
- Usa un tono amichevole, professionale e incoraggiante
- Struttura le risposte in modo chiaro e organizzato
- Includi informazioni pratiche e concrete

👤 **Informazioni dell'utente:**
- Nome: ${userProfile.name || 'Non specificato'}
- Città: ${userProfile.city || 'Non specificata'}
- Scuola Superiore: ${userProfile.highSchool?.name || 'Non specificata'}
- Interessi: ${userProfile.interests.join(', ') || 'Nessuno specificato'}`;

    if (quizResults && Object.keys(quizResults).length > 0) {
      const sortedResults = Object.entries(quizResults)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      context += `\n\n📊 **Risultati del questionario:**
${sortedResults.map(([area, score], index) =>
        `${index + 1}. ${area}: ${score} punti`
      ).join('\n')}

Usa questi risultati per personalizzare i tuoi consigli.`;
    }

    context += `\n\n💡 **Linee guida per le risposte:**
- Fornisci sempre esempi concreti di università e corsi
- Includi informazioni su sbocchi professionali
- Considera la posizione geografica dell'utente
- Suggerisci corsi di laurea specifici con codici
- Fornisci dati su costi, durata e requisiti di accesso
- Usa emoji per rendere le risposte più accattivanti`;

    return context;
  }

  async startChatSession(userProfile: UserProfile, quizResults: Record<string, number> | null): Promise<string> {
    const systemInstruction = this.buildSystemInstruction(userProfile, quizResults);

    this.conversationHistory = [
      {
        role: 'system',
        content: systemInstruction
      }
    ];

    const initialPrompt = `Ciao! 👋 Sono UniGuida AI, il tuo consulente personale per l'orientamento universitario.

Ho analizzato il tuo profilo e sono qui per aiutarti a trovare il percorso universitario perfetto per te.

Come posso assisterti oggi? Puoi chiedermi:
- 🎓 Suggerimenti su corsi di laurea specifici
- 🏛️ Informazioni su università e città universitarie
- 💼 Sbocchi professionali e opportunità di carriera
- 📝 Consigli per i test d'ingresso
- 💰 Informazioni su costi e borse di studio

Cosa ti interessa di più scoprire?`;

    this.conversationHistory.push({
      role: 'assistant',
      content: initialPrompt
    });

    return initialPrompt;
  }

  async sendMessage(message: string, retryCount = 0): Promise<string> {
    if (!API_KEY) {
      return "❌ Servizio AI non disponibile. Configura la chiave API OpenRouter.";
    }

    const maxRetries = 2;

    try {
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      const requestBody = {
        model: MODEL,
        messages: this.conversationHistory,
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9
      };

      const response = await axios.post<OpenRouterResponse>(
        OPENROUTER_API_URL,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': (import.meta as any).env?.VITE_APP_URL || 'https://uniguida-ai.vercel.app',
            'X-Title': 'UniGuida AI'
          },
          timeout: 60000
        }
      );

      const aiResponse = response.data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('Risposta vuota dal servizio AI');
      }

      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      // Log reasoning if available and enabled
      if (ENABLE_REASONING && response.data.choices[0]?.message?.reasoning) {
        console.log('🧠 AI Reasoning:', response.data.choices[0].message.reasoning);
      }

      return aiResponse;

    } catch (error) {
      console.error('Errore OpenRouter:', error);

      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);

        if (error.response?.status === 401) {
          return "🔐 Errore di autenticazione. Verifica la chiave API OpenRouter.";
        }
        if (error.response?.status === 429) {
          return "⏱️ Troppe richieste. Riprova tra qualche momento.";
        }
        if (error.response?.status === 400) {
          return "⚠️ Richiesta non valida. Verifica la configurazione del modello.";
        }
        if (error.code === 'ECONNABORTED' && retryCount < maxRetries) {
          console.log(`🔄 Retry ${retryCount + 1}/${maxRetries} dopo timeout...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.sendMessage(message, retryCount + 1);
        }
        if (error.code === 'ECONNABORTED') {
          return `⏰ Timeout della richiesta dopo ${maxRetries} tentativi. Il servizio potrebbe essere sovraccarico.`;
        }
      }

      return "❌ Si è verificato un errore durante la comunicazione con l'AI. Riprova più tardi.";
    }
  }

  async generateMotivation(result: string, scores: Record<string, number>): Promise<string> {
    if (!API_KEY) {
      return "Configurazione dell'orientamento AI non disponibile.";
    }

    try {
      const sortedScores = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const prompt = `Analizza questi risultati del questionario di orientamento e genera una motivazione personalizzata e incoraggiante:

📊 **Area principale suggerita:** ${result}

📈 **Punteggi dettagliati:**
${sortedScores.map(([area, score], index) =>
        `${index + 1}. ${area}: ${score} punti`
      ).join('\n')}

🎯 **Richiesta:** Scrivi un messaggio motivazionale di 150-200 parole che:
- Celebri i punti di forza evidenziati dai risultati
- Suggerisca corsi di laurea specifici nell'area ${result}
- Evidenzi le prospettive professionali positive
- Sia incoraggiante e ispirante
- Includa emoji per renderlo più accattivante

Usa un tono entusiasta e professionale.`;

      const response = await axios.post<OpenRouterResponse>(
        OPENROUTER_API_URL,
        {
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: 'Sei un consulente di orientamento esperto e motivazionale. Scrivi messaggi che ispirano e guidano gli studenti verso il loro futuro accademico.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          reasoning: ENABLE_REASONING,
          max_tokens: 300,
          temperature: 0.8
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': (import.meta as any).env?.VITE_APP_URL || 'http://localhost:3000',
            'X-Title': 'UniGuida AI'
          }
        }
      );

      return response.data.choices[0]?.message?.content ||
        `🎓 Complimenti! I tuoi risultati mostrano una forte inclinazione per l'area ${result}. Questo è un settore ricco di opportunità e il tuo profilo sembra perfettamente allineato con questo percorso di studi.`;

    } catch (error) {
      console.error('Errore generazione motivazione:', error);
      return `🎓 Eccellente! I tuoi risultati indicano ${result} come area ideale per te. Questo campo offre numerose opportunità di crescita professionale e personale.`;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getConversationLength(): number {
    return this.conversationHistory.length;
  }

  getTokenUsageEstimate(): number {
    // Stima approssimativa dei token utilizzati
    return this.conversationHistory.reduce((total, message) => {
      return total + Math.ceil(message.content.length / 4);
    }, 0);
  }
}

// Esporta un'istanza singleton
export const openRouterService = new OpenRouterService();

// Backward compatibility con geminiService
export const startChatSession = openRouterService.startChatSession.bind(openRouterService);
export const generateMotivation = openRouterService.generateMotivation.bind(openRouterService);
export const sendMessage = openRouterService.sendMessage.bind(openRouterService);
