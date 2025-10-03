import Papa from 'papaparse';
import * as XLSX from 'xlsx';
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
      const fileName = file.name.toLowerCase();
      const isXLSX = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

      if (isXLSX) {
        // Processa file Excel
        this.processExcelFile(file, fileType, resolve);
      } else {
        // Processa file CSV
        this.processCSVFile(file, fileType, resolve);
      }
    });
  }

  /**
   * Processa file Excel (XLSX/XLS)
   */
  private static processExcelFile(file: File, fileType: string, resolve: Function) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Prendi il primo foglio
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Converti in JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('🔍 Debug XLSX parsing:');
        console.log('Numero righe:', jsonData.length);
        console.log('Prima riga esempio:', jsonData[0]);
        console.log('Colonne disponibili:', Object.keys(jsonData[0] || {}));

        this.processUniversityData(jsonData, fileType, file.name, resolve);
      } catch (error) {
        console.error('Errore parsing XLSX:', error);
        resolve({
          success: false,
          message: `Errore parsing Excel: ${error}`,
          data: [],
          universities: [],
          universitiesCount: 0
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Errore lettura file Excel',
        data: [],
        universities: [],
        universitiesCount: 0
      });
    };

    reader.readAsArrayBuffer(file);
  }

  /**
   * Processa file CSV
   */
  private static processCSVFile(file: File, fileType: string, resolve: Function) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        console.log('🔍 Debug CSV parsing:');
        console.log('Numero righe:', results.data.length);
        console.log('Prima riga esempio:', results.data[0]);
        console.log('Colonne disponibili:', Object.keys(results.data[0] || {}));

        this.processUniversityData(results.data, fileType, file.name, resolve);
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
  }

  /**
   * Processa i dati delle università (comune per CSV e XLSX)
   */
  private static processUniversityData(data: any[], fileType: string, fileName: string, resolve: Function) {
    try {
      const universities: University[] = [];

      if (fileType === 'atenei') {
        // Mappatura flessibile per i nomi delle colonne (case-insensitive)
        const findColumn = (row: any, possibleNames: string[]): string | null => {
          // Prima prova match esatto
          for (const name of possibleNames) {
            if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
              return row[name];
            }
          }

          // Poi prova case-insensitive
          const rowKeys = Object.keys(row);
          for (const name of possibleNames) {
            for (const key of rowKeys) {
              if (key.toLowerCase() === name.toLowerCase() &&
                  row[key] !== undefined && row[key] !== null && row[key] !== '') {
                console.log(`📝 Mapped column: "${key}" → "${name}"`);
                return row[key];
              }
            }
          }
          return null;
        };

        // Processa file atenei
        data.forEach((row: any, index: number) => {
          // Debug prime 3 righe
          if (index < 3) {
            console.log(`Riga ${index}:`, row);
          }

          // Cerca colonne con nomi diversi possibili (case-insensitive)
          const codAteneo = findColumn(row, [
            'COD_ATENEO', 'COD_Ateneo', 'cod_ateneo', 'Cod_Ateneo',
            'CODICE_ATENEO', 'Codice_Ateneo', 'codice_ateneo',
            'CODICE', 'Codice', 'codice',
            'ID_ATENEO', 'Id_Ateneo', 'id_ateneo'
          ]);

          const nomeAteneo = findColumn(row, [
            'ATENEO', 'Ateneo', 'ateneo',
            'NOME_ATENEO', 'Nome_Ateneo', 'nome_ateneo',
            'DENOMINAZIONE', 'Denominazione', 'denominazione',
            'UNIVERSITA', 'Universita', 'universita', 'Università'
          ]);

          const tipoAteneo = findColumn(row, [
            'TIPO_ATENEO', 'Tipo_Ateneo', 'tipo_ateneo',
            'TIPO', 'Tipo', 'tipo',
            'TIPOLOGIA', 'Tipologia', 'tipologia'
          ]);

          const regione = findColumn(row, [
            'REGIONE', 'Regione', 'regione'
          ]);

          const provincia = findColumn(row, [
            'PROVINCIA', 'Provincia', 'provincia',
            'PROV', 'Prov', 'prov'
          ]);

          const comune = findColumn(row, [
            'COMUNE', 'Comune', 'comune',
            'CITTA', 'Citta', 'citta', 'Città',
            'CITY', 'City', 'city'
          ]);

          if (codAteneo && nomeAteneo) {
            try {
              // Crea oggetto normalizzato per MURDataIntegrator
              const normalizedRow = {
                COD_ATENEO: codAteneo,
                ATENEO: nomeAteneo,
                TIPO_ATENEO: tipoAteneo || 'Statale',
                REGIONE: regione || '',
                PROVINCIA: provincia || '',
                COMUNE: comune || ''
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
        console.log(`File iscritti processato: ${data.length} record`);
        data.forEach((row: any) => {
          if (row.COD_ATENEO && row.ISCRITTI_TOTALI) {
            console.log(`${row.ATENEO}: ${row.ISCRITTI_TOTALI} iscritti`);
          }
        });
      }

      console.log(`✅ Processamento completato: ${universities.length} università elaborate da ${data.length} righe`);

      resolve({
        success: true,
        message: `File ${fileName} processato: ${universities.length} università elaborate`,
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
        message: `Formato file non supportato: ${fileExtension}. Usa CSV, XLSX o XLS.`
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
