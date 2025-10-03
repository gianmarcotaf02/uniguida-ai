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
            const universities: University[] = [];

            if (fileType === 'atenei') {
              // Processa file atenei
              results.data.forEach((row: any) => {
                if (row.COD_ATENEO && row.ATENEO) {
                  try {
                    const university = MURDataIntegrator.convertMURToUniversity(row);
                    universities.push(university);
                  } catch (err) {
                    console.warn('Errore conversione riga:', row, err);
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
