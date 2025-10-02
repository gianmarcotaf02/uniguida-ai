import React, { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { INTEREST_AREAS } from '../constants';
import { openRouterService } from '../services/openRouterService';
import { supabaseService } from '../services/supabaseService';

interface ResultsPageProps {
  scores: Record<string, number> | null;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ scores }) => {
  const [motivation, setMotivation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const topAreaId = useMemo(() => {
    if (!scores || Object.keys(scores).length === 0) return null;
    const sortedScores = Object.entries(scores).sort((a, b) => (b[1] as number) - (a[1] as number));
    return sortedScores[0][0];
  }, [scores]);

  const topAreaLabel = useMemo(() => {
    return INTEREST_AREAS.find(area => area.id === topAreaId)?.label || topAreaId;
  }, [topAreaId]);

  useEffect(() => {
    const fetchMotivation = async () => {
      if (!scores || !topAreaLabel) {
        setMotivation("Completa il questionario per scoprire il tuo percorso ideale.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError('');

        // Salva i risultati nel cloud/localStorage
        await supabaseService.saveQuizResults(scores);

        // Genera la motivazione con OpenRouter
        const generatedMotivation = await openRouterService.generateMotivation(topAreaLabel, scores);
        setMotivation(generatedMotivation);
      } catch (err) {
        console.error('Error fetching motivation:', err);
        setError('Non è stato possibile generare la motivazione. Riprova più tardi.');
        setMotivation(`🎓 Fantastico! I tuoi risultati mostrano una forte inclinazione per l'area ${topAreaLabel}. Questo è un settore ricco di opportunità e il tuo profilo sembra perfettamente allineato con questo percorso di studi. Le prospettive professionali in questo campo sono eccellenti e potrai trovare la tua strada ideale!`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotivation();
  }, [topAreaLabel, scores]);

  if (!scores) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Nessun risultato</h2>
        <p className="text-gray-600">Per favore, completa prima il questionario per vedere i tuoi risultati.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">I tuoi Risultati</h1>
      <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-600">Il tuo percorso suggerito è nell'area</h2>
        <p className="text-4xl font-bold text-indigo-600 mt-2">{topAreaLabel}</p>
        <div className="mt-8 text-left text-gray-700 space-y-4 prose prose-indigo max-w-none">
          <h3 className="text-xl font-semibold text-gray-800 !mb-2">Analisi Personalizzata:</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500">L'IA sta elaborando i tuoi risultati...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-bold">Errore</p>
              <p>{error}</p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: motivation.replace(/\n/g, '<br />') }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
