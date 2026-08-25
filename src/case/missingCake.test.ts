import { describe, expect, it } from 'vitest';
import { missingCakeCase } from './missingCake';
import { getText } from './translations';
import type { LocalizedText } from './types';

function expectLocalized(text: LocalizedText) {
  expect(text.en.trim()).not.toBe('');
  expect(text.ru.trim()).not.toBe('');
}

function expectReferences(ids: string[], validIds: Set<string>) {
  for (const id of ids) {
    expect(validIds.has(id)).toBe(true);
  }
}

describe('missingCakeCase', () => {
  it('contains the required case content counts and stable scene IDs', () => {
    expect(missingCakeCase.locations).toHaveLength(5);
    expect(missingCakeCase.locations.map(({ sceneId }) => sceneId)).toHaveLength(5);
    expect(missingCakeCase.hotspots.length).toBeGreaterThanOrEqual(13);
    expect(missingCakeCase.evidence.filter(({ kind }) => kind === 'observation').length).toBeGreaterThanOrEqual(13);
    expect(missingCakeCase.statements.length).toBeGreaterThanOrEqual(10);
    expect(missingCakeCase.deductions.length).toBeGreaterThanOrEqual(3);
    expect(missingCakeCase.reconstruction).toHaveLength(5);
  });

  it('selects each language through the public translation helper', () => {
    expect(getText({ en: 'Kitchen', ru: 'Кухня' }, 'en')).toBe('Kitchen');
    expect(getText({ en: 'Kitchen', ru: 'Кухня' }, 'ru')).toBe('Кухня');
    for (const location of missingCakeCase.locations) {
      expectLocalized(location.title);
      expectLocalized(location.description);
    }
  });

  it('translates every visible case and theory option string', () => {
    expectLocalized(missingCakeCase.title);
    expectLocalized(missingCakeCase.introduction);
    for (const hotspot of missingCakeCase.hotspots) {
      expectLocalized(hotspot.title);
      expectLocalized(hotspot.description);
      if (hotspot.falseLead) expectLocalized(hotspot.falseLead);
    }
    for (const evidence of missingCakeCase.evidence) if (evidence.text) expectLocalized(evidence.text);
    for (const character of missingCakeCase.characters) {
      expectLocalized(character.name);
      expectLocalized(character.role);
      for (const question of character.questions) expectLocalized(question.text);
    }
    for (const statement of missingCakeCase.statements) expectLocalized(statement.text);
    for (const deduction of missingCakeCase.deductions) {
      expect(deduction.prompt.en).toBeTruthy();
      expect(deduction.prompt.ru).toBeTruthy();
      expectLocalized(deduction.title);
      expectLocalized(deduction.text);
    }
    for (const contradiction of missingCakeCase.contradictions) {
      expectLocalized(contradiction.title);
      expectLocalized(contradiction.prompt);
    }
    for (const field of missingCakeCase.theoryFields) {
      expectLocalized(field.prompt);
      for (const option of field.options) expectLocalized(option.label);
    }
    for (const step of missingCakeCase.reconstruction) {
      expectLocalized(step.timestamp);
      expectLocalized(step.text);
    }
  });

  it('keeps every cross-entity reference valid', () => {
    const locationIds = new Set(missingCakeCase.locations.map(({ id }) => id));
    const hotspotIds = new Set(missingCakeCase.hotspots.map(({ id }) => id));
    const evidenceIds = new Set(missingCakeCase.evidence.map(({ id }) => id));
    const statementIds = new Set(missingCakeCase.statements.map(({ id }) => id));
    const questionIds = new Set(missingCakeCase.characters.flatMap(({ questions }) => questions.map(({ id }) => id)));
    const deductionIds = new Set(missingCakeCase.deductions.map(({ id }) => id));
    const characterIds = new Set(missingCakeCase.characters.map(({ id }) => id));

    for (const location of missingCakeCase.locations) {
      if (location.unlockedBy) {
        expectReferences([location.unlockedBy.id], { hotspot: hotspotIds, statement: statementIds, question: questionIds, deduction: deductionIds }[location.unlockedBy.kind]);
      }
    }
    for (const hotspot of missingCakeCase.hotspots) {
      expectReferences([hotspot.locationId], locationIds);
      if (hotspot.observationId) expectReferences([hotspot.observationId], evidenceIds);
      if (hotspot.falseLeadEvidenceIds) expectReferences(hotspot.falseLeadEvidenceIds, evidenceIds);
    }
    for (const evidence of missingCakeCase.evidence) {
      if (evidence.kind === 'statement') {
        expect(evidence.statementId).toBeTruthy();
        expectReferences([evidence.statementId as string], statementIds);
      } else {
        expect(evidence.statementId).toBeUndefined();
      }
    }
    for (const statement of missingCakeCase.statements) expectReferences([statement.speakerId], characterIds);
    for (const character of missingCakeCase.characters) {
      for (const question of character.questions) {
        expectReferences(question.responseStatementIds, statementIds);
        if (question.unlockLocationIds) expectReferences(question.unlockLocationIds, locationIds);
        for (const condition of question.requires ?? []) {
          expectReferences([condition.id], { hotspot: hotspotIds, statement: statementIds, question: questionIds, deduction: deductionIds }[condition.kind]);
        }
      }
    }
    for (const deduction of missingCakeCase.deductions) expectReferences(deduction.requiresEvidenceIds, evidenceIds);
    for (const contradiction of missingCakeCase.contradictions) {
      expectReferences(contradiction.evidenceIds, evidenceIds);
      expectReferences([contradiction.initialStatementId, contradiction.revealedStatementId], statementIds);
    }
    for (const field of missingCakeCase.theoryFields) {
      expect(field.evidenceIds.length).toBeGreaterThan(0);
      expectReferences(field.evidenceIds, evidenceIds);
      expect(field.options.map(({ id }) => id)).toContain(field.value);
    }
    expect(new Set(missingCakeCase.reconstruction.map(({ id }) => id)).size).toBe(missingCakeCase.reconstruction.length);
  });

  it('provides placements for every hotspot and character in valid locations', () => {
    const locationIds = new Set(missingCakeCase.locations.map(({ id }) => id));
    for (const hotspot of missingCakeCase.hotspots) {
      expect(hotspot.placement.x).toBeGreaterThanOrEqual(0);
      expect(hotspot.placement.x).toBeLessThanOrEqual(1);
      expect(hotspot.placement.y).toBeGreaterThanOrEqual(0);
      expect(hotspot.placement.y).toBeLessThanOrEqual(1);
    }
    for (const character of missingCakeCase.characters) {
      expect(locationIds.has(character.locationId)).toBe(true);
      expect(character.placement.x).toBeGreaterThanOrEqual(0);
      expect(character.placement.x).toBeLessThanOrEqual(1);
      expect(character.placement.y).toBeGreaterThanOrEqual(0);
      expect(character.placement.y).toBeLessThanOrEqual(1);
    }
  });

  it('covers unlocks, contradiction, deductions, reconstruction, decorative hotspot, and false lead provenance', () => {
    expect(missingCakeCase.locations.find(({ id }) => id === 'shed')?.unlockedBy).toEqual({ kind: 'statement', id: 'petya-admits-shed' });
    expect(missingCakeCase.characters.flatMap(({ questions }) => questions).some(({ unlockLocationIds }) => unlockLocationIds?.includes('shed'))).toBe(true);
    expect(missingCakeCase.contradictions[0].evidenceIds).toHaveLength(2);
    expect(missingCakeCase.deductions.every(({ requiresEvidenceIds }) => requiresEvidenceIds.length > 0)).toBe(true);
    expect(missingCakeCase.reconstruction.map(({ id }) => id)).toEqual([
      'reconstruction-1', 'reconstruction-2', 'reconstruction-3', 'reconstruction-4', 'reconstruction-5',
    ]);
    const decorative = missingCakeCase.hotspots.filter(({ decorative }) => decorative);
    expect(decorative).toHaveLength(1);
    expect(decorative[0].observationId).toBeUndefined();
    const falseLead = missingCakeCase.hotspots.find(({ falseLead }) => falseLead);
    expect(falseLead?.falseLeadEvidenceIds?.length).toBeGreaterThan(0);
    expect(falseLead?.falseLead).toBeTruthy();
  });

  it('requires the contradiction before confession and uses Garden as the origin', () => {
    const confession = missingCakeCase.characters.flatMap(({ questions }) => questions).find(({ id }) => id === 'ask-petya-cake')!;
    expect(confession.requires).toContainEqual({ kind: 'statement', id: 'petya-admits-window' });
    expect(missingCakeCase.characters.flatMap(({ questions }) => questions).find(({ id }) => id === 'ask-anya-shed')?.unlockLocationIds).toBeUndefined();
    expect(missingCakeCase.theoryFields.find(({ id }) => id === 'origin')?.value).toBe('garden');
  });

  it('reuses translated entity labels in theory options', () => {
    const people = missingCakeCase.theoryFields.find(({ id }) => id === 'person')!;
    for (const option of people.options) expect(option.label).toBe(missingCakeCase.characters.find(({ id }) => id === option.id)!.name);
    const origins = missingCakeCase.theoryFields.find(({ id }) => id === 'origin')!;
    for (const option of origins.options) expect(option.label).toBe(missingCakeCase.locations.find(({ id }) => id === option.id)!.title);
  });
});
