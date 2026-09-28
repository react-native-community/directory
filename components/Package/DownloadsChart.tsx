import { LinearGradient } from '@visx/gradient';
import { ParentSize } from '@visx/responsive';
import { AnimatedAreaSeries, Tooltip, XYChart } from '@visx/xychart';
import { maxBy } from 'es-toolkit/array';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import useSWR from 'swr';

import { Label } from '~/common/styleguide';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import { TimeRange } from '~/util/datetime';
import tw from '~/util/tailwind';

type DataMap = Record<string, number>;
type Point = { date: Date; value: number };

type Props = {
  packageName: string;
  range: string;
  height?: number;
};

const COLOR = '#2e9ab8';
const DATE_FORMAT = {
  month: 'short' as const,
  day: '2-digit' as const,
  year: '2-digit' as const,
};

export default function DownloadsChart({ packageName, range, height = 48 }: Props) {
  const { data } = useSWR(
    `/api/proxy/npm-stat?name=${packageName}&range=${range}`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  const series =
    data && Object.keys(data).length ? mapData(data[packageName], range === 'year') : null;
  const [animatedSeries, setAnimatedSeries] = useState<Point[] | null>(null);

  useEffect(() => {
    const nextSeries =
      data && Object.keys(data).length ? mapData(data[packageName], range === 'year') : null;
    if (!nextSeries) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setAnimatedSeries(nextSeries.map(point => ({ ...point, value: 0 })));
      requestAnimationFrame(() => setAnimatedSeries(nextSeries));
    });
    return () => cancelAnimationFrame(frame);
  }, [data, packageName, range]);

  const yDomain = getYDomain(series);

  return (
    <ParentSize>
      {({ width }) => {
        if (data && !Object.keys(data).length) {
          return (
            <View style={tw`h-full items-center justify-center`}>
              <Label style={tw`font-light text-secondary`}>Cannot fetch download data</Label>
            </View>
          );
        }

        if (!width || !data || !series || !animatedSeries) {
          return (
            <View style={tw`h-full items-center justify-center`}>
              <ThreeDotsLoader />
            </View>
          );
        }

        return (
          <XYChart
            width={width}
            height={height + 4}
            xScale={{ type: 'time' }}
            yScale={{ type: 'linear', nice: true, domain: yDomain }}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <LinearGradient
              id="area-gradient"
              from={COLOR}
              to={COLOR}
              fromOpacity={tw.prefixMatch('dark') ? 0.3 : 0.5}
              toOpacity={0}
            />
            <AnimatedAreaSeries
              dataKey="area"
              data={animatedSeries}
              xAccessor={(p: Point) => p.date.getTime()}
              yAccessor={(p: Point) => p.value}
              fill="url(#area-gradient)"
            />
            <Tooltip<Point>
              showVerticalCrosshair
              snapTooltipToDatumX
              showDatumGlyph
              glyphStyle={{
                fill: COLOR,
                stroke: 'white',
                strokeWidth: 0.5,
                r: 3,
              }}
              verticalCrosshairStyle={{
                stroke: COLOR,
                strokeWidth: 0.5,
                strokeDasharray: '4 1',
              }}
              offsetLeft={8}
              offsetTop={10}
              detectBounds
              unstyled
              applyPositionStyle
              renderTooltip={({ tooltipData }) => {
                const data = tooltipData?.nearestDatum?.datum;
                if (!data) {
                  return null;
                }
                return (
                  <Text
                    style={tw`font-sans flex flex-col rounded bg-black px-2.5 py-1.5 text-xs font-light text-white dark:border dark:border-default`}>
                    <span style={tw`text-palette-gray3 dark:text-secondary`}>
                      {data.date.toLocaleDateString('en-US', DATE_FORMAT)}
                      &apos;
                    </span>
                    <span>{data.value.toLocaleString()}</span>
                  </Text>
                );
              }}
            />
          </XYChart>
        );
      }}
    </ParentSize>
  );
}

function mapData(dataMap: DataMap, aggregateByWeek: boolean): Point[] {
  if (!aggregateByWeek) {
    return Object.entries(dataMap).map(([date, value]) => ({
      date: new Date(date + 'T00:00:00Z'),
      value,
    }));
  }

  const weeklyTotals = new Map<number, number>();
  for (const [date, value] of Object.entries(dataMap)) {
    const weekStart = getWeekStart(new Date(date + 'T00:00:00Z'));
    const weekKey = weekStart.getTime();
    weeklyTotals.set(weekKey, (weeklyTotals.get(weekKey) ?? 0) + value);
  }

  return [...weeklyTotals].map(([weekStart, value]) => ({
    date: new Date(weekStart),
    value,
  }));
}

function getWeekStart(date: Date): Date {
  const weekStart = new Date(date);
  weekStart.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return weekStart;
}

function getYDomain(series: Point[] | null) {
  if (!series?.length) {
    return undefined;
  }

  const max = maxBy(series, p => p.value)?.value ?? 0;
  return [0, max + Math.max(1, max * 0.15)];
}
