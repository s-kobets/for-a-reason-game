import type { RefObject } from 'react'
import type { Character, Contradiction, Evidence, Language, Question, Statement } from '../case/types'
import { getText, caseUiText } from '../case/translations'
import { FocusBoundary } from './FocusBoundary'

interface DialoguePanelProps {
  character?: Character;
  questions: Question[];
  askedQuestions: Question[];
  statements: Statement[];
  contradiction?: Contradiction;
  contradictionEvidence: Evidence[];
  language: Language;
  closeRef?: RefObject<HTMLButtonElement | null>;
  onAsk(questionId: string): void;
  onContradiction(): void;
  onClose(): void;
}

export function DialoguePanel({ character, questions, askedQuestions, statements, contradiction, contradictionEvidence, language, closeRef, onAsk, onContradiction, onClose }: DialoguePanelProps) {
  if (!character) return null
  return <div className="overlay" role="presentation"><FocusBoundary><section className="dialogue-panel" role="dialog" aria-modal="true" aria-labelledby="dialogue-title"><button ref={closeRef} className="close-button" type="button" onClick={onClose}>{getText(caseUiText.close, language)}</button><p className="eyebrow">{getText(character.role, language)}</p><h2 id="dialogue-title">{getText(character.name, language)}</h2><div className="dialogue-portrait" aria-hidden="true">{getText(character.name, language).slice(0, 1)}</div><div className="question-list"><h3>{getText(caseUiText.ask, language)}</h3>{questions.map((question) => <button key={question.id} type="button" onClick={() => onAsk(question.id)}>{getText(question.text, language)}</button>)}{askedQuestions.map((question) => <button key={question.id} type="button" disabled>{getText(question.text, language)}</button>)}{!questions.length && !askedQuestions.length && <p className="empty-state">{getText(caseUiText.noQuestions, language)}</p>}</div>{statements.length > 0 && <div className="dialogue-responses" role="status"><strong>{getText(caseUiText.responseReceived, language)}</strong>{statements.map((statement) => <p key={statement.id}>{getText(statement.text, language)}</p>)}</div>}{contradiction && <div className="contradiction-prompt"><p>{getText(contradiction.prompt, language)}</p><h3>{getText(caseUiText.contradictionEvidence, language)}</h3><ul>{contradictionEvidence.map((item) => item.text && <li key={item.id}>{getText(item.text, language)}</li>)}</ul><button className="contradiction-button" type="button" onClick={onContradiction}>{getText(caseUiText.presentContradiction, language)}</button></div>}</section></FocusBoundary></div>
}
