import React, { useEffect, useState } from 'react';
import { MURDataIntegrator } from '../data/murIntegration';
import SupabaseStorageService, { FileUploadResult } from '../services/supabaseStorageService';

interface MURIntegrationPanelProps {
  onDataIntegrated?: (newUniversities: any[]) => void;
}

interface StorageStats {
  fileCount: number;
  totalSize: number;
  lastUpdate: string;
}

export const MURIntegrationPanel: React.FC<MURIntegrationPanelProps> = ({ onDataIntegrated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'atenei' | 'iscritti' | 'laureati' | 'offerta-formativa'>('atenei');
  const [storageStats, setStorageStats] = useState<StorageStats>({ fileCount: 0, totalSize: 0, lastUpdate: 'Mai' });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // Carica statistiche storage all'avvio
  useEffect(() => {
    if (isExpanded) {
      loadStorageData();
    }
  }, [isExpanded]);

  const loadStorageData = async () => {
    try {
      const [stats, files] = await Promise.all([
        SupabaseStorageService.getStorageStats(),
        SupabaseStorageService.listMURFiles()
      ]);

      setStorageStats(stats);
      setUploadedFiles(files);
    } catch (err) {
      console.error('Error loading storage data:', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Verifica tipi file
    const invalidFiles = Array.from(files).filter(file =>
      !file.name.toLowerCase().includes('.csv') && !file.name.toLowerCase().includes('.xlsx')
    );

    if (invalidFiles.length > 0) {
      setError(`File non supportati: ${invalidFiles.map(f => f.name).join(', ')}. Usa solo CSV o XLSX.`);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const results = [];
      let totalUniversities = 0;

      // Processa ogni file sequenzialmente
      for (const file of Array.from(files)) {
        setSuccess(`Processando ${file.name}...`);

        // Upload e processamento tramite Supabase Storage
        const result: FileUploadResult = await SupabaseStorageService.uploadMURFile(file, fileType);

        if (result.success && result.data) {
          results.push({
            fileName: file.name,
            universitiesCount: result.data.length,
            universities: result.data
          });
          totalUniversities += result.data.length;

          // Salva nel database
          await SupabaseStorageService.saveUniversitiesToDB(result.data);
        } else {
          results.push({
            fileName: file.name,
            error: result.message
          });
        }
      }

      // Notifica risultati finali
      const successfulFiles = results.filter(r => !r.error);
      const failedFiles = results.filter(r => r.error);

      if (successfulFiles.length > 0) {
        // Combina tutte le università e notifica il parent
        const allUniversities = successfulFiles.reduce((acc, curr) => [...acc, ...curr.universities], []);
        if (onDataIntegrated) {
          onDataIntegrated(allUniversities);
        }

        setSuccess(
          `✅ Elaborati ${successfulFiles.length} file con successo! ` +
          `Totale: ${totalUniversities} università processate. ` +
          (failedFiles.length > 0 ? `⚠️ ${failedFiles.length} file falliti.` : '')
        );
      }

      if (failedFiles.length > 0) {
        setError(
          `❌ Errori nei file: ${failedFiles.map(f => `${f.fileName} (${f.error})`).join(', ')}`
        );
      }

      // Ricarica statistiche
      await loadStorageData();
    } catch (err) {
      setError('Errore durante l\'upload multiplo: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };  const handleLoadFromDatabase = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const universities = await SupabaseStorageService.getUniversitiesFromDB();

      if (universities.length > 0) {
        if (onDataIntegrated) {
          onDataIntegrated(universities);
        }
        setSuccess(`Caricate ${universities.length} università dal database`);
      } else {
        setError('Nessuna università trovata nel database');
      }
    } catch (err) {
      setError('Errore durante il caricamento dal database');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isExpanded) {
    return (
      <div className="mur-integration-compact">
        <button
          onClick={() => setIsExpanded(true)}
          className="integration-toggle"
        >
          📊 Integra Dati MUR Ufficiali
        </button>

        <style>{`
          .mur-integration-compact {
            margin: 16px 0;
          }

          .integration-toggle {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
          }

          .integration-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mur-integration-panel">
      <div className="panel-header">
        <h3>🏛️ Integrazione Dati MUR Ufficiali</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="close-button"
        >
          ✕
        </button>
      </div>

      <div className="panel-content">
        <div className="info-section">
          <p className="description">
            Integra i dati ufficiali del <strong>Ministero dell'Università e della Ricerca</strong>
            per avere informazioni aggiornate su tutti gli atenei italiani.
          </p>

          <div className="benefits">
            <h4>🎯 Vantaggi dell'integrazione:</h4>
            <ul>
              <li>✅ <strong>350+ università</strong> italiane ufficiali</li>
              <li>✅ <strong>Dati aggiornati</strong> su iscritti e laureati</li>
              <li>✅ <strong>Offerta formativa completa</strong> per ogni ateneo</li>
              <li>✅ <strong>Classificazioni ministeriali</strong> e codici ufficiali</li>
              <li>✅ <strong>Open Data</strong> - sempre aggiornati dal MUR</li>
            </ul>
          </div>
        </div>

        <div className="download-section">
          <h4>📥 Step 1: Download Dataset MUR</h4>
          <div className="download-links">
            <a
              href="https://dati-ustat.mur.gov.it/dataset/metadati"
              target="_blank"
              rel="noopener noreferrer"
              className="download-link primary"
            >
              📊 Dataset Metadati MUR
            </a>
            <a
              href="https://dati-ustat.mur.gov.it/dataset/iscritti"
              target="_blank"
              rel="noopener noreferrer"
              className="download-link secondary"
            >
              👥 Dataset Iscritti
            </a>
            <a
              href="https://dati-ustat.mur.gov.it/dataset/laureati"
              target="_blank"
              rel="noopener noreferrer"
              className="download-link secondary"
            >
              🎓 Dataset Laureati
            </a>
          </div>
        </div>

        <div className="upload-section">
          <h4>📤 Step 2: Carica File CSV</h4>

          {/* Selector tipo file */}
          <div className="file-type-selector">
            <label>Tipo di dataset:</label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value as any)}
              className="file-type-select"
            >
              <option value="atenei">🏛️ Atenei</option>
              <option value="iscritti">👥 Iscritti</option>
              <option value="laureati">🎓 Laureati</option>
              <option value="offerta-formativa">📚 Offerta Formativa</option>
            </select>
          </div>

          <div className="upload-area">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="file-input"
              id="mur-file-upload"
              multiple
            />
            <label htmlFor="mur-file-upload" className="upload-label">
              {isProcessing ? (
                <>🔄 Processando file...</>
              ) : (
                <>📁 Seleziona file CSV/XLSX (multipli supportati)</>
              )}
            </label>
            <p className="upload-hint">
              💡 <strong>Caricamento multiplo:</strong> Puoi selezionare più file contemporaneamente
              (Ctrl+Click su Windows, Cmd+Click su Mac)
            </p>
          </div>

          {/* Messaggi di stato */}
          {error && (
            <div className="status-message error">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="status-message success">
              ✅ {success}
            </div>
          )}

          {/* Statistiche storage */}
          <div className="storage-stats">
            <h5>📁 Storage Supabase:</h5>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">File caricati:</span>
                <span className="stat-value">{storageStats.fileCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Spazio utilizzato:</span>
                <span className="stat-value">{formatFileSize(storageStats.totalSize)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Ultimo aggiornamento:</span>
                <span className="stat-value">{storageStats.lastUpdate}</span>
              </div>
            </div>
          </div>

          {/* Pulsante carica dal database */}
          <div className="database-section">
            <button
              onClick={handleLoadFromDatabase}
              disabled={isProcessing}
              className="load-database-btn"
            >
              {isProcessing ? '🔄 Caricamento...' : '💾 Carica dal Database'}
            </button>
          </div>

          <div className="file-info">
            <p><strong>File multipli supportati:</strong></p>
            <ul>
              <li>• <code>Atenei.csv</code> - Elenco completo università</li>
              <li>• <code>Iscritti_[Anno].csv</code> - Dati studenti aggiornati</li>
              <li>• <code>Offerta_Formativa_2010-2024.csv</code> - Corsi disponibili</li>
              <li>• <strong>💡 Seleziona più file insieme</strong> - Ctrl+Click (Windows) o Cmd+Click (Mac)</li>
            </ul>
          </div>
        </div>

        <div className="instructions-section">
          <h4>🔧 Step 3: Istruzioni Dettagliate</h4>
          <div className="code-block">
            <pre>{MURDataIntegrator.getDownloadInstructions()}</pre>
          </div>
        </div>

        <div className="status-section">
          <div className="current-status">
            <h4>📈 Stato Attuale Database:</h4>
            <div className="stats">
              <span className="stat-item">🏛️ <strong>15</strong> università nel database</span>
              <span className="stat-item">📊 <strong>Dati manuali</strong> - non aggiornati</span>
              <span className="stat-item">🔄 <strong>Integrazione MUR</strong> - disponibile</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mur-integration-panel {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px solid #cbd5e1;
          border-radius: 16px;
          margin: 20px 0;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .panel-header {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 1.3em;
          font-weight: 700;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 1.2em;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.3s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .panel-content {
          padding: 24px;
        }

        .info-section {
          margin-bottom: 24px;
        }

        .description {
          font-size: 1.1em;
          line-height: 1.6;
          color: #374151;
          margin-bottom: 16px;
        }

        .benefits h4 {
          color: #1e293b;
          margin-bottom: 12px;
          font-size: 1.1em;
        }

        .benefits ul {
          list-style: none;
          padding: 0;
        }

        .benefits li {
          padding: 8px 0;
          color: #374151;
          font-size: 0.95em;
        }

        .download-section, .upload-section, .instructions-section, .status-section {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .download-section:last-child,
        .upload-section:last-child,
        .instructions-section:last-child,
        .status-section:last-child {
          border-bottom: none;
        }

        .download-section h4, .upload-section h4, .instructions-section h4, .status-section h4 {
          color: #1e293b;
          margin-bottom: 12px;
          font-size: 1.1em;
        }

        .download-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .download-link {
          padding: 12px 20px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .download-link.primary {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }

        .download-link.secondary {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          color: white;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .download-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .upload-area {
          margin-bottom: 16px;
        }

        .file-type-selector {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .file-type-selector label {
          font-weight: 600;
          color: #374151;
        }

        .file-type-select {
          padding: 8px 12px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          background: white;
          font-weight: 500;
          min-width: 200px;
        }

        .file-input {
          display: none;
        }

        .upload-label {
          display: inline-block;
          padding: 16px 24px;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          color: white;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .upload-label:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }

        .upload-hint {
          margin-top: 8px;
          font-size: 0.9em;
          color: #6b7280;
          text-align: center;
          font-style: italic;
        }

        .status-message {
          padding: 12px 16px;
          border-radius: 8px;
          margin: 12px 0;
          font-weight: 600;
        }

        .status-message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .status-message.success {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .storage-stats {
          background: #f8fafc;
          padding: 16px;
          border-radius: 10px;
          margin: 16px 0;
          border: 1px solid #e2e8f0;
        }

        .storage-stats h5 {
          margin: 0 0 12px 0;
          color: #374151;
          font-size: 1em;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.9em;
        }

        .stat-value {
          font-weight: 600;
          color: #374151;
        }

        .database-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .load-database-btn {
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .load-database-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .load-database-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .file-info {
          background: #f1f5f9;
          padding: 16px;
          border-radius: 10px;
          border-left: 4px solid #3b82f6;
        }

        .file-info p {
          margin: 0 0 8px 0;
          font-weight: 600;
          color: #1e293b;
        }

        .file-info ul {
          margin: 0;
          padding-left: 16px;
        }

        .file-info li {
          margin-bottom: 4px;
          color: #475569;
        }

        .code-block {
          background: #1e293b;
          color: #e2e8f0;
          padding: 20px;
          border-radius: 10px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          line-height: 1.5;
        }

        .current-status {
          background: #f8fafc;
          padding: 16px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .stat-item {
          background: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.9em;
          border: 1px solid #e2e8f0;
          color: #374151;
        }

        @media (max-width: 768px) {
          .download-links {
            flex-direction: column;
          }

          .stats {
            flex-direction: column;
            gap: 8px;
          }

          .panel-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default MURIntegrationPanel;
