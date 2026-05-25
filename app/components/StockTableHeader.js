import SortHeaderButton from './SortHeaderButton';

const HEADER_COLUMNS = [
  { key: 'rank', labelKey: 'rank', align: 'right' },
  { key: 'company', labelKey: 'company' },
  { key: 'price', labelKey: 'price', align: 'center' },
  { key: 'marketCap', labelKey: 'marketCap', align: 'center' },
];

const HEADER_VARIANTS = {
  desktop: {
    wrapper: 'stock-table-head grid min-h-14 min-w-[680px] grid-cols-[12%_30%_29%_29%] border-b text-xs font-semibold uppercase shadow-sm',
    cells: [
      'flex h-full items-center pl-0 pr-6 lg:pr-8',
      'flex h-full items-center px-6 lg:px-8',
      'flex h-full items-center px-6 lg:px-8',
      'flex h-full items-center pl-6 pr-0 lg:pl-8',
    ],
    alignOverrides: ['right', undefined, 'right', 'center'],
    buttonClassName: '',
  },
  mobile: {
    wrapper: 'stock-table-head grid min-h-16 grid-cols-[15%_32%_26%_27%] border-b text-xs font-semibold shadow-sm',
    cells: [
      'flex h-full items-center whitespace-nowrap px-2',
      'flex h-full items-center whitespace-nowrap px-3',
      'flex h-full items-center px-3 leading-tight',
      'flex h-full items-center px-3 leading-tight',
    ],
    alignOverrides: ['right', undefined, 'center', 'center'],
    buttonClassName: 'gap-1',
  },
};

export default function StockTableHeader({ t, isDark, sortConfig, onSort, variant, language }) {
  const config = HEADER_VARIANTS[variant];

  return (
    <div
      key={variant === 'mobile' ? language : undefined}
      className={`${isDark ? 'border-white/10 bg-stone-900 text-stone-400' : 'border-black/10 bg-white text-neutral-500'} ${config.wrapper}`}
    >
      {HEADER_COLUMNS.map((column, index) => (
        <div key={column.key} className={config.cells[index]}>
          <SortHeaderButton
            label={t[column.labelKey]}
            sortKey={column.key}
            sortConfig={sortConfig}
            onSort={onSort}
            align={config.alignOverrides[index] || column.align}
            className={config.buttonClassName}
          />
        </div>
      ))}
    </div>
  );
}
