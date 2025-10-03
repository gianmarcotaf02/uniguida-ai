import Papa from 'papaparse';
import { MURDataIntegrator } from '../data/murIntegration';
import { University } from '../data/universities';
import { supabase } from './supabaseService';

export interface FileUploadResult {
  success: boolean;
  message: string;
  data?: any[];
  filePath?: string;
}

export class SupabaseStorageService {
  private static BUCKET_NAME = 'mur-data-files';

  /**
   * Inizializza il bucket storage per i file MUR
   */
  static async initializeStorage(): Promise<boolean> {
    try {
      // Verifica se il bucket esiste
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();

      if (listError) {
        console.error('Error listing buckets:', listError);
        // Tenta di creare il bucket comunque
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);

      if (!bucketExists) {
        // Crea il bucket se non esiste
        const { error: createError } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: false, // Privato per sicurezza
          allowedMimeTypes: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
          fileSizeLimit: 52428800 // 50MB limit
        });

        if (createError) {
          console.error('Error creating bucket:', createError);
          // Se non può creare il bucket, proviamo senza storage
          console.warn('Proceeding without storage - file processing only');
          return false;
        }

        console.log('✅ Bucket creato con successo:', this.BUCKET_NAME);
      }

      return true;
    } catch (error) {
      console.error('Storage initialization error:', error);
      return false;
    }
  }  /**
   * Carica un file CSV/XLSX su Supabase Storage
   */
  static async uploadMURFile(file: File, fileType: 'atenei' | 'iscritti' | 'laureati' | 'offerta-formativa'): Promise<FileUploadResult> {
    try {
      // Inizializza storage se possibile
      const storageReady = await this.initializeStorage();

      let filePath = '';

      if (storageReady) {
        // Genera nome file unico
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `${fileType}_${timestamp}_${file.name}`;
        filePath = `mur-data/${fileName}`;

        // Upload file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.warn('Storage upload failed, proceeding with processing only:', uploadError.message);
          // Continua senza storage
        } else {
          console.log('✅ File uploadato su storage:', filePath);
        }
      }

      // Processa il file (questo funziona sempre)
      const processResult = await this.processUploadedFile(file, fileType);

      return {
        success: true,
        message: `File processato con successo: ${processResult.universitiesCount} università elaborate${storageReady ? ' e salvate su cloud' : ' (solo elaborazione)'}`,
        data: processResult.universities,
        filePath: filePath || 'processed-only'
      };

    } catch (error) {
      return {
        success: false,
        message: `Errore durante l'elaborazione: ${error}`
      };
    }
  }

  /**
   * Processa un file CSV caricato
   */
  private static async processUploadedFile(file: File, fileType: string): Promise<{ universities: University[], universitiesCount: number }> {
    return new Promise((resolve, reject) => {
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
                  const university = MURDataIntegrator.convertMURToUniversity(row);
                  universities.push(university);
                }
              });
            } else if (fileType === 'iscritti') {
              // Processa file iscritti (per aggiornare numeri studenti)
              results.data.forEach((row: any) => {
                if (row.COD_ATENEO && row.ISCRITTI_TOTALI) {
                  // Logica per aggiornare università esistenti con dati iscritti
                  console.log(`Ateneo ${row.ATENEO}: ${row.ISCRITTI_TOTALI} iscritti`);
                }
              });
            }

            resolve({
              universities,
              universitiesCount: universities.length
            });

          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Lista tutti i file MUR caricati
   */
  static async listMURFiles(): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('mur-data');

      if (error) {
        console.error('Error listing files:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('List files error:', error);
      return [];
    }
  }

  /**
   * Statistiche sui file caricati
   */
  static async getStorageStats(): Promise<{ fileCount: number, totalSize: number, lastUpdate: string }> {
    try {
      const files = await this.listMURFiles();
      const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      const lastUpdate = files.length > 0 ?
        Math.max(...files.map(f => new Date(f.updated_at || f.created_at).getTime())) : 0;

      return {
        fileCount: files.length,
        totalSize,
        lastUpdate: lastUpdate > 0 ? new Date(lastUpdate).toLocaleDateString() : 'Mai'
      };
    } catch (error) {
      console.error('Get storage stats error:', error);
      return {
        fileCount: 0,
        totalSize: 0,
        lastUpdate: 'Storage non disponibile'
      };
    }
  }

  /**
   * Scarica un file precedentemente caricato
   */
  static async downloadMURFile(filePath: string): Promise<Blob | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Download file error:', error);
      return null;
    }
  }

  /**
   * Elimina un file dal storage
   */
  static async deleteMURFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  /**
   * Salva le università elaborate nel database Supabase
   */
  static async saveUniversitiesToDB(universities: University[]): Promise<boolean> {
    try {
      // Crea tabella se non esiste
      const { error: createError } = await supabase.rpc('create_mur_universities_table');

      if (createError && !createError.message.includes('already exists')) {
        console.error('Error creating table:', createError);
      }

      // Inserisci università
      const { error: insertError } = await supabase
        .from('mur_universities')
        .upsert(universities.map(uni => ({
          id: uni.id,
          name: uni.name,
          short_name: uni.shortName,
          city: uni.city,
          region: uni.region,
          website: uni.website,
          type: uni.type,
          specializations: uni.specializations,
          tuition_min: uni.tuition.min,
          tuition_max: uni.tuition.max,
          students: uni.students,
          founded: uni.founded,
          updated_at: new Date().toISOString()
        })));

      if (insertError) {
        console.error('Error inserting universities:', insertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Save to DB error:', error);
      return false;
    }
  }

  /**
   * Recupera università dal database
   */
  static async getUniversitiesFromDB(): Promise<University[]> {
    try {
      const { data, error } = await supabase
        .from('mur_universities')
        .select('*')
        .order('students', { ascending: false });

      if (error) {
        console.error('Error fetching universities:', error);
        return [];
      }

      return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        shortName: row.short_name,
        city: row.city,
        region: row.region,
        website: row.website,
        type: row.type,
        specializations: row.specializations || [],
        tuition: {
          min: row.tuition_min,
          max: row.tuition_max
        },
        students: row.students,
        founded: row.founded
      }));
    } catch (error) {
      console.error('Fetch from DB error:', error);
      return [];
    }
  }

}

export default SupabaseStorageService;
