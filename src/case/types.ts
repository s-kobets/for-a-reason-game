export type Language = 'en' | 'ru';

export type EvidenceKind = 'observation' | 'statement' | 'deduction';

export interface LocalizedText {
  en: string;
  ru: string;
}

export interface Condition {
  kind: 'hotspot' | 'statement' | 'question' | 'deduction';
  id: string;
}

export interface Location {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  sceneId: string;
  unlockedBy?: Condition;
}

export interface Hotspot {
  id: string;
  locationId: string;
  title: LocalizedText;
  description: LocalizedText;
  observationId?: string;
  decorative?: boolean;
  falseLead?: LocalizedText;
}

export interface Statement {
  id: string;
  speakerId: string;
  text: LocalizedText;
  kind?: 'initial' | 'revised' | 'admission';
}

export interface Question {
  id: string;
  text: LocalizedText;
  requires?: Condition[];
  responseStatementIds: string[];
  unlockLocationIds?: string[];
}

export interface Character {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  questions: Question[];
}

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  text: LocalizedText;
}

export interface Deduction {
  id: string;
  title: LocalizedText;
  text: LocalizedText;
  requiresEvidenceIds: string[];
}

export interface Contradiction {
  id: string;
  title: LocalizedText;
  prompt: LocalizedText;
  evidenceIds: string[];
  initialStatementId: string;
  revealedStatementId: string;
}

export interface SolutionField {
  value: string;
  evidenceIds: string[];
}

export interface CaseSolution {
  person: SolutionField;
  origin: SolutionField;
  entryMethod: SolutionField;
  event: SolutionField;
  motive: SolutionField;
}

export interface ReconstructionStep {
  id: string;
  timestamp: LocalizedText;
  text: LocalizedText;
  sceneId: string;
}

export interface CaseDefinition {
  id: string;
  title: LocalizedText;
  introduction: LocalizedText;
  locations: Location[];
  hotspots: Hotspot[];
  evidence: Evidence[];
  characters: Character[];
  statements: Statement[];
  deductions: Deduction[];
  contradiction: Contradiction;
  solution: CaseSolution;
  reconstruction: ReconstructionStep[];
}
