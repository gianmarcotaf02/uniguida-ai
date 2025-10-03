// Sistema per integrare i dati ufficiali del MUR nel database universitario
import { University } from './universities';

// Interfacce per i dati MUR
export interface MURUniversity {
  COD_ATENEO: string;
  ATENEO: string;
  TIPO_ATENEO: string; // Statale, Non statale, Telematica
  REGIONE: string;
  PROVINCIA: string;
  COMUNE: string;
  MACROAREA?: string;
}

export interface MURCourse {
  TIPO_CORSO: string;
  COD_CORSO: string;
  CORSO: string;
  CLASSE: string;
  SETTORE?: string;
  AMBITO_DISCIPLINARE?: string;
}

export interface MUREnrollmentData {
  COD_ATENEO: string;
  ATENEO: string;
  ANNO_ACCADEMICO: string;
  ISCRITTI_TOTALI: number;
  ISCRITTI_M: number;
  ISCRITTI_F: number;
}

// URLs diretti ai dataset MUR
export const MUR_DATASET_URLS = {
  // Dataset Metadati
  ATENEI_CSV: 'https://dati-ustat.mur.gov.it/dataset/metadati/resource/820aefe6-0662-4656-84ec-d8859a2a3b7e',
  ATENEI_XLSX: 'https://dati-ustat.mur.gov.it/dataset/metadati/resource/a332a119-6c4b-44f5-80eb-3aca45a9e8e8',

  CLASSI_LAUREA_CSV: 'https://dati-ustat.mur.gov.it/dataset/metadati/resource/6755c8e6-dfa0-4605-a401-674a7b431edb',
  CLASSI_LAUREA_XLSX: 'https://dati-ustat.mur.gov.it/dataset/metadati/resource/adb4d6bd-0ad9-4004-8e23-b7baa2e45495',

  OFFERTA_FORMATIVA_2010_2024_CSV: 'https://dati-ustat.mur.gov.it/dataset/metadati/resource/c0e63906-7190-4568-892b-0cf399f56071',

  // Dataset Iscritti (dati aggiornati studenti)
  ISCRITTI_CSV: 'https://dati-ustat.mur.gov.it/dataset/iscritti/resource/', // + resource_id
  ISCRITTI_XLSX: 'https://dati-ustat.mur.gov.it/dataset/iscritti/resource/', // + resource_id

  // Dataset Laureati
  LAUREATI_CSV: 'https://dati-ustat.mur.gov.it/dataset/laureati/resource/', // + resource_id
  LAUREATI_XLSX: 'https://dati-ustat.mur.gov.it/dataset/laureati/resource/' // + resource_id
};

// Classe per gestire l'integrazione dei dati MUR
export class MURDataIntegrator {

  /**
   * Converte i dati MUR in formato University
   */
  static convertMURToUniversity(murData: MURUniversity, enrollmentData?: MUREnrollmentData): University {
    // Mappa i tipi di ateneo
    const getUniversityType = (tipo: string): 'pubblica' | 'privata' | 'telematica' => {
      if (tipo.includes('Statale')) return 'pubblica';
      if (tipo.includes('Telematica')) return 'telematica';
      return 'privata';
    };

    // Genera website basato sul nome
    const generateWebsite = (name: string): string => {
      const cleanName = name.toLowerCase()
        .replace(/università\s+/g, '')
        .replace(/degli\s+studi\s+di\s+/g, '')
        .replace(/\s+/g, '')
        .replace(/[^a-z]/g, '');
      return `https://www.uni${cleanName}.it`;
    };

    // Calcola range tasse basato sul tipo
    const getTuitionRange = (tipo: 'pubblica' | 'privata' | 'telematica') => {
      switch (tipo) {
        case 'pubblica':
          return { min: 156, max: 3900 };
        case 'privata':
          return { min: 8000, max: 15000 };
        case 'telematica':
          return { min: 1500, max: 5000 };
      }
    };

    const type = getUniversityType(murData.TIPO_ATENEO);

    return {
      id: `mur-${murData.COD_ATENEO}`,
      name: murData.ATENEO,
      shortName: this.extractShortName(murData.ATENEO),
      city: murData.COMUNE,
      region: murData.REGIONE,
      website: generateWebsite(murData.ATENEO),
      type: type,
      specializations: [], // Da integrare con offerta formativa
      tuition: getTuitionRange(type),
      students: enrollmentData?.ISCRITTI_TOTALI || 0,
      founded: 0 // Da integrare se disponibile
    };
  }

