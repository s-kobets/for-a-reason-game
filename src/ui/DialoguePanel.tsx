import type { Character, Language, Question } from '../case/types'
import { getText, caseUiText } from '../case/translations'

interface DialoguePanelProps { character?: Character; questions: Question[]; language: Language; contradictionAvailable: boolean; onAsk(questionId: string): void; onContradiction(): void; onClose(): void }

export function DialoguePanel({ character, questions, language, contradictionAvailable, onAsk, onContradiction, onClose }: DialoguePanelProps) {
  if (!character) return null
  return <div className="overlay" role="presentation"><section className="dialogue-panel" role="dialog" aria-modal="true" aria-labelledby="dialogue-title"><button className="close-button" type="button" onClick={onClose}>{getText(caseUiText.close, language)}</button><p className="eyebrow">{getText(character.role, language)}</p><h2 id="dialogue-title">{getText(character.name, language)}</h2><div className="dialogue-portrait" aria-hidden="true">{character.name.en.slice(0, 1)}</div><div className="question-list"><h3>{getText(caseUiText.ask, language)}</h3>{questions.map((question) => <button key={question.id} type="button" onClick={() => onAsk(question.id)}>{getText(question.text, language)}</button>)}{!questions.length && <p className="empty-state">{getText(caseUiText.noQuestions, language)}</p>}</div>{contradictionAvailable && character.id === 'petya' && <button className="contradiction-button" type="button" onClick={onContradiction}>{getText(caseUiText.presentContradiction, language)}</button>} </section></div>
}
