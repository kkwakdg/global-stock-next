export default function SortHeaderButton({
  label,
  sortKey,
  sortConfig,
  onSort,
  align = 'left',
  className = '',
}) {
  const isActive = sortConfig?.key === sortKey;
  const isAscending = isActive && sortConfig.direction === 'asc';
  const isDescending = isActive && sortConfig.direction === 'desc';
  const alignmentClass = align === 'right'
    ? 'justify-end text-right'
    : align === 'center'
      ? 'justify-center text-center'
      : 'justify-start text-left';

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`${alignmentClass} ${className} flex min-h-8 w-full items-center gap-1.5 transition hover:text-current`}
    >
      <span>{label}</span>
      <span className="flex flex-col gap-0.5 text-[8px] leading-none">
        <span className={isAscending ? 'opacity-100' : 'opacity-30'}>▲</span>
        <span className={isDescending ? 'opacity-100' : 'opacity-30'}>▼</span>
      </span>
    </button>
  );
}
