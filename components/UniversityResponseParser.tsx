import React from 'react';
import { ITALIAN_UNIVERSITIES } from '../data/universities';
import { UniversityCard } from './UniversityCard';

interface UniversityResponseParserProps {
  message: string;
}

export const UniversityResponseParser: React.FC<UniversityResponseParserProps> = ({ message }) => {
  // Regex per identificare le menzioni di università nel formato **🏛️ [NOME]**
  const universityPattern = /\*\*🏛️\s+([^*]+)\*\*/g;
  const matches = Array.from(message.matchAll(universityPattern));

  // Trova università corrispondenti nel database
  const mentionedUniversities = matches.map(match => {
    const universityName = match[1].trim();

    // Cerca nel database per nome o nome breve
    const found = ITALIAN_UNIVERSITIES.find(uni =>
      uni.name.toLowerCase().includes(universityName.toLowerCase()) ||
      uni.shortName.toLowerCase().includes(universityName.toLowerCase()) ||
      universityName.toLowerCase().includes(uni.shortName.toLowerCase())
    );

    return found;
  }).filter(Boolean);

  // Se non ci sono università da mostrare, mostra solo il testo
  if (mentionedUniversities.length === 0) {
    return (
      <div className="ai-response">
        <div className="message-content">
          {formatMessage(message)}
        </div>
      </div>
    );
  }

  // Dividi il messaggio prima e dopo le università per una migliore presentazione
  const parts = message.split(/\*\*🏛️[^*]+\*\*[\s\S]*?---/g);

  return (
    <div className="ai-response">
      <div className="message-content">
        {formatMessage(parts[0] || message.substring(0, message.indexOf('**🏛️')))}
      </div>

      {mentionedUniversities.length > 0 && (
        <div className="universities-section">
          <h4 className="universities-title">
            🎓 Università consigliate per te:
          </h4>
          {mentionedUniversities.map((university, index) => (
            <UniversityCard
              key={university!.id}
              university={university!}
            />
          ))}
        </div>
      )}

      {parts.length > 1 && parts[parts.length - 1] && (
        <div className="message-content">
          {formatMessage(parts[parts.length - 1])}
        </div>
      )}

      <style>{`
        .ai-response {
          max-width: 100%;
        }

        .message-content {
          line-height: 1.6;
          color: #374151;
        }

        .universities-section {
          margin: 20px 0;
          padding: 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          border: 1px solid #cbd5e1;
        }

        .universities-title {
          font-size: 1.2em;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 16px 0;
          text-align: center;
          padding-bottom: 12px;
          border-bottom: 2px solid #4f46e5;
        }

        .message-content h1,
        .message-content h2,
        .message-content h3 {
          color: #1e293b;
          margin-top: 24px;
          margin-bottom: 12px;
        }

        .message-content ul,
        .message-content ol {
          padding-left: 20px;
          margin: 12px 0;
        }

        .message-content li {
          margin-bottom: 8px;
        }

        .message-content strong {
          color: #1e293b;
          font-weight: 600;
        }

        .message-content em {
          color: #4f46e5;
          font-style: normal;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

// Funzione per formattare il testo con markdown base
function formatMessage(text: string): React.ReactNode {
  if (!text) return null;

  // Converti markdown in elementi React
  return text.split('\n').map((line, index) => {
    // Titoli
    if (line.startsWith('### ')) {
      return <h3 key={index}>{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index}>{line.substring(3)}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index}>{line.substring(2)}</h1>;
    }

    // Lista puntata
    if (line.match(/^[-*]\s/)) {
      return <li key={index}>{line.substring(2)}</li>;
    }

    // Lista numerata
    if (line.match(/^\d+\.\s/)) {
      return <li key={index}>{line.substring(line.indexOf('.') + 2)}</li>;
    }

    // Testo normale
    if (line.trim()) {
      return (
        <p key={index} style={{ margin: '8px 0' }}>
          {formatInlineMarkdown(line)}
        </p>
      );
    }

    // Riga vuota
    return <br key={index} />;
  });
}

// Formatta markdown inline (grassetto, corsivo)
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
