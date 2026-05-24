import { CURRENCIES } from '../lib/formatters';
import { LANGUAGES } from '../lib/i18n';
import Icon from './Icon';

export default function QuickSettings({
  t,
  isDark,
  idPrefix = 'header',
  language,
  currency,
  onThemeToggle,
  onLanguageChange,
  onCurrencyChange,
}) {
  const languageSelectId = `${idPrefix}-language-select`;
  const currencySelectId = `${idPrefix}-currency-select`;

  return (
    <div className={`${isDark ? 'liquid-surface-dark bg-white/10 ring-white/10' : 'liquid-surface bg-white/[0.82] ring-white/80'} apple-radius flex w-fit items-center gap-1 p-1 ring-1`}>
      <button
        type="button"
        onClick={onThemeToggle}
        className={`${isDark ? 'bg-stone-100 text-neutral-950' : 'bg-neutral-950 text-white'} apple-radius grid h-9 w-9 place-items-center transition`}
        aria-label={isDark ? t.themeDark : t.themeLight}
        title={isDark ? t.themeDark : t.themeLight}
      >
        <Icon name={isDark ? 'moon' : 'sun'} />
      </button>

      <div className="apple-radius relative grid h-9 w-9 place-items-center">
        <Icon name="globe" className={`${isDark ? 'text-stone-100' : 'text-neutral-900'} h-4 w-4`} />
        <label className="sr-only" htmlFor={languageSelectId}>{t.language}</label>
        <select
          id={languageSelectId}
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="apple-radius absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
          title={t.language}
        >
          {Object.entries(LANGUAGES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="apple-radius relative grid h-9 w-9 place-items-center">
        <Icon name="currency" className={`${isDark ? 'text-stone-100' : 'text-neutral-900'} h-4 w-4`} />
        <label className="sr-only" htmlFor={currencySelectId}>{t.currency}</label>
        <select
          id={currencySelectId}
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="apple-radius absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
          title={t.currency}
        >
          {Object.values(CURRENCIES).map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
