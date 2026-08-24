import type { Language, LocalizedText } from './types';

export function getText(text: LocalizedText, language: Language): string {
  return text[language];
}

export const caseUiText = {
  observations: { en: 'Observations', ru: 'Наблюдения' },
  statements: { en: 'Statements', ru: 'Показания' },
  deductions: { en: 'Deductions', ru: 'Выводы' },
  presentContradiction: { en: 'Present contradiction', ru: 'Предъявить противоречие' },
  makeDeduction: { en: 'Make deduction', ru: 'Сделать вывод' },
} satisfies Record<string, LocalizedText>;
