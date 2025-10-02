export enum Page {
  Home,
  Questionnaire,
  Results,
  Chat,
  Profile,
}

export interface AnswerOption {
  text: string;
  scores: Record<string, number>;
}

export interface Question {
  id: number;
  text: string;
  options: AnswerOption[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface HighSchool {
    id: string;
    name: string;
}

export interface UserProfile {
    name: string;
    highSchool: HighSchool | null;
    city: string;
    interests: string[]; // array of interest area IDs
}
