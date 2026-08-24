import type { CaseSolution, Language } from '../case/types'
import { caseUiText, getText } from '../case/translations'
import type { Theory } from '../game/state'

export type TheoryResult = 'wrong' | 'partial' | 'complete'

interface TheoryPanelProps {
  theory: Theory;
  solution: CaseSolution;
  language: Language;
  result: TheoryResult | null;
  onChange(theory: Theory): void;
  onSubmit(): void;
}

const fields = [
  ['person', caseUiText.person],
  ['origin', caseUiText.origin],
  ['entryMethod', caseUiText.entryMethod],
  ['event', caseUiText.event],
  ['motive', caseUiText.motive],
] as const

export function TheoryPanel({ theory, solution, language, result, onChange, onSubmit }: TheoryPanelProps) {
  return <section className="theory-panel" data-mobile-order="2" aria-labelledby="theory-title">
    <div className="panel-title"><h2 id="theory-title">{getText(caseUiText.theory, language)}</h2></div>
    <div className="theory-fields">
      {fields.map(([field, label]) => <label key={field}>
        {getText(label, language)}
        <select aria-label={getText(label, language)} value={theory[field]} onChange={(event) => onChange({ ...theory, [field]: event.target.value })}>
          <option value="">{getText(caseUiText.chooseOption, language)}</option>
          {solution[field].options.map((option) => <option key={option.id} value={option.id}>{getText(option.label, language)}</option>)}
        </select>
      </label>)}
    </div>
    <button className="theory-submit" type="button" onClick={onSubmit}>{getText(caseUiText.submitTheory, language)}</button>
    {result && <p className={`theory-feedback theory-${result}`} role="status">{getText(caseUiText[`theory${result[0].toUpperCase()}${result.slice(1)}` as 'theoryWrong' | 'theoryPartial' | 'theoryComplete'], language)}</p>}
  </section>
}
