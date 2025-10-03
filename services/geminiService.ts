import { Chat, GoogleGenAI } from "@google/genai";
import { UserProfile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chatSession: Chat | null = null;

function buildSystemInstruction(userProfile: UserProfile, quizResults: Record<string, number> | null): string {
  let context = `Sei un consulente esperto di orientamento universitario in Italia. Il tuo nome è UniGuida AI. Rispondi in modo amichevole, incoraggiante e informativo. Fornisci consigli personalizzati basati sui gusti, le attitudini e i vincoli dell'utente. Se ti vengono chieste informazioni pratiche su università e città (costo della vita, affitti, servizi), fornisci stime realistiche e utili.

Ecco le informazioni sull'utente con cui stai parlando:
- Nome: ${userProfile.name || 'Non specificato'}
- Città: ${userProfile.city || 'Non specificata'}
- Scuola Superiore: ${userProfile.highSchool?.name || 'Non specificata'}
- Interessi dichiarati: ${userProfile.interests.join(', ') || 'Nessuno'}`;

  if (quizResults) {
    const topArea = Object.entries(quizResults).sort((a, b) => b[1] - a[1])[0];
    context += `\n- Risultati del questionario: L'utente mostra una forte inclinazione per l'area ${topArea[0]} con un punteggio di ${topArea[1]}. Tieni conto di questo risultato nelle tue risposte.`;
  }

  return context;
}


export async function startChatSession(userProfile: UserProfile, quizResults: Record<string, number> | null): Promise<string> {
  const systemInstruction = buildSystemInstruction(userProfile, quizResults);

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });

  const initialPrompt = "Ciao, presentati e salutami in modo amichevole, tenendo conto delle informazioni del mio profilo. Chiedimi come puoi aiutarmi.";
  const response = await chatSession.sendMessage({ message: initialPrompt });
  return response.text;
}


export async function generateMotivation(result: string, scores: Record<string, number>): Promise<string> {
  try {
    const prompt = `L'utente ha completato un questionario di orientamento e il suo percorso suggerito è nell'area "${result}". I suoi punteggi completi sono: ${JSON.stringify(scores)}.
    Scrivi un'analisi personalizzata e incoraggiante in formato HTML semplice (usa <strong> per il grassetto e <ul><li> per le liste).
    L'analisi deve includere:
    1. Un paragrafo introduttivo (2-3 frasi) che commenta positivamente il risultato principale.
    2. Una sezione "Possibili percorsi di studio:" con una lista di 2-3 tipi di corsi di laurea specifici (es. "Laurea Triennale in Ingegneria Informatica", "Laurea Magistrale a ciclo unico in Architettura").
    3. Una sezione "Sbocchi professionali:" con una lista di 2-3 esempi di carriere pertinenti.
    Il tono deve essere positivo, dettagliato e ispiratore.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Error generating motivation with Gemini:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}

export async function getChatResponse(prompt: string): Promise<string> {
  if (!chatSession) {
    // Fallback in case chat is not initialized
    console.warn("Chat session not initialized. Starting a default session.");
    chatSession = ai.chats.create({ model: 'gemini-2.5-flash' });
  }

  try {
    const response = await chatSession.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    throw new Error("Failed to get chat response from the AI model.");
  }
}
