import type { CaseDefinition, Language } from '../case/types';

export type Theory = Record<string, string>;

export interface GameState {
  locationId: string;
  openedLocationIds: string[];
  discoveredHotspotIds: string[];
  askedQuestionIds: string[];
  receivedStatementIds: string[];
  deductionIds: string[];
  selectedEvidenceIds: string[];
  resolvedContradictionIds: string[];
  theory: Theory;
  language: Language;
  reconstructionStep: number;
}

export function freshGameState(caseData: CaseDefinition): GameState {
  return {
    locationId: caseData.initialLocationId,
    openedLocationIds: [...caseData.initiallyOpenedLocationIds],
    discoveredHotspotIds: [],
    askedQuestionIds: [],
    receivedStatementIds: [],
    deductionIds: [],
    selectedEvidenceIds: [],
    resolvedContradictionIds: [],
    theory: Object.fromEntries(caseData.theoryFields.map(({ id }) => [id, ''])),
    language: 'en',
    reconstructionStep: 0,
  };
}
