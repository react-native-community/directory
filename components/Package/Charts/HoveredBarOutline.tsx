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

type BandScale = {
  (value: string): number | undefined;
  bandwidth: () => number;
};

type ValueScale = (value: number) => number | undefined;

export default function HoveredBarOutline<Datum extends { label: string }>({
  hoveredIndex,
  series,
  orientation,
  xAccessor,
  yAccessor,
}: HoveredBarOutlineProps<Datum>) {
  const { xScale, yScale } = use(DataContext);
  const datum = hoveredIndex === null ? undefined : series[hoveredIndex];

  if (!datum || !xScale || !yScale) {
    return null;
  }

  const vertical = orientation === 'vertical';
  const bandScale = (vertical ? xScale : yScale) as BandScale;
  const valueScale = (vertical ? yScale : xScale) as ValueScale;
  const bandValue = (vertical ? xAccessor : yAccessor)(datum);
  const value = Number((vertical ? yAccessor : xAccessor)(datum));

  const bandStart = bandScale(String(bandValue));
  const valueEnd = valueScale(value);
  const baseline = valueScale(0);

  if (
    bandStart === undefined ||
    valueEnd === undefined ||
    baseline === undefined ||
    !Number.isFinite(valueEnd) ||
    !Number.isFinite(baseline)
  ) {
    return null;
  }

  const valueStart = Math.min(valueEnd, baseline);
  const valueSize = Math.abs(valueEnd - baseline);

  return (
    <rect
      x={vertical ? bandStart : valueStart}
      y={vertical ? valueStart : bandStart}
      width={vertical ? bandScale.bandwidth() : valueSize}
      height={vertical ? valueSize : bandScale.bandwidth()}
      rx={4}
      ry={4}
      fill="none"
      stroke={tw.prefixMatch('dark') ? 'var(--gray-2)' : 'var(--secondary)'}
      strokeWidth={1}
      opacity={0.75}
      pointerEvents="none"
    />
  );
}
