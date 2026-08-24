import type { RefObject } from 'react'
import type { Deduction, Evidence, Language } from '../case/types'
import { getText, caseUiText } from '../case/translations'

interface NotebookPanelProps {
  evidence: Evidence[];
  deductions: Deduction[];
  selectedIds: string[];
  completedIds: string[];
  language: Language;
  titleId?: string;
  closeRef?: RefObject<HTMLButtonElement | null>;
  onSelectEvidence(id: string): void;
  onMakeDeduction(id: string): void;
  onClose?: () => void;
  feedback?: string;
}

export function NotebookPanel({ evidence, deductions, selectedIds, completedIds, language, titleId = 'notebook-title', closeRef, onSelectEvidence, onMakeDeduction, onClose, feedback }: NotebookPanelProps) {
  const groups: [string, Evidence['kind']][] = [[getText(caseUiText.observations, language), 'observation'], [getText(caseUiText.statements, language), 'statement']]
  return <section className="notebook-panel" aria-labelledby={titleId}>
    {onClose && <button ref={closeRef} className="panel-close-button" type="button" onClick={onClose}>{getText(caseUiText.closeNotebook, language)}</button>}
    <div className="panel-title"><h2 id={titleId}>{getText(caseUiText.notebook, language)}</h2><span>{selectedIds.length} {getText(caseUiText.selectedCount, language)}</span></div>
    {groups.map(([title, kind]) => <div className="evidence-group" key={kind}><h3>{title}</h3>{evidence.filter((item) => item.kind === kind).map((item) => <button id={`evidence-${item.id}`} data-evidence-id={item.id} key={item.id} type="button" className={selectedIds.includes(item.id) ? 'evidence-item selected' : 'evidence-item'} aria-pressed={selectedIds.includes(item.id)} onClick={() => onSelectEvidence(item.id)}><span className="evidence-mark" aria-hidden="true">{kind === 'observation' ? '↗' : '“'}</span>{getText(item.text, language)}</button>)}{!evidence.some((item) => item.kind === kind) && <p className="empty-state">{getText(caseUiText.noEvidence, language)}</p>}</div>)}
    <div className="evidence-group"><h3>{getText(caseUiText.deductions, language)}</h3><p className="selected-evidence-label">{getText(caseUiText.selectedEvidence, language)}: {selectedIds.length}</p>{deductions.map((deduction) => <div className={completedIds.includes(deduction.id) ? 'deduction-item completed' : 'deduction-item'} data-deduction-id={deduction.id} key={deduction.id}><strong>{getText(deduction.title, language)}</strong>{completedIds.includes(deduction.id) && <span>{getText(deduction.text, language)}</span>}<button type="button" onClick={() => onMakeDeduction(deduction.id)}>{getText(caseUiText.makeDeduction, language)}</button></div>)}</div>
    {feedback && <p className="notebook-feedback" role="status">{feedback}</p>}
  </section>
}
