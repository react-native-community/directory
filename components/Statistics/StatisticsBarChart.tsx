import { LinearGradient } from '@visx/gradient';
import { useParentSize } from '@visx/responsive';
import { Axis, BarSeries, Grid, Tooltip, XYChart } from '@visx/xychart';
import { useId, useState } from 'react';
import { View } from 'react-native';

import { useLayout } from '~/common/styleguide';
import ChartTooltip from '~/components/Package/Charts/ChartTooltip';
import HoveredBarOutline from '~/components/Package/Charts/HoveredBarOutline';
import tw from '~/util/tailwind';

type StatisticEntry = {
  label: string;
  count: number;
  secondary?: boolean;
};

type ChartEntry = StatisticEntry & {
  percentage: number;
};

type Props = {
  data: StatisticEntry[];
  total: number;
};

const ROW_HEIGHT = 30;
const MIN_HEIGHT = 120;

export default function StatisticsBarChart({ data, total }: Props) {
  const { parentRef, width } = useParentSize({ debounceTime: 150 });
  const { isSmallScreen } = useLayout();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isDark = tw.prefixMatch('dark');
  const gradientId = `statistics-chart-gradient-${useId().replaceAll(':', '')}`;
  const secondaryGradientId = `${gradientId}-secondary`;
  const series: ChartEntry[] = data
    .map(entry => ({
      ...entry,
      percentage: total > 0 ? (entry.count / total) * 100 : 0,
    }))
    .sort(
      (left, right) =>
        Number(right.secondary === true) - Number(left.secondary === true) ||
        left.percentage - right.percentage
    );
  const height = Math.max(MIN_HEIGHT, series.length * ROW_HEIGHT + 42);
  const leftMargin = isSmallScreen ? 112 : 120;

  return (
    <View
      // @ts-expect-error Ref type miss-match
      ref={parentRef}
      style={tw`overflow-hidden rounded-lg border border-default p-3`}>
      <XYChart
        width={width}
        height={height}
        xScale={{ type: 'linear', domain: [0, 100] }}
        yScale={{ type: 'band', paddingInner: 0.23, paddingOuter: 0.15 }}
        margin={{ top: 2, right: 20, bottom: 24, left: leftMargin }}>
        <LinearGradient
          id={gradientId}
          from="var(--primary-darker)"
          to="var(--primary-darker)"
          toOpacity={1}
          toOffset={0.75}
          fromOpacity={isDark ? 0.25 : 0.5}
          rotate={-90}
        />
        <LinearGradient
          id={secondaryGradientId}
          from="var(--pewter)"
          to="var(--pewter)"
          toOpacity={1}
          toOffset={0.75}
          fromOpacity={isDark ? 0.25 : 0.5}
          rotate={-90}
        />
        <Grid
          columns
          rows={false}
          strokeDasharray="4 4"
          lineStyle={{
            stroke: isDark ? '#374151' : '#cecfd3',
            strokeOpacity: isDark ? 0.66 : 1,
            strokeWidth: 0.5,
          }}
        />
        <Axis
          orientation="bottom"
          numTicks={isSmallScreen ? 3 : 5}
          hideAxisLine
          hideTicks
          tickFormat={value => `${Math.round(Number(value))}%`}
          tickComponent={({ formattedValue = 'unknown', x, y }) => (
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={tw`select-none tabular-nums`}
              fill="var(--secondary)">
              <tspan x={x} style={tw`text-[12px] font-light`}>
                {formattedValue}
              </tspan>
            </text>
          )}
        />
        <Axis
          orientation="left"
          hideAxisLine
          hideTicks
          numTicks={series.length}
          tickComponent={({ formattedValue = 'unknown', x, y }) => (
            <text
              x={(x ?? 0) - 10}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              style={tw`select-none`}
              fill={isDark ? 'var(--white)' : 'var(--black)'}>
              <tspan x={(x ?? 0) - 10} style={tw`text-[12px]`}>
                {formattedValue}
              </tspan>
            </text>
          )}
        />
        <BarSeries
          dataKey="percentage"
          data={series}
          xAccessor={(item: ChartEntry) => item.percentage}
          yAccessor={(item: ChartEntry) => item.label}
          colorAccessor={(item: ChartEntry) =>
            `url(#${item.secondary ? secondaryGradientId : gradientId})`
          }
          radius={4}
          radiusAll
          onPointerMove={({ index }) => setHoveredIndex(index)}
          onPointerOut={() => setHoveredIndex(null)}
        />
        <HoveredBarOutline
          hoveredIndex={hoveredIndex}
          series={series}
          orientation="horizontal"
          xAccessor={item => item.percentage}
          yAccessor={item => item.label}
        />
        <Tooltip<ChartEntry>
          showVerticalCrosshair={false}
          showSeriesGlyphs={false}
          offsetLeft={8}
          offsetTop={6}
          detectBounds
          unstyled
          applyPositionStyle
          renderTooltip={({ tooltipData }) => {
            const entry = tooltipData?.nearestDatum?.datum;

            if (!entry) {
              return null;
            }

            return (
              <ChartTooltip>
                <span style={tw`text-[15px] mb-0.5 font-medium`}>{entry.label}</span>
                <span>
                  {entry.count.toLocaleString()} libraries ({entry.percentage.toFixed(2)}%)
                </span>
                <span style={tw`text-palette-gray3 dark:text-secondary`}>
                  out of {total.toLocaleString()} total libraries
                </span>
              </ChartTooltip>
            );
          }}
        />
      </XYChart>
    </View>
  );
}
