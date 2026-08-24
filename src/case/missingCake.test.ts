import { describe, expect, it } from 'vitest';
import { missingCakeCase } from './missingCake';
import { getText } from './translations';

describe('missingCakeCase', () => {
  it('gives every location an English and Russian title', () => {
    for (const location of missingCakeCase.locations) {
      expect(getText(location.title, 'en')).toBeTruthy();
      expect(getText(location.title, 'ru')).toBeTruthy();
    }
  });

  it('supports every solution field with at least one evidence source', () => {
    const evidenceIds = new Set(missingCakeCase.evidence.map((evidence) => evidence.id));

    for (const key of ['person', 'origin', 'entryMethod', 'event', 'motive'] as const) {
      const field = missingCakeCase.solution[key];
      expect(field.evidenceIds.length).toBeGreaterThan(0);
      expect(field.evidenceIds.every((id) => evidenceIds.has(id))).toBe(true);
    }
  });
});
