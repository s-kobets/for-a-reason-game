import type { RefObject } from 'react'
import type { Deduction, Evidence, Language } from '../case/types'
import { getText, caseUiText, formatRequiredClues } from '../case/translations'

interface NotebookPanelProps {
  evidence: Evidence[];
  deductions: Deduction[];
  selectedIds: string[];
  completedIds: string[];
  availableIds?: string[];
  language: Language;
  titleId?: string;
  closeRef?: RefObject<HTMLButtonElement | null>;
  onSelectEvidence(id: string): void;
  onMakeDeduction(): void;
  onClose?: () => void;
  feedback?: string;
}

export function NotebookPanel({ evidence, deductions, selectedIds, completedIds, availableIds = [], language, titleId = 'notebook-title', closeRef, onSelectEvidence, onMakeDeduction, onClose, feedback }: NotebookPanelProps) {
  const groups: [string, Evidence['kind']][] = [[getText(caseUiText.observations, language), 'observation'], [getText(caseUiText.statements, language), 'statement']]
  return <section className="notebook-panel" aria-labelledby={titleId}>
    {onClose && <button ref={closeRef} className="panel-close-button" type="button" onClick={onClose}>{getText(caseUiText.closeNotebook, language)}</button>}
    <div className="panel-title"><h2 id={titleId}>{getText(caseUiText.notebook, language)}</h2><span>{selectedIds.length} {getText(caseUiText.selectedCount, language)}</span></div>
     <div className="notebook-content">
       {groups.map(([title, kind]) => <div className={`notebook-column ${kind === 'observation' ? 'observations-column' : 'statements-column'}`} key={kind}><div className="evidence-group"><h3>{title}</h3>{evidence.filter((item) => item.kind === kind && item.text).map((item) => { const selected = selectedIds.includes(item.id); const text = getText(item.text!, language); return <button id={`evidence-${item.id}`} data-evidence-id={item.id} key={item.id} type="button" className={selected ? 'evidence-item selected' : 'evidence-item'} aria-pressed={selected} aria-label={`${text}${selected ? ` (${getText(caseUiText.selectedMarker, language)})` : ''}`} onClick={() => onSelectEvidence(item.id)}><span className="evidence-mark" aria-hidden="true">{kind === 'observation' ? '↗' : '“'}</span>{selected && <span className="selected-marker">{getText(caseUiText.selectedMarker, language)}</span>}<span>{text}</span></button> })}{!evidence.some((item) => item.kind === kind) && <p className="empty-state">{getText(caseUiText.noEvidence, language)}</p>}</div></div>)}
        <div className="notebook-column deductions-column"><div className="evidence-group"><h3>{getText(caseUiText.deductions, language)}</h3><p className="deduction-guide">{getText(caseUiText.deductionGuide, language)}</p><p className="selected-evidence-label">{getText(caseUiText.selectedEvidence, language)}: {selectedIds.length}</p><div role="list" aria-label={getText(caseUiText.deductions, language)}>{deductions.map((deduction) => completedIds.includes(deduction.id) ? <div role="listitem" className="deduction-item completed" data-deduction-id={deduction.id} key={deduction.id}><strong>{getText(deduction.title, language)}</strong><span>{getText(deduction.text, language)}</span></div> : <div role="listitem" className={`deduction-item locked${availableIds.includes(deduction.id) ? ' available' : ''}`} data-deduction-id={deduction.id} key={deduction.id}><strong>{getText(deduction.prompt, language)}</strong><span>{formatRequiredClues(deduction.requiresEvidenceIds.length, language)}</span></div>)}</div><button className="make-deduction-button" type="button" onClick={onMakeDeduction}>{getText(caseUiText.makeDeduction, language)}</button>{feedback && <p className="notebook-feedback" role="status">{feedback}</p>}</div></div>
     </div>
  </section>
}
