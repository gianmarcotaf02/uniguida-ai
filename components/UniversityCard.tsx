import React from 'react';
import { University } from '../data/universities';

interface UniversityCardProps {
  university: University;
  onClick?: () => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Apri il sito dell'università in una nuova tab
      window.open(university.website, '_blank');
    }
  };

  const getTuitionText = () => {
    if (university.type === 'pubblica') {
      return `€${university.tuition.min} - €${university.tuition.max}/anno (in base all'ISEE)`;
    }
    return `€${university.tuition.min} - €${university.tuition.max}/anno`;
  };

  const getTypeIcon = () => {
    switch (university.type) {
      case 'pubblica': return '🏛️';
      case 'privata': return '🏢';
      case 'telematica': return '💻';
      default: return '🎓';
    }
  };

  return (
    <div
      className="university-card"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="university-card-header">
        <div className="university-info">
          <h3 className="university-name">
            {getTypeIcon()} {university.shortName}
          </h3>
          <p className="university-full-name">{university.name}</p>
          <p className="university-location">📍 {university.city}, {university.region}</p>
        </div>
        {university.ranking && (
          <div className="university-ranking">
            <span className="ranking-badge">#{university.ranking}</span>
          </div>
        )}
      </div>

      <div className="university-details">
        <div className="detail-row">
          <span className="detail-label">👥 Studenti:</span>
          <span className="detail-value">{university.students.toLocaleString()}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">💰 Rette:</span>
          <span className="detail-value">{getTuitionText()}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">📅 Fondata:</span>
          <span className="detail-value">{university.founded}</span>
        </div>

        <div className="specializations">
          <span className="detail-label">🎯 Specializzazioni:</span>
          <div className="specialization-tags">
            {university.specializations.slice(0, 3).map((spec, index) => (
              <span key={index} className="specialization-tag">
                {spec}
              </span>
            ))}
            {university.specializations.length > 3 && (
              <span className="specialization-tag more">
                +{university.specializations.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="university-actions">
        <span className="visit-website">
          🔗 Visita il sito ufficiale
        </span>
      </div>

      <style>{`
        .university-card {
          border: 2px solid #e1e5e9;
          border-radius: 16px;
          padding: 20px;
          margin: 12px 0;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .university-card:hover {
          border-color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.15);
        }

        .university-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .university-name {
          font-size: 1.4em;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .university-full-name {
          font-size: 0.9em;
          color: #6b7280;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .university-location {
          font-size: 0.9em;
          color: #4b5563;
          margin: 0;
          font-weight: 500;
        }

        .ranking-badge {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.8em;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .university-details {
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          padding: 4px 0;
        }

        .detail-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9em;
        }

        .detail-value {
          color: #1f2937;
          font-weight: 500;
          font-size: 0.9em;
        }

        .specializations {
          margin-top: 12px;
        }

        .specialization-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .specialization-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: 500;
        }

        .specialization-tag.more {
          background: #f3f4f6;
          color: #6b7280;
        }

        .university-actions {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          text-align: center;
        }

        .visit-website {
          color: #4f46e5;
          font-weight: 600;
          font-size: 0.9em;
        }

        .university-card:hover .visit-website {
          color: #3730a3;
        }

        @media (max-width: 768px) {
          .university-card {
            padding: 16px;
          }

          .university-card-header {
            flex-direction: column;
            gap: 12px;
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};
