import { useState } from 'react';
import { View } from 'react-native';

import { Caption, H6Section, HoverEffect, Label } from '~/common/styleguide';
import TrendingMark from '~/components/Library/TrendingMark';
import DownloadsChart from '~/components/Package/DownloadsChart';
import { type LibraryType } from '~/types';
import { getStoredValue } from '~/util/localStorage';
import { cx } from '~/util/tailwind';

type Props = {
  library: LibraryType;
};

const DOWNLOAD_RANGE_KEY = '@ReactNativeDirectory:PackageScene:downloadRange';

export default function DownloadsSection({ library }: Props) {
  const [range, setRange] = useState(() => getStoredValue(DOWNLOAD_RANGE_KEY) ?? 'month');

  return (
    <View className="gap-y-3">
      <H6Section className="flex items-center justify-between">
        Downloads
        <View className="flex flex-row items-center gap-0.5">
          <HoverEffect
            onPress={() => {
              setRange('month');
              window.localStorage.setItem(DOWNLOAD_RANGE_KEY, 'month');
            }}
            className="outline-offset-1">
            <Label
              className={cx(
                'select-none font-light underline decoration-tertiary',
                cx(range === 'month' ? 'text-decoration-primary-dark' : 'text-secondary')
              )}>
              Last month
            </Label>
          </HoverEffect>
          <Label className="text-tertiary font-light">{' · '}</Label>
          <HoverEffect
            onPress={() => {
              setRange('year');
              window.localStorage.setItem(DOWNLOAD_RANGE_KEY, 'year');
            }}
            className="outline-offset-1">
            <Label
              className={cx(
                'select-none font-light underline decoration-tertiary',
                cx(range === 'year' ? 'text-decoration-primary-dark' : 'text-secondary')
              )}>
              Last year
            </Label>
          </HoverEffect>
        </View>
      </H6Section>
      <View className="border-border h-[54px] gap-1.5 overflow-hidden rounded-lg border">
        <DownloadsChart packageName={library.npmPkg} range={range} />
      </View>
      <View className="flex-row flex-wrap items-center justify-between">
        <Caption className="text-[13px] font-light">Popularity</Caption>
        <TrendingMark library={library} />
      </View>
    </View>
  );
}
