import { LinearGradient } from '@visx/gradient';
import { ParentSize } from '@visx/responsive';
import { XYChart, AreaSeries, Tooltip, type AxisScale } from '@visx/xychart';
import { useMemo } from 'react';
import useSWR from 'swr';
import tw from '~/util/tailwind';
import { Text, View } from 'react-native';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import { Label } from '~/common/styleguide';
import { TimeRange } from '~/util/datetime';

type DataMap = Record<string, number>;
type Point = { date: Date; value: number };

type Props = {
  packageName: string;
  height?: number;
};

const COLOR = '#2e9ab8';
const DATE_FORMAT = {
  month: 'short' as const,
  day: '2-digit' as const,
  year: '2-digit' as const,
};

export default function SparklineVisX({ packageName, height = 48 }: Props) {
  const { data } = useSWR(
    `/api/proxy/npm-stat?name=${packageName}`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  const series = useMemo(
    () => (data && Object.keys(data).length ? mapData(data[packageName]) : null),
    [data, packageName]
  );

  const yDomain = useMemo(() => {
    if (!series?.length) {
      return undefined;
    }

    const max = series.reduce((acc, p) => Math.max(acc, p.value), 0);
    const startPadding = Math.max(1, max * 0.15);

    return [0, max + startPadding];
  }, [series]);

  return (
    <ParentSize>
      {({ width }) => {
        if (data && !Object.keys(data).length) {
          return (
            <View style={tw`h-full justify-center items-center`}>
              <Label style={tw`text-secondary font-light`}>Cannot fetch download data</Label>
            </View>
          );
        }

        if (!width || !data || !series) {
          return (
            <View style={tw`h-full justify-center items-center`}>
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
            <AreaSeries<AxisScale, AxisScale, Point>
              dataKey="area"
              data={series}
              xAccessor={(p: Point) => p.date.getTime()}
              yAccessor={(p: Point) => p.value}
              fill="url(#area-gradient)"
            />
            <Tooltip<Point>
              showVerticalCrosshair
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
                    style={tw`flex flex-col text-xs bg-black text-white font-sans font-light px-2.5 py-1.5 rounded dark:border dark:border-default`}>
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

function mapData(dataMap: DataMap): Point[] {
  return Object.entries(dataMap).map(([date, value]) => ({
    date: new Date(date + 'T00:00:00Z'),
    value,
  }));
}
