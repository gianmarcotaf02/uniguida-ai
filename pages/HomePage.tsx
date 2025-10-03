import React from 'react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: '🎯',
      title: 'Analisi Personalizzata',
      description: 'Quiz intelligente che analizza le tue inclinazioni e preferenze accademiche'
    },
    {
      icon: '🤖',
      title: 'Consulenza AI',
      description: 'Chat interattiva con intelligenza artificiale per consigli mirati e immediati'
    },
    {
      icon: '🎓',
      title: 'Database Universitario',
      description: 'Informazioni aggiornate su università, corsi e opportunità in tutta Italia'
    },
    {
      icon: '📊',
      title: 'Risultati Dettagliati',
      description: 'Report completi con suggerimenti per il tuo futuro accademico e professionale'
    }
  ];

  const stats = [
    { number: '500+', label: 'Corsi di Laurea' },
    { number: '100+', label: 'Università Partner' },
    { number: '10k+', label: 'Studenti Guidati' },
    { number: '95%', label: 'Soddisfazione' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Trova la tua
                <span className="text-gradient block mt-2">strada universitaria</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                UniGuida AI è il tuo consulente personale per l'orientamento universitario.
                Scopri il percorso di studi perfetto per te attraverso l'intelligenza artificiale.
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up animation-delay-200">
              <button
                onClick={() => onNavigate(Page.Questionnaire)}
                className="btn-primary w-full sm:w-auto px-8 py-4 text-lg shadow-soft-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🚀 Inizia il Questionario
              </button>
              <button
                onClick={() => onNavigate(Page.Chat)}
                className="btn-outline w-full sm:w-auto px-8 py-4 text-lg shadow-soft hover:shadow-soft-lg transform hover:scale-105 transition-all duration-200"
              >
                💬 Parla con l'IA
              </button>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up animation-delay-400">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.number}</div>
                  <div className="text-sm md:text-base text-gray-600 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perché scegliere UniGuida AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La tecnologia più avanzata al servizio del tuo futuro accademico
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover text-center group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto a iniziare il tuo viaggio?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Unisciti a migliaia di studenti che hanno già trovato la loro strada con UniGuida AI
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => onNavigate(Page.Questionnaire)}
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-4 px-8 rounded-lg shadow-soft-lg transition-all duration-200 transform hover:scale-105"
              >
                Inizia Ora Gratis
              </button>
              <button
                onClick={() => onNavigate(Page.Profile)}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Crea il tuo Profilo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
