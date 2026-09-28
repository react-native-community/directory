import { View } from 'react-native';

import { Label, useLayout } from '~/common/styleguide';
import { Button } from '~/components/Button';
import tw from '~/util/tailwind';

import { type VersionsChartMode } from './types';

type Props = {
  mode: VersionsChartMode;
  onModeChange: (mode: VersionsChartMode) => void;
  downloadsPercentage: number;
};

const CHART_MODES: { key: VersionsChartMode; label: string; shortLabel: string }[] = [
  { key: 'version', label: 'All versions', shortLabel: 'All' },
  { key: 'minor', label: 'By minor', shortLabel: 'Minor' },
  { key: 'major', label: 'By major', shortLabel: 'Major' },
];

export default function VersionDownloadsChartModes({
  mode,
  onModeChange,
  downloadsPercentage,
}: Props) {
  const { isSmallScreen } = useLayout();
  return (
    <View style={[tw`w-full flex-row items-center gap-2`, isSmallScreen && tw`flex-col`]}>
      <View style={[tw`flex-1 flex-row flex-wrap gap-2`, isSmallScreen && tw`w-full gap-[3.3%]`]}>
        {CHART_MODES.map(({ key, label, shortLabel }) => (
          <Button
            key={key}
            onPress={() => onModeChange(key)}
            containerStyle={isSmallScreen ? tw`min-w-[30%] flex-1` : tw`min-w-[92px]`}
            style={[
              tw`border bg-default px-3 py-1.5`,
              key === mode
                ? tw`border-[#bde0f7] bg-primary-hover dark:border-[#203b4d]`
                : tw`border-default`,
            ]}>
            <Label
              style={key === mode ? tw`text-primary-darker dark:text-primary` : tw`text-secondary`}>
              {isSmallScreen ? shortLabel : label}
            </Label>
          </Button>
        ))}
      </View>
      <Label style={tw`shrink-0 text-right font-light text-secondary`}>
        <span style={tw`font-normal text-black dark:text-white`}>
          {downloadsPercentage.toLocaleString('en-US', {
            maximumFractionDigits: 1,
          })}
          %
        </span>{' '}
        on latest {mode}
      </Label>
    </View>
  );
}
