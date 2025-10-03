import Papa from 'papaparse';
import { MURDataIntegrator } from '../data/murIntegration';
import { University } from '../data/universities';

export interface FileProcessResult {
  success: boolean;
  message: string;
  data?: University[];
  universities?: University[];
  universitiesCount?: number;
}

/**
 * Servizio per processare file MUR senza dipendere da Supabase Storage
 * Fallback per quando storage non è disponibile
 */
export class LocalFileProcessor {

  /**
   * Processa un file CSV/XLSX localmente senza upload
   */
  static async processFile(file: File, fileType: 'atenei' | 'iscritti' | 'laureati' | 'offerta-formativa'): Promise<FileProcessResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        complete: (results) => {
          try {
            console.log('🔍 Debug CSV parsing:');
            console.log('Numero righe:', results.data.length);
            console.log('Prima riga esempio:', results.data[0]);
            console.log('Colonne disponibili:', Object.keys(results.data[0] || {}));

            const universities: University[] = [];

            if (fileType === 'atenei') {
              // Mappatura flessibile per i nomi delle colonne
              const findColumn = (row: any, possibleNames: string[]): string | null => {
                for (const name of possibleNames) {
                  if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
                    return row[name];
                  }
                }
                return null;
              };

              // Processa file atenei
              results.data.forEach((row: any, index: number) => {
                // Debug prime 3 righe
                if (index < 3) {
                  console.log(`Riga ${index}:`, row);
                }

                // Cerca colonne con nomi diversi possibili
                const codAteneo = findColumn(row, ['COD_ATENEO', 'CODICE_ATENEO', 'CODICE', 'ID_ATENEO', 'cod_ateneo']);
                const nomeAteneo = findColumn(row, ['ATENEO', 'NOME_ATENEO', 'DENOMINAZIONE', 'UNIVERSITA', 'ateneo']);

                if (codAteneo && nomeAteneo) {
                  try {
                    // Crea oggetto normalizzato per MURDataIntegrator
                    const normalizedRow = {
                      COD_ATENEO: codAteneo,
                      ATENEO: nomeAteneo,
                      TIPO_ATENEO: findColumn(row, ['TIPO_ATENEO', 'TIPO', 'TIPOLOGIA', 'tipo_ateneo']) || 'Statale',
                      REGIONE: findColumn(row, ['REGIONE', 'regione']) || '',
                      PROVINCIA: findColumn(row, ['PROVINCIA', 'PROV', 'provincia']) || '',
                      COMUNE: findColumn(row, ['COMUNE', 'CITTA', 'CITY', 'comune']) || ''
                    };

                    const university = MURDataIntegrator.convertMURToUniversity(normalizedRow);
                    universities.push(university);
                  } catch (err) {
                    console.warn('Errore conversione riga:', row, err);
                  }
                } else {
                  // Debug righe che non passano la verifica
                  if (index < 5) {
                    console.warn(`Riga ${index} scartata - COD_ATENEO:`, codAteneo, 'ATENEO:', nomeAteneo);
                  }
                }
              });
            } else if (fileType === 'iscritti') {
              // Per ora logghiamo solo - futura implementazione per aggiornare dati esistenti
              console.log(`File iscritti processato: ${results.data.length} record`);
              results.data.forEach((row: any) => {
                if (row.COD_ATENEO && row.ISCRITTI_TOTALI) {
                  console.log(`${row.ATENEO}: ${row.ISCRITTI_TOTALI} iscritti`);
                }
              });
            }

            console.log(`✅ Processamento completato: ${universities.length} università elaborate da ${results.data.length} righe`);

            resolve({
              success: true,
              message: `File ${file.name} processato: ${universities.length} università elaborate`,
              data: universities,
              universities,
              universitiesCount: universities.length
            });

          } catch (error) {
            resolve({
              success: false,
              message: `Errore elaborazione: ${error}`,
              data: [],
              universities: [],
              universitiesCount: 0
            });
          }
        },
        error: (error) => {
          resolve({
            success: false,
            message: `Errore parsing CSV: ${error.message}`,
            data: [],
            universities: [],
            universitiesCount: 0
          });
        }
      });
    });
  }

  /**
   * Processa più file sequenzialmente
   */
  static async processMultipleFiles(files: File[], fileType: 'atenei' | 'iscritti' | 'laureati' | 'offerta-formativa'): Promise<FileProcessResult> {
    const results = [];
    let totalUniversities = 0;
    const allUniversities: University[] = [];

    for (const file of files) {
      const result = await this.processFile(file, fileType);

      if (result.success && result.universities) {
        allUniversities.push(...result.universities);
        totalUniversities += result.universitiesCount || 0;
      }

      results.push({
        fileName: file.name,
        success: result.success,
        message: result.message,
        universitiesCount: result.universitiesCount || 0
      });
    }

    const successfulFiles = results.filter(r => r.success);
    const failedFiles = results.filter(r => !r.success);

    return {
      success: successfulFiles.length > 0,
      message: `Processati ${successfulFiles.length}/${files.length} file. Totale: ${totalUniversities} università.${failedFiles.length > 0 ? ` ${failedFiles.length} file falliti.` : ''}`,
      data: allUniversities,
      universities: allUniversities,
      universitiesCount: totalUniversities
    };
  }

  /**
   * Valida formato file
   */
  static validateFile(file: File): { valid: boolean; message: string } {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      return {
        valid: false,
        message: `Formato file non supportato: ${fileExtension}. Usa CSV o XLSX.`
      };
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB
      return {
        valid: false,
        message: 'File troppo grande. Massimo 50MB.'
      };
    }

    return {
      valid: true,
      message: 'File valido'
    };
  }
}

export default LocalFileProcessor;
