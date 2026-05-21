import { memo } from 'react';
import StockTableDesktop from './StockTableDesktop';
import StockTableMobile from './StockTableMobile';

function StockTable(props) {
  const { isDark } = props;

  return (
    <div className={`${isDark ? 'border-white/10 bg-stone-900 shadow-black/20' : 'border-black/5 bg-white shadow-neutral-200/70'} overflow-hidden rounded-lg border shadow-lg sm:mx-auto sm:max-w-5xl`}>
      <StockTableMobile {...props} />
      <StockTableDesktop {...props} />
    </div>
  );
}

export default memo(StockTable);
