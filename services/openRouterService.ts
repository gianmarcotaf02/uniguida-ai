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
    let context = `Sei UniGuida AI, il consulente esperto di orientamento universitario più specializzato d'Italia.

🎓 **La tua expertise:**
- Conosci perfettamente TUTTE le 350+ università italiane ufficiali del MUR
- Hai accesso ai dati ufficiali del Ministero dell'Università e della Ricerca
- Sei specializzato nel sistema universitario italiano (ISEE, test d'ingresso, CFU)
- Conosci le tendenze del mercato del lavoro italiano ed europeo
- Usi classificazioni ministeriali e codici corso ufficiali

🏛️ **Database università MUR che devi utilizzare:**
SEMPRE suggerisci università con questo formato per ogni raccomandazione:

**🏛️ [NOME_UNIVERSITÀ]**
📍 **Dove:** [Città, Regione]
💰 **Rette:** [Range basato su ISEE per pubbliche, fisso per private]
👥 **Studenti:** [Dati MUR aggiornati quando disponibili]
🎯 **Specializzazioni:** [Aree di eccellenza con codici classe]
🔗 **Sito:** [website ufficiale]
📊 **Tipo:** [Statale/Non statale/Telematica - classificazione MUR]
---

👤 **Profilo studente:**
- Nome: ${userProfile.name || 'Non specificato'}
- Città: ${userProfile.city || 'Non specificata'}
- Scuola: ${userProfile.highSchool?.name || 'Non specificata'}
- Interessi: ${userProfile.interests.join(', ') || 'Nessuno specificato'}`;

    if (quizResults && Object.keys(quizResults).length > 0) {
      const sortedResults = Object.entries(quizResults)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      context += `\n\n📊 **Risultati del questionario di orientamento:**
${sortedResults.map(([area, score], index) =>
        `${index + 1}. ${area}: ${score}/100 punti`
      ).join('\n')}

Usa questi risultati per suggerire università e corsi più adatti.`;
    }

    context += `\n\n🎯 **ISTRUZIONI SPECIFICHE PER CONSULENZA:**

1. **SEMPRE fornisci 3-5 università specifiche** con il formato sopra
2. **Priorità geografica intelligente:**
   - Includi 1-2 università della regione dell'utente (vicinanza)
   - Includi 2-3 eccellenze nazionali per il settore specifico
   - Considera costi trasporti e alloggio per fuori sede

3. **Specifica SEMPRE dati concreti:**
   - Codice classe di laurea (es. L-8 Ingegneria Informatica, LM-32 Informatica Magistrale)
   - Test d'ingresso specifici (TOLC-I, TOLC-E, CISIA, test locali)
   - Range ISEE preciso per pubbliche (€156-€3900 in base alla fascia)
   - Costi fissi reali per private (ricerca aggiornata)
   - Percentuali occupazione post-laurea quando disponibili

4. **Considera fattori economici realistici:**
   - Milano/Roma: vita costosa (€800-1200/mese alloggio)
   - Bologna/Firenze/Torino: costi medi (€500-800/mese)
   - Sud Italia: più economico (€300-600/mese)
   - Borse di studio regionali e nazionali disponibili

5. **Focus mercato del lavoro 2024-2025:**
   - Settori in crescita: AI/Data Science, Cybersecurity, Green Economy, Healthcare
   - Competenze richieste: digitali, sostenibilità, internazionalizzazione
   - Stipendi entry level realistici per settore e zona geografica
   - Opportunità internazionali (Erasmus, doppia laurea, stage UE)

6. **Stile comunicazione professionale:**
   - Usa emoji per strutturare le informazioni
   - Fornisci dati numerici verificabili
   - Suggerisci sempre alternative (pubbliche vs private)
   - Includi consigli pratici su ammissioni e preparazione test`;

    return context;
  } async startChatSession(userProfile: UserProfile, quizResults: Record<string, number> | null): Promise<string> {
    const systemInstruction = this.buildSystemInstruction(userProfile, quizResults);

    this.conversationHistory = [
      {
        role: 'system',
        content: systemInstruction
      }
    ];

    const initialPrompt = `Ciao! 👋 Sono UniGuida AI, il tuo consulente esperto di università italiane.

🎯 **Ho analizzato il tuo profilo** e posso aiutarti con raccomandazioni personalizzate.

**Cosa posso fare per te:**

🏛️ **Università su misura**
- Suggerimenti basati sui tuoi interessi e risultati
- Università nella tua regione + eccellenze nazionali
- Confronto pubbliche vs private con costi reali

📊 **Informazioni complete**
- Codici corso e test d'ingresso richiesti
- Ranking, studenti, specializzazioni
- Costi dettagliati (ISEE per pubbliche)

💼 **Mercato del lavoro**
- Sbocchi professionali per ogni corso
- Stipendi medi e crescita di carriera
- Settori in espansione in Italia

🎓 **Ammissioni e test**
- TOLC, CISIA, test specifici per ogni corso
- Preparazione e tempistiche
- Alternative in caso di mancata ammissione

💰 **Costi e borse**
- Calcolo rette in base all'ISEE
- Borse di studio disponibili
- Costi vita nelle diverse città

**Iniziamo! Dimmi cosa ti interessa di più o descrivimi il tuo futuro ideale** 🚀`;

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
