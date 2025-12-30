
export type UrgencyLevel = 'Green' | 'Yellow' | 'Red';

export interface MedicalGuidance {
  urgency: UrgencyLevel;
  department: string;
  checklist: string[];
  explanation: string;
  timestamp: number;
}

export interface UserInput {
  symptoms: string;
  language: string;
}

export type AppState = 'login' | 'home' | 'input' | 'processing' | 'result' | 'voice' | 'history';

export interface UserProfile {
  name: string;
  email: string;
}

export interface Report extends MedicalGuidance {
  id: string;
  symptoms: string;
}

export interface Clinic {
  name: string;
  address: string;
  url: string;
}