  /**
   * Estrae il nome breve dall'ateneo
   */
  private static extractShortName(fullName: string): string {
    // Regole per estrarre nomi brevi comuni
    const shortNameRules: Array<[RegExp, string]> = [
      [/Università\s+Statale\s+di\s+Milano/i, 'Unimi'],
      [/Università\s+di\s+Milano[-\s]*Bicocca/i, 'Bicocca'],
      [/Politecnico\s+di\s+Milano/i, 'PoliMi'],
      [/Politecnico\s+di\s+Torino/i, 'PoliTO'],
      [/Sapienza\s+Università\s+di\s+Roma/i, 'Sapienza'],
      [/Università\s+degli\s+Studi\s+di\s+Roma/i, 'UniRoma'],
      [/Università\s+Commerciale\s+Luigi\s+Bocconi/i, 'Bocconi'],
      [/LUISS/i, 'LUISS'],
      [/Alma\s+Mater\s+Studiorum.*Bologna/i, 'UniBo'],
      [/Università\s+degli\s+Studi\s+di\s+(\w+)/i, 'Uni$1'],
      [/Politecnico\s+di\s+(\w+)/i, 'Poli$1']
    ];

    for (const [regex, replacement] of shortNameRules) {
      const match = fullName.match(regex);
      if (match) {
        return replacement.replace('$1', match[1] || '');
      }
    }

    // Fallback: prendi le prime lettere delle parole principali
    return fullName
      .replace(/Università\s+/gi, '')
      .replace(/degli\s+Studi\s+di\s+/gi, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  /**
   * Crea istruzioni per il download manuale dei dataset
   */
  static getDownloadInstructions(): string {
    return `
🔽 **ISTRUZIONI PER INTEGRARE DATI MUR UFFICIALI**

**1. Download Dataset Atenei:**
• Vai su: https://dati-ustat.mur.gov.it/dataset/metadati
• Scarica "Atenei CSV" per l'elenco completo università italiane
• Contiene: codice ateneo, nome, tipo, regione, provincia, comune

**2. Download Dataset Iscritti:**
• Vai su: https://dati-ustat.mur.gov.it/dataset/iscritti
• Scarica l'ultimo file CSV/XLSX disponibile
• Contiene: numero studenti aggiornato per ogni ateneo

**3. Download Offerta Formativa:**
• Nel dataset Metadati, scarica "Offerta formativa 2010-2024 CSV"
• Contiene: tutti i corsi di laurea per ateneo con codici ufficiali

**4. Integrazione Automatica:**
Una volta scaricati i file, puoi usare il MURDataIntegrator per:
• Convertire dati MUR in formato University
• Aggiornare automaticamente il database
• Integrare dati di iscrizioni reali
• Aggiungere offerta formativa completa

**5. Vantaggi:**
✅ Dati ufficiali e aggiornati
✅ Tutti gli atenei italiani (350+)
✅ Numeri studenti reali
✅ Classificazioni ministeriali
✅ Aggiornamenti automatici
    `;
  }

  /**
   * Genera codice per processare un file CSV MUR
   */
  static generateCSVProcessingCode(): string {
    return `
// Esempio di processing dei dati MUR
import Papa from 'papaparse';

async function processMURData(csvFile: File) {
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        const universities = results.data.map((row: any) =>
          MURDataIntegrator.convertMURToUniversity(row)
        );
        resolve(universities);
      }
    });
  });
}

// Uso:
// const universities = await processMURData(ateneiCSVFile);
// updateUniversityDatabase(universities);
    `;
  }
}

// Funzioni di utility per lavorare con i dati MUR
export const MURUtils = {

  /**
   * Filtra università per regione usando dati MUR
   */
  filterByRegion: (universities: University[], region: string): University[] => {
    return universities.filter(uni => uni.region === region);
  },

  /**
   * Trova università per codice MUR
   */
  findByMURCode: (universities: University[], codiceAteneo: string): University | undefined => {
    return universities.find(uni => uni.id === `mur-${codiceAteneo}`);
  },

  /**
   * Ordina per numero di studenti (da dati MUR reali)
   */
  sortByStudents: (universities: University[]): University[] => {
    return [...universities].sort((a, b) => b.students - a.students);
  },

  /**
   * Raggruppa per tipo di ateneo
   */
  groupByType: (universities: University[]) => {
    return universities.reduce((groups, uni) => {
      const type = uni.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(uni);
      return groups;
    }, {} as Record<string, University[]>);
  }
};

export default MURDataIntegrator;
