import type { Language, TheoryField } from '../case/types'
import { caseUiText, getText } from '../case/translations'
import type { Theory } from '../game/state'

export type TheoryResult = 'wrong' | 'partial' | 'complete'

interface TheoryPanelProps {
  theory: Theory;
  fields: TheoryField[];
  language: Language;
  result: TheoryResult | null;
  onChange(theory: Theory): void;
  onSubmit(): void;
}

export function TheoryPanel({ theory, fields, language, result, onChange, onSubmit }: TheoryPanelProps) {
  return <section className="theory-panel" data-mobile-order="4" aria-labelledby="theory-title">
    <div className="panel-title"><h2 id="theory-title">{getText(caseUiText.theory, language)}</h2></div>
    <div className="theory-fields">
      {fields.map((field) => <label key={field.id}>
        {getText(field.prompt, language)}
        <select aria-label={getText(field.prompt, language)} value={theory[field.id] ?? ''} onChange={(event) => onChange({ ...theory, [field.id]: event.target.value })}>
          <option value="">{getText(caseUiText.chooseOption, language)}</option>
          {field.options.map((option) => <option key={option.id} value={option.id}>{getText(option.label, language)}</option>)}
        </select>
      </label>)}
    </div>
    <button className="theory-submit" type="button" onClick={onSubmit}>{getText(caseUiText.submitTheory, language)}</button>
    {result && <p className={`theory-feedback theory-${result}`} role="status">{getText(caseUiText[`theory${result[0].toUpperCase()}${result.slice(1)}` as 'theoryWrong' | 'theoryPartial' | 'theoryComplete'], language)}</p>}
  </section>
}
