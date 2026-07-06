import { LinearGradient } from '@visx/gradient';
import { useParentSize } from '@visx/responsive';
import { Axis, BarSeries, Grid, Tooltip, XYChart } from '@visx/xychart';
import { View } from 'react-native';

import { Label } from '~/common/styleguide';
import { type PackageVersionsData } from '~/types';
import { formatBytes } from '~/util/formatBytes';
import tw from '~/util/tailwind';

const RECENT_RELEASE_COUNT = 20;
const HEIGHT = 280;
const LATEST_BAR_GRADIENT_ID = 'version-size-chart-gradient-latest';
const BAR_GRADIENT_ID = 'version-size-chart-gradient';

type VersionSizeChartData = {
  label: string;
  size: number;
  publishedAt: string;
};

type Props = {
  registryData: PackageVersionsData;
};

export default function VersionSizeChart({ registryData }: Props) {
  const isDark = tw.prefixMatch('dark');
  const { parentRef, width } = useParentSize({ debounceTime: 150 });

  const series = buildRecentVersionSizeSeries(
    registryData,
    width > 480 ? RECENT_RELEASE_COUNT : RECENT_RELEASE_COUNT / 2
  );

  if (!series.length) {
    return (
      <View style={tw`min-h-[220px] items-center justify-center`}>
        <Label style={tw`text-secondary`}>Size data unavailable</Label>
      </View>
    );
  }

  const maxSize = Math.max(...series.map(item => item.size), 0);
  const yDomain = maxSize ? [0, maxSize + Math.max(1, maxSize * 0.08)] : undefined;
  const latestVersion = series.at(-1)?.label;

  return (
    // @ts-expect-error Ref type miss-match
    <View style={tw`w-full gap-3`} ref={parentRef}>
      <XYChart
        width={width}
        height={HEIGHT}
        xScale={{
          type: 'band',
          paddingInner: series.length < RECENT_RELEASE_COUNT / 2 ? 0.55 : 0.24,
          paddingOuter: series.length < RECENT_RELEASE_COUNT / 2 ? 0.4 : 0.15,
        }}
        yScale={{ type: 'linear', domain: yDomain }}
        margin={{ top: 8, right: 12, bottom: 44, left: 58 }}>
        <LinearGradient
          id={BAR_GRADIENT_ID}
          from={isDark ? 'var(--primary-darker)' : 'var(--primary-darker)'}
          to={isDark ? 'var(--primary-darker)' : 'var(--primary-darker)'}
          fromOpacity={1}
          fromOffset={0.25}
          toOpacity={isDark ? 0.25 : 0.5}
        />
        <LinearGradient
          id={LATEST_BAR_GRADIENT_ID}
          from={isDark ? 'var(--primary)' : 'var(--primary-dark)'}
          to={isDark ? 'var(--primary)' : 'var(--primary-dark)'}
          fromOpacity={1}
          fromOffset={0.25}
          toOpacity={isDark ? 0.25 : 0.5}
        />
        <Grid
          rows
          columns={false}
          strokeDasharray="4 4"
          lineStyle={{
            stroke: isDark ? '#374151' : '#cecfd3',
            strokeOpacity: isDark ? 0.66 : 1,
            strokeWidth: 0.5,
          }}
        />
        <Axis
          orientation="bottom"
          hideAxisLine
          hideTicks
          numTicks={series.length}
          tickComponent={({ formattedValue = 'unknown', x, y }) => (
            <text
              x={x}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              transform={`rotate(-45 ${x ?? 0} ${y ?? 0})`}
              style={tw`select-none tabular-nums`}
              fill="var(--secondary)">
              <tspan x={x} style={tw`text-[11px] font-light`}>
                {formattedValue}
              </tspan>
            </text>
          )}
        />
        <Axis
          orientation="left"
          hideAxisLine
          hideTicks
          numTicks={4}
          tickFormat={value => formatBytes(Number(value))}
          tickComponent={({ formattedValue = 'unknown', x, y }) => (
            <text
              x={(x ?? 0) - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              style={tw`select-none tabular-nums`}
              fill={isDark ? 'var(--white)' : 'var(--black)'}>
              <tspan x={(x ?? 0) - 8} style={tw`text-[12px] font-light`}>
                {formattedValue}
              </tspan>
            </text>
          )}
        />
        <BarSeries
          dataKey="size"
          data={series}
          xAccessor={(item: VersionSizeChartData) => item.label}
          yAccessor={(item: VersionSizeChartData) => item.size}
          colorAccessor={(item: VersionSizeChartData) =>
            item.label === latestVersion
              ? `url(#${LATEST_BAR_GRADIENT_ID})`
              : `url(#${BAR_GRADIENT_ID})`
          }
          radius={4}
          radiusAll
        />
        <Tooltip<VersionSizeChartData>
          showVerticalCrosshair={false}
          showSeriesGlyphs={false}
          offsetLeft={8}
          offsetTop={6}
          detectBounds
          unstyled
          applyPositionStyle
          renderTooltip={({ tooltipData }) =>
            renderTooltipContent(tooltipData?.nearestDatum?.datum)
          }
        />
      </XYChart>
    </View>
  );
}

function buildRecentVersionSizeSeries(
  data: PackageVersionsData,
  count: number
): VersionSizeChartData[] {
  return Object.entries(data.versions)
    .filter(([version, versionData]) => {
      const publishedAt = data.time[version];
      const size = versionData.dist?.unpackedSize;

      if (version.includes('-')) {
        return false;
      }

      return Boolean(publishedAt) && typeof size === 'number';
    })
    .sort(
      (left, right) =>
        new Date(data.time[left[0]]).getTime() - new Date(data.time[right[0]]).getTime()
    )
    .slice(-count)
    .map(([version, versionData]) => ({
      label: version,
      size: versionData.dist!.unpackedSize!,
      publishedAt: data.time[version],
    }));
}

function renderTooltipContent(data?: VersionSizeChartData) {
  if (!data) {
    return null;
  }

  return (
    <View
      style={[
        tw`font-sans flex flex-col gap-px rounded bg-black px-2.5 py-1.5 text-xs font-light text-white dark:border dark:border-default`,
        { boxShadow: '0 8px 24px #00000088' },
      ]}>
      <span style={tw`text-[14px] font-medium tabular-nums`}>{data.label}</span>
      <span>{formatBytes(data.size)} package size</span>
      <span style={tw`text-palette-gray3 dark:text-secondary`}>
        Published {new Date(data.publishedAt).toLocaleDateString('en-US')}
      </span>
    </View>
  );
}
