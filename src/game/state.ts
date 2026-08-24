import type { Language } from '../case/types';

export interface Theory {
  person: string;
  origin: string;
  entryMethod: string;
  event: string;
  motive: string;
}

export interface GameState {
  locationId: string;
  openedLocationIds: string[];
  discoveredHotspotIds: string[];
  askedQuestionIds: string[];
  receivedStatementIds: string[];
  deductionIds: string[];
  selectedEvidenceIds: string[];
  theory: Theory;
  language: Language;
  reconstructionStep: number;
}

export const initialGameState: GameState = {
  locationId: 'kitchen',
  openedLocationIds: ['kitchen', 'living-room', 'garden', 'corridor'],
  discoveredHotspotIds: [],
  askedQuestionIds: [],
  receivedStatementIds: [],
  deductionIds: [],
  selectedEvidenceIds: [],
  theory: { person: '', origin: '', entryMethod: '', event: '', motive: '' },
  language: 'en',
  reconstructionStep: 0,
};

export function freshGameState(): GameState {
  return {
    ...initialGameState,
    openedLocationIds: [...initialGameState.openedLocationIds],
    theory: { ...initialGameState.theory },
  };
}
