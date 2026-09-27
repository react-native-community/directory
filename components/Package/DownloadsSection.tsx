import { useState } from 'react';
import { View } from 'react-native';

import { Caption, H6Section, HoverEffect, Label } from '~/common/styleguide';
import TrendingMark from '~/components/Library/TrendingMark';
import DownloadsChart from '~/components/Package/DownloadsChart';
import { type LibraryType } from '~/types';
import { getStoredValue } from '~/util/localStorage';
import tw from '~/util/tailwind';

type Props = {
  library: LibraryType;
};

const DOWNLOAD_RANGE_KEY = '@ReactNativeDirectory:PackageScene:downloadRange';

export default function DownloadsSection({ library }: Props) {
  const [range, setRange] = useState(() => getStoredValue(DOWNLOAD_RANGE_KEY) ?? 'month');

  return (
    <View style={tw`gap-y-3`}>
      <H6Section style={tw`flex items-center justify-between`}>
        Downloads
        <View style={tw`flex flex-row items-center gap-0.5`}>
          <HoverEffect
            onPress={() => {
              setRange('month');
              window.localStorage.setItem(DOWNLOAD_RANGE_KEY, 'month');
            }}
            style={tw`outline-offset-1`}>
            <Label
              style={[
                tw`select-none font-light underline decoration-tertiary`,
                range === 'month' ? tw`text-decoration-primary-dark` : tw`text-secondary`,
              ]}>
              Last month
            </Label>
          </HoverEffect>
          <Label style={tw`font-light text-tertiary`}>{' · '}</Label>
          <HoverEffect
            onPress={() => {
              setRange('year');
              window.localStorage.setItem(DOWNLOAD_RANGE_KEY, 'year');
            }}
            style={tw`outline-offset-1`}>
            <Label
              style={[
                tw`select-none font-light underline decoration-tertiary`,
                range === 'year' ? tw`text-decoration-primary-dark` : tw`text-secondary`,
              ]}>
              Last year
            </Label>
          </HoverEffect>
        </View>
      </H6Section>
      <View style={tw`h-[54px] gap-1.5 overflow-hidden rounded-lg border border-default`}>
        <DownloadsChart packageName={library.npmPkg} range={range} />
      </View>
      <View style={tw`flex-row flex-wrap items-center justify-between`}>
        <Caption style={tw`text-[13px] font-light`}>Popularity</Caption>
        <TrendingMark library={library} />
      </View>
    </View>
  );
}
