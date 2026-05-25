import { useEffect, useId, useRef, useState } from 'react';
import { CURRENCIES } from '../lib/formatters';
import { LANGUAGES } from '../lib/i18n';
import Icon from './Icon';

const CURRENCY_ACCENTS = {
  USD: 'from-emerald-400/95 to-cyan-300/95',
  KRW: 'from-sky-400/95 to-violet-300/95',
  JPY: 'from-rose-300/95 to-amber-200/95',
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  KRW: '￦',
  JPY: '¥',
};

function SettingPicker({
  id,
  label,
  value,
  options,
  icon,
  isDark,
  open,
  onOpenChange,
  onChange,
}) {
  const menuId = useId();
  const pickerRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value) || options[0];
  const accentClass = icon === 'currency'
    ? CURRENCY_ACCENTS[value] || CURRENCY_ACCENTS.USD
    : 'from-blue-400/95 to-fuchsia-300/95';

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!pickerRef.current?.contains(event.target)) {
        onOpenChange(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenChange, open]);

  return (
    <div ref={pickerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}: ${selectedOption?.label || value}`}
        aria-controls={open ? menuId : undefined}
        onClick={() => onOpenChange(!open)}
        className={`${isDark ? 'text-stone-100 hover:bg-white/[0.12] focus-visible:ring-white/[0.3]' : 'text-neutral-900 hover:bg-white/[0.85] focus-visible:ring-neutral-900/[0.15]'} apple-control relative grid h-9 w-9 touch-manipulation place-items-center overflow-hidden text-sm font-semibold tabular-nums transition focus:outline-none focus-visible:ring-2`}
      >
        <span className={`pointer-events-none absolute inset-1 rounded-full bg-gradient-to-br ${accentClass} opacity-0 transition-opacity ${open ? 'opacity-30' : 'opacity-0'}`} />
        {icon === 'currency' ? (
          <span className="relative leading-none">
            {CURRENCY_SYMBOLS[value] || value}
          </span>
        ) : (
          <Icon name={icon} className="relative h-4 w-4" />
        )}
      </button>

      {open && (
        <div
          id={menuId}
          role="listbox"
          aria-labelledby={id}
          className={`${isDark ? 'apple-menu-dark bg-neutral-900/[0.88] ring-white/[0.12]' : 'apple-menu bg-white/[0.88] ring-black/[0.08]'} absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 overflow-hidden rounded-2xl p-1.5 ring-1 backdrop-blur-2xl`}
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  onOpenChange(false);
                }}
                className={`${selected ? (isDark ? 'bg-white/[0.12] text-white' : 'bg-neutral-950/[0.07] text-neutral-950') : (isDark ? 'text-stone-300 hover:bg-white/[0.08]' : 'text-neutral-600 hover:bg-neutral-950/[0.04]')} flex w-full touch-manipulation items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition`}
              >
                <span>{option.label}</span>
                <span className={`${selected ? 'opacity-100' : 'opacity-0'} grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br ${accentClass} text-neutral-950 transition-opacity`}>
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  const [openPicker, setOpenPicker] = useState('');

  const languageOptions = Object.entries(LANGUAGES).map(([value, label]) => ({
    value,
    label,
  }));
  const currencyOptions = Object.values(CURRENCIES).map((value) => ({
    value,
    label: value,
  }));

  return (
    <div className={`${isDark ? 'liquid-surface-dark bg-white/10 ring-white/10' : 'liquid-surface bg-white/[0.82] ring-white/80'} apple-radius flex w-fit items-center gap-1 p-1 ring-1 backdrop-blur-2xl`}>
      <button
        type="button"
        onClick={onThemeToggle}
        className={`${isDark ? 'bg-stone-100 text-neutral-950 hover:bg-white' : 'bg-neutral-950 text-white hover:bg-neutral-800'} apple-radius grid h-9 w-9 place-items-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20`}
        aria-label={isDark ? t.themeDark : t.themeLight}
      >
        <Icon name={isDark ? 'moon' : 'sun'} />
      </button>

      <SettingPicker
        id={languageSelectId}
        label={t.language}
        value={language}
        options={languageOptions}
        icon="globe"
        isDark={isDark}
        open={openPicker === 'language'}
        onOpenChange={(isOpen) => setOpenPicker(isOpen ? 'language' : '')}
        onChange={onLanguageChange}
      />

      <SettingPicker
        id={currencySelectId}
        label={t.currency}
        value={currency}
        options={currencyOptions}
        icon="currency"
        isDark={isDark}
        open={openPicker === 'currency'}
        onOpenChange={(isOpen) => setOpenPicker(isOpen ? 'currency' : '')}
        onChange={onCurrencyChange}
      />
    </div>
  );
}
