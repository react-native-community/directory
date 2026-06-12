import { View } from 'react-native';

import { Label, useLayout } from '~/common/styleguide';
import { Button } from '~/components/Button';
import tw from '~/util/tailwind';

import { type ChartMode } from './types';

type Props = {
  mode: ChartMode;
  onModeChange: (mode: ChartMode) => void;
};

const CHART_MODES: { key: ChartMode; label: string; shortLabel: string }[] = [
  { key: 'version', label: 'All versions', shortLabel: 'All' },
  { key: 'minor', label: 'By minor', shortLabel: 'Minor' },
  { key: 'major', label: 'By major', shortLabel: 'Major' },
];

export default function VersionDownloadsChartModes({ mode, onModeChange }: Props) {
  const { isSmallScreen } = useLayout();
  return (
    <View style={tw`flex-row gap-2 self-start`}>
      {CHART_MODES.map(({ key, label, shortLabel }) => (
        <Button
          key={key}
          onPress={() => onModeChange(key)}
          style={[
            tw`border bg-default px-3 py-1.5`,
            isSmallScreen ? tw`min-w-[62px]` : tw`min-w-[92px]`,
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
  );
}
