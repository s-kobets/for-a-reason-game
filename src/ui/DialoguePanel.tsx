import type { RefObject } from 'react'
import type { Character, Contradiction, Evidence, Language, Question, Statement } from '../case/types'
import { getText, caseUiText } from '../case/translations'

interface DialoguePanelProps {
  character?: Character;
  questions: Question[];
  statements: Statement[];
  contradiction?: Contradiction;
  contradictionEvidence: Evidence[];
  language: Language;
  contradictionAvailable: boolean;
  closeRef?: RefObject<HTMLButtonElement | null>;
  onAsk(questionId: string): void;
  onContradiction(): void;
  onClose(): void;
}

export function DialoguePanel({ character, questions, statements, contradiction, contradictionEvidence, language, contradictionAvailable, closeRef, onAsk, onContradiction, onClose }: DialoguePanelProps) {
  if (!character) return null
  return <div className="overlay" role="presentation"><section className="dialogue-panel" role="dialog" aria-modal="true" aria-labelledby="dialogue-title" aria-describedby="dialogue-description"><button ref={closeRef} className="close-button" type="button" onClick={onClose}>{getText(caseUiText.close, language)}</button><p className="eyebrow">{getText(character.role, language)}</p><h2 id="dialogue-title">{getText(character.name, language)}</h2><p id="dialogue-description" className="dialogue-intro">{getText(caseUiText.ask, language)}</p><div className="dialogue-portrait" aria-hidden="true">{character.name.en.slice(0, 1)}</div><div className="question-list"><h3>{getText(caseUiText.ask, language)}</h3>{questions.map((question) => <button key={question.id} type="button" onClick={() => onAsk(question.id)}>{getText(question.text, language)}</button>)}{!questions.length && <p className="empty-state">{getText(caseUiText.noQuestions, language)}</p>}</div>{statements.length > 0 && <div className="dialogue-responses" role="status"><strong>{getText(caseUiText.responseReceived, language)}</strong>{statements.map((statement) => <p key={statement.id}>{getText(statement.text, language)}</p>)}</div>}{contradictionAvailable && contradiction && character.id === 'petya' && <div className="contradiction-prompt"><p>{getText(contradiction.prompt, language)}</p><h3>{getText(caseUiText.contradictionEvidence, language)}</h3><ul>{contradictionEvidence.map((item) => <li key={item.id}>{getText(item.text, language)}</li>)}</ul><button className="contradiction-button" type="button" onClick={onContradiction}>{getText(caseUiText.presentContradiction, language)}</button></div>}</section></div>
}
