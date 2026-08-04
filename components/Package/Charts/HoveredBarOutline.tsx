import { DataContext } from '@visx/xychart';
import { use } from 'react';

import tw from '~/util/tailwind';

export type HoveredBarOutlineProps<Datum extends { label: string }> = {
  hoveredIndex: number | null;
  series: Datum[];
  orientation: 'vertical' | 'horizontal';
  xAccessor: (item: Datum) => string | number;
  yAccessor: (item: Datum) => string | number;
};

export default function HoveredBarOutline<Datum extends { label: string }>({
  hoveredIndex,
  series,
  orientation,
  xAccessor,
  yAccessor,
}: HoveredBarOutlineProps<Datum>) {
  const { xScale, yScale } = use(DataContext);

  if (hoveredIndex === null) {
    return null;
  }

  const datum = series[hoveredIndex];

  if (!datum || !xScale || !yScale) {
    return null;
  }

  const isDark = tw.prefixMatch('dark');
  const stroke = isDark ? 'var(--gray-2)' : 'var(--secondary)';

  if (orientation === 'vertical') {
    const bandScale = xScale as { bandwidth: () => number; (value: string): number };
    const linearScale = yScale as (value: number) => number;
    const x = bandScale(xAccessor(datum).toString());
    const y = linearScale(Number.parseInt(yAccessor(datum).toString(), 10));
    const baseline = linearScale(0);

    if (typeof x !== 'number' || typeof y !== 'number' || typeof baseline !== 'number') {
      return null;
    }

    return (
      <rect
        x={x}
        y={Math.min(y, baseline)}
        width={bandScale.bandwidth()}
        height={Math.abs(baseline - y)}
        rx={4}
        ry={4}
        fill="none"
        stroke={stroke}
        strokeWidth={1}
        pointerEvents="none"
      />
    );
  }

  const linearScale = xScale as (value: number) => number;
  const bandScale = yScale as { bandwidth: () => number; (value: string): number };
  const x = linearScale(Number.parseInt(xAccessor(datum).toString(), 10));
  const y = bandScale(yAccessor(datum).toString());
  const baseline = linearScale(0);

  if (typeof x !== 'number' || typeof y !== 'number' || typeof baseline !== 'number') {
    return null;
  }

  return (
    <rect
      x={Math.min(x, baseline)}
      y={y}
      width={Math.abs(baseline - x)}
      height={bandScale.bandwidth()}
      rx={4}
      ry={4}
      fill="none"
      stroke={stroke}
      strokeWidth={1}
      pointerEvents="none"
    />
  );
}
