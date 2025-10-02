
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, SparklesIcon } from './icons';
import { UniversityResponseParser } from './UniversityResponseParser';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isModel ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
        {isModel ? <SparklesIcon /> : <UserIcon />}
      </div>
      <div className={`max-w-4xl p-4 rounded-xl ${isModel ? 'bg-white shadow-md border' : 'bg-indigo-500 text-white'}`}>
        {isModel ? (
          <UniversityResponseParser message={message.content} />
        ) : (
          <div className="prose prose-sm text-white">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
