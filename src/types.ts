export type RiskLevel = "Low" | "Moderate" | "High";

export interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    value: number;
    impacts: {
      business?: number;
      marketing?: number;
      audience?: number;
      positioning?: number;
      cultural?: number;
    };
  }[];
  phase: number;
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AssessmentSession {
  id: string;
  userId?: string;
  answers: Record<string, number>;
  currentPhase: number;
  completedPhases: number[];
  timestamp: number;
  report?: string;
  scores?: {
    business: number;
    marketing: number;
    audience: number;
    positioning: number;
    cultural: number;
  };
}
