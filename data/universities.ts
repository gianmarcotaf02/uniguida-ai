// Database delle principali università italiane con informazioni dettagliate
export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  region: string;
  website: string;
  type: 'pubblica' | 'privata' | 'telematica';
  ranking?: number;
  specializations: string[];
  tuition: {
    min: number;
    max: number;
  };
  students: number;
  founded: number;
  logo?: string;
}

export const ITALIAN_UNIVERSITIES: University[] = [
  // LOMBARDIA
  {
    id: 'statale-milano',
    name: 'Università Statale di Milano',
    shortName: 'Unimi',
    city: 'Milano',
    region: 'Lombardia',
    website: 'https://www.unimi.it',
    type: 'pubblica',
    ranking: 1,
    specializations: ['Medicina', 'Scienze', 'Lettere', 'Giurisprudenza', 'Scienze Politiche'],
    tuition: { min: 156, max: 3900 },
    students: 64000,
    founded: 1924
  },
  {
    id: 'bocconi',
    name: 'Università Commerciale Luigi Bocconi',
    shortName: 'Bocconi',
    city: 'Milano',
    region: 'Lombardia',
    website: 'https://www.unibocconi.it',
    type: 'privata',
    ranking: 2,
    specializations: ['Economia', 'Management', 'Finanza', 'Data Science'],
    tuition: { min: 12000, max: 14000 },
    students: 13000,
    founded: 1902
  },
  {
    id: 'milano-bicocca',
    name: 'Università di Milano-Bicocca',
    shortName: 'Bicocca',
    city: 'Milano',
    region: 'Lombardia',
    website: 'https://www.unimib.it',
    type: 'pubblica',
    ranking: 8,
    specializations: ['Scienze', 'Medicina', 'Psicologia', 'Economia', 'Sociologia'],
    tuition: { min: 156, max: 3900 },
    students: 33000,
    founded: 1998
  },
  {
    id: 'polimi',
    name: 'Politecnico di Milano',
    shortName: 'PoliMi',
    city: 'Milano',
    region: 'Lombardia',
    website: 'https://www.polimi.it',
    type: 'pubblica',
    ranking: 3,
    specializations: ['Ingegneria', 'Architettura', 'Design'],
    tuition: { min: 156, max: 3900 },
    students: 47000,
    founded: 1863
  },

  // LAZIO
  {
    id: 'sapienza',
    name: 'Sapienza Università di Roma',
    shortName: 'Sapienza',
    city: 'Roma',
    region: 'Lazio',
    website: 'https://www.uniroma1.it',
    type: 'pubblica',
    ranking: 4,
    specializations: ['Medicina', 'Ingegneria', 'Lettere', 'Scienze', 'Giurisprudenza'],
    tuition: { min: 156, max: 3900 },
    students: 112000,
    founded: 1303
  },
  {
    id: 'luiss',
    name: 'Libera Università Internazionale degli Studi Sociali Guido Carli',
    shortName: 'LUISS',
    city: 'Roma',
    region: 'Lazio',
    website: 'https://www.luiss.it',
    type: 'privata',
    ranking: 5,
    specializations: ['Economia', 'Giurisprudenza', 'Scienze Politiche', 'Business'],
    tuition: { min: 10000, max: 12000 },
    students: 9000,
    founded: 1974
  },

  // PIEMONTE
  {
    id: 'unito',
    name: 'Università degli Studi di Torino',
    shortName: 'UniTO',
    city: 'Torino',
    region: 'Piemonte',
    website: 'https://www.unito.it',
    type: 'pubblica',
    ranking: 6,
    specializations: ['Medicina', 'Scienze', 'Lettere', 'Giurisprudenza', 'Psicologia'],
    tuition: { min: 156, max: 3900 },
    students: 78000,
    founded: 1404
  },
  {
    id: 'polito',
    name: 'Politecnico di Torino',
    shortName: 'PoliTO',
    city: 'Torino',
    region: 'Piemonte',
    website: 'https://www.polito.it',
    type: 'pubblica',
    ranking: 7,
    specializations: ['Ingegneria', 'Architettura'],
    tuition: { min: 156, max: 3900 },
    students: 35000,
    founded: 1859
  },

  // EMILIA-ROMAGNA
  {
    id: 'unibo',
    name: 'Alma Mater Studiorum - Università di Bologna',
    shortName: 'UniBo',
    city: 'Bologna',
    region: 'Emilia-Romagna',
    website: 'https://www.unibo.it',
    type: 'pubblica',
    ranking: 9,
    specializations: ['Medicina', 'Ingegneria', 'Lettere', 'Economia', 'Scienze'],
    tuition: { min: 156, max: 3900 },
    students: 87000,
    founded: 1088
  },

  // VENETO
  {
    id: 'unipd',
    name: 'Università degli Studi di Padova',
    shortName: 'UniPD',
    city: 'Padova',
    region: 'Veneto',
    website: 'https://www.unipd.it',
    type: 'pubblica',
    ranking: 10,
    specializations: ['Medicina', 'Ingegneria', 'Scienze', 'Lettere', 'Psicologia'],
    tuition: { min: 156, max: 3900 },
    students: 65000,
    founded: 1222
  },

  // TOSCANA
  {
    id: 'unifi',
    name: 'Università degli Studi di Firenze',
    shortName: 'UniFI',
    city: 'Firenze',
    region: 'Toscana',
    website: 'https://www.unifi.it',
    type: 'pubblica',
    ranking: 11,
    specializations: ['Medicina', 'Ingegneria', 'Lettere', 'Scienze', 'Architettura'],
    tuition: { min: 156, max: 3900 },
    students: 51000,
    founded: 1321
  },

  // CAMPANIA
  {
    id: 'unina',
    name: 'Università degli Studi di Napoli Federico II',
    shortName: 'UniNA',
    city: 'Napoli',
    region: 'Campania',
    website: 'https://www.unina.it',
    type: 'pubblica',
    ranking: 12,
    specializations: ['Medicina', 'Ingegneria', 'Lettere', 'Giurisprudenza', 'Architettura'],
    tuition: { min: 156, max: 3900 },
    students: 80000,
    founded: 1224
  },

  // SICILIA
  {
    id: 'unipa',
    name: 'Università degli Studi di Palermo',
    shortName: 'UniPA',
    city: 'Palermo',
    region: 'Sicilia',
    website: 'https://www.unipa.it',
    type: 'pubblica',
    ranking: 15,
    specializations: ['Medicina', 'Ingegneria', 'Lettere', 'Giurisprudenza'],
    tuition: { min: 156, max: 3900 },
    students: 44000,
    founded: 1806
  },

  // PUGLIA
  {
    id: 'uniba',
    name: 'Università degli Studi di Bari Aldo Moro',
    shortName: 'UniBA',
    city: 'Bari',
    region: 'Puglia',
    website: 'https://www.uniba.it',
    type: 'pubblica',
    ranking: 16,
    specializations: ['Medicina', 'Lettere', 'Giurisprudenza', 'Scienze'],
    tuition: { min: 156, max: 3900 },
    students: 58000,
    founded: 1925
  }
];

// Funzioni di utility per il database università
export function getUniversitiesByRegion(region: string): University[] {
  return ITALIAN_UNIVERSITIES.filter(uni => uni.region === region);
}

export function getUniversitiesBySpecialization(specialization: string): University[] {
  return ITALIAN_UNIVERSITIES.filter(uni =>
    uni.specializations.some(spec =>
      spec.toLowerCase().includes(specialization.toLowerCase())
    )
  );
}

export function getUniversityById(id: string): University | undefined {
  return ITALIAN_UNIVERSITIES.find(uni => uni.id === id);
}

export function searchUniversities(query: string): University[] {
  const lowerQuery = query.toLowerCase();
  return ITALIAN_UNIVERSITIES.filter(uni =>
    uni.name.toLowerCase().includes(lowerQuery) ||
    uni.shortName.toLowerCase().includes(lowerQuery) ||
    uni.city.toLowerCase().includes(lowerQuery) ||
    uni.specializations.some(spec => spec.toLowerCase().includes(lowerQuery))
  );
}
