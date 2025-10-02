import { Question, HighSchool } from './types';

export const INTEREST_AREAS: { id: string; label: string }[] = [
  { id: 'stem', label: 'STEM (Scienza, Tecnologia, Ingegneria, Matematica)' },
  { id: 'umanistico', label: 'Umanistico' },
  { id: 'economico', label: 'Economico-Sociale' },
  { id: 'sanitario', label: 'Sanitario' },
  { id: 'artistico', label: 'Artistico-Creativo' },
];

export const HIGH_SCHOOLS: HighSchool[] = [
    { id: 'classico', name: 'Liceo Classico' },
    { id: 'scientifico', name: 'Liceo Scientifico' },
    { id: 'linguistico', name: 'Liceo Linguistico' },
    { id: 'scienze_umane', name: 'Liceo delle Scienze Umane' },
    { id: 'artistico', name: 'Liceo Artistico' },
    { id: 'musicale_coreutico', name: 'Liceo Musicale e Coreutico' },
    { id: 'economico_sociale', name: 'Liceo delle Scienze Umane - opzione Economico-Sociale' },
    { id: 'scienze_applicate', name: 'Liceo Scientifico - opzione Scienze Applicate' },
    { id: 'sportivo', name: 'Liceo Scientifico - sezione a indirizzo Sportivo' },
    { id: 'tecnico_economico', name: 'Istituto Tecnico, settore Economico' },
    { id: 'tecnico_tecnologico', name: 'Istituto Tecnico, settore Tecnologico' },
    { id: 'professionale_servizi', name: 'Istituto Professionale, settore Servizi' },
    { id: 'professionale_industria', name: 'Istituto Professionale, settore Industria e Artigianato' },
];


export const QUESTIONNAIRE_DATA: Question[] = [
  {
    id: 1,
    text: 'Quale di queste attività ti attrae di più nel tempo libero?',
    options: [
      { text: 'Risolvere puzzle o giochi di logica.', scores: { stem: 3, economico: 1 } },
      { text: 'Leggere libri, scrivere o visitare musei.', scores: { umanistico: 3 } },
      { text: 'Organizzare eventi o gestire un piccolo budget.', scores: { economico: 3 } },
      { text: 'Prendermi cura di piante o animali.', scores: { sanitario: 3 } },
      { text: 'Disegnare, dipingere o suonare uno strumento.', scores: { artistico: 3 } },
    ],
  },
  {
    id: 2,
    text: 'Di fronte a un problema complesso, la tua prima reazione è:',
    options: [
      { text: 'Scomporlo in parti più piccole e analizzarlo logicamente.', scores: { stem: 3, economico: 1 } },
      { text: 'Considerare il contesto storico e le diverse prospettive.', scores: { umanistico: 3 } },
      { text: 'Cercare una soluzione pratica ed efficiente.', scores: { economico: 3 } },
      { text: 'Pensare a come la soluzione influenzerà le persone.', scores: { sanitario: 2, umanistico: 1 } },
      { text: 'Immaginare una soluzione creativa e fuori dagli schemi.', scores: { artistico: 3 } },
    ],
  },
  {
    id: 3,
    text: 'Quale materia scolastica trovavi più interessante?',
    options: [
      { text: 'Matematica o Fisica.', scores: { stem: 3 } },
      { text: 'Letteratura o Storia.', scores: { umanistico: 3 } },
      { text: 'Diritto o Economia.', scores: { economico: 3 } },
      { text: 'Biologia o Chimica.', scores: { sanitario: 2, stem: 1 } },
      { text: 'Arte o Musica.', scores: { artistico: 3 } },
    ],
  },
  {
    id: 4,
    text: 'Che tipo di impatto vorresti avere nel tuo futuro lavoro?',
    options: [
      { text: 'Innovare e sviluppare nuove tecnologie.', scores: { stem: 3 } },
      { text: 'Contribuire alla cultura e alla comprensione della società.', scores: { umanistico: 3 } },
      { text: 'Creare e gestire imprese di successo.', scores: { economico: 3 } },
      { text: 'Aiutare direttamente le persone a stare meglio.', scores: { sanitario: 3 } },
      { text: 'Esprimere la mia creatività e ispirare gli altri.', scores: { artistico: 3 } },
    ],
  },
  {
    id: 5,
    text: 'Quale ambiente di lavoro immagini per te?',
    options: [
      { text: 'Un laboratorio di ricerca o un\'azienda tecnologica.', scores: { stem: 3 } },
      { text: 'Una biblioteca, una casa editrice o un\'istituzione culturale.', scores: { umanistico: 3 } },
      { text: 'Un ufficio direzionale, una banca o una startup.', scores: { economico: 3 } },
      { text: 'Un ospedale, uno studio medico o un centro di riabilitazione.', scores: { sanitario: 3 } },
      { text: 'Uno studio di design, un\'agenzia creativa o un teatro.', scores: { artistico: 3 } },
    ],
  },
];
