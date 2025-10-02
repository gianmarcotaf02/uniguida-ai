
import React from 'react';
import { Question, AnswerOption } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (option: AnswerOption) => void;
  selectedOption: AnswerOption | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, selectedOption }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">{question.id}. {question.text}</h2>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-gray-700
              ${selectedOption?.text === option.text
                ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-300'
                : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
