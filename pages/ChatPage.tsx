import React, { useEffect, useRef, useState } from 'react';
import ChatMessage from '../components/ChatMessage';
import { SendIcon } from '../components/icons';
import { openRouterService } from '../services/openRouterService';
import { ChatMessage as ChatMessageType, UserProfile } from '../types';

interface ChatPageProps {
  userProfile: UserProfile;
  quizResults: Record<string, number> | null;
}

const ChatPage: React.FC<ChatPageProps> = ({ userProfile, quizResults }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Use a ref to ensure we only initialize the chat once per component mount
  const isChatInitialized = useRef(false);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const initialMessage = await openRouterService.startChatSession(userProfile, quizResults);
        setMessages([{ role: 'model', content: initialMessage }]);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setMessages([{ role: 'model', content: "🤖 Ciao! Sono UniGuida AI. Purtroppo ho riscontrato un problema tecnico, ma sono qui per aiutarti nella scelta del tuo percorso universitario. Come posso supportarti?" }]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isChatInitialized.current) {
      initializeChat();
      isChatInitialized.current = true;
    }
  }, [userProfile, quizResults]);


  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await openRouterService.sendMessage(input);
      const modelMessage: ChatMessageType = { role: 'model', content: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage: ChatMessageType = { role: 'model', content: "Oops! Qualcosa è andato storto. Per favore, riprova." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-center text-gray-800">Consulente AI</h1>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500 text-white">
              <div className="typing-indicator">
                <span className="typing-dot-model"></span>
                <span className="typing-dot-model"></span>
                <span className="typing-dot-model"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "In attesa di una risposta..." : "Scrivi la tua domanda..."}
            disabled={isLoading}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Invia messaggio"
          >
            <SendIcon />
          </button>
        </form>
      </div>
      <style>{`
        .typing-indicator { display: flex; align-items: center; justify-content: center; }
        .typing-dot-model { width: 6px; height: 6px; margin: 0 2px; background-color: white; border-radius: 50%; animation: typing-blink 1.4s infinite both; }
        .typing-dot-model:nth-child(2) { animation-delay: .2s; }
        .typing-dot-model:nth-child(3) { animation-delay: .4s; }
        @keyframes typing-blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }
      `}</style>
    </div>
  );
};

export default ChatPage;
