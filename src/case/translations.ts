import type { Language, LocalizedText } from './types';

export function getText(text: LocalizedText, language: Language): string {
  return text[language];
}

export const caseUiText = {
  caseFile: { en: 'Case file', ru: 'Дело' },
  reasoningGame: { en: 'A reasoning game', ru: 'Детективная игра' },
  map: { en: 'Map', ru: 'Карта' },
  notebook: { en: 'Notebook', ru: 'Блокнот' },
  close: { en: 'Close', ru: 'Закрыть' },
  inspect: { en: 'Inspect', ru: 'Осмотреть' },
  evidence: { en: 'Evidence', ru: 'Улика' },
  noEvidence: { en: 'No evidence here yet.', ru: 'Здесь пока нет улик.' },
  noQuestions: { en: 'No new questions.', ru: 'Новых вопросов нет.' },
  ask: { en: 'Ask', ru: 'Спросить' },
  talkTo: { en: 'Talk to', ru: 'Поговорить с' },
  contradictionReady: { en: 'The evidence is ready to challenge this story.', ru: 'Улик достаточно, чтобы оспорить эту историю.' },
  discovered: { en: 'Discovered', ru: 'Найдено' },
  selected: { en: 'Selected', ru: 'Выбрано' },
  selectEvidence: { en: 'Select evidence', ru: 'Выбрать улику' },
  selectedCount: { en: 'selected', ru: 'выбрано' },
  clearSelection: { en: 'Clear selection', ru: 'Снять выбор' },
  selectedEvidence: { en: 'Selected evidence', ru: 'Выбранные улики' },
  deductionAdded: { en: 'Deduction added.', ru: 'Вывод добавлен.' },
  notEnoughEvidence: { en: 'Not enough evidence for that deduction.', ru: 'Для этого вывода недостаточно улик.' },
  closeNotebook: { en: 'Close notebook', ru: 'Закрыть блокнот' },
  closeMap: { en: 'Close map', ru: 'Закрыть карту' },
  responseReceived: { en: 'Statement received', ru: 'Показание получено' },
  contradictionEvidence: { en: 'Evidence to present', ru: 'Улики для предъявления' },
  language: { en: 'Change language', ru: 'Сменить язык' },
  observations: { en: 'Observations', ru: 'Наблюдения' },
  statements: { en: 'Statements', ru: 'Показания' },
  deductions: { en: 'Deductions', ru: 'Выводы' },
  presentContradiction: { en: 'Present contradiction', ru: 'Предъявить противоречие' },
  makeDeduction: { en: 'Make deduction', ru: 'Сделать вывод' },
} satisfies Record<string, LocalizedText>;
