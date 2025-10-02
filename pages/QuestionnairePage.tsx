import React, { useEffect, useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import { QUESTIONNAIRE_DATA } from '../constants';
import { AnswerOption } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';

interface QuestionnairePageProps {
  onComplete: (scores: Record<string, number>) => void;
}

const QuestionnairePage: React.FC<QuestionnairePageProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(AnswerOption | null)[]>(
    () => loadFromStorage('questionnaireAnswers') || new Array(QUESTIONNAIRE_DATA.length).fill(null)
  );

  useEffect(() => {
    saveToStorage('questionnaireAnswers', answers);
  }, [answers]);

  const handleAnswer = (option: AnswerOption) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONNAIRE_DATA.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const finalScores: Record<string, number> = {};
    answers.forEach(answer => {
      if (answer) {
        Object.entries(answer.scores).forEach(([area, score]) => {
          finalScores[area] = (finalScores[area] || 0) + (score as number);
        });
      }
    });
    onComplete(finalScores);
  };

  const progress = ((currentQuestionIndex + 1) / QUESTIONNAIRE_DATA.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Scopri il tuo percorso</h1>
      <p className="text-gray-600 text-center mb-8">Rispondi a queste domande per capire le tue inclinazioni.</p>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <QuestionCard
        question={QUESTIONNAIRE_DATA[currentQuestionIndex]}
        onAnswer={handleAnswer}
        selectedOption={answers[currentQuestionIndex]}
      />
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="bg-white text-gray-700 font-semibold py-2 px-6 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Indietro
        </button>
        {currentQuestionIndex < QUESTIONNAIRE_DATA.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestionIndex]}
            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Avanti
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!answers.every(a => a !== null)}
            className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Vedi i Risultati
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionnairePage;
