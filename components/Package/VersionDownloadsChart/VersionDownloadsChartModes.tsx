import { View } from 'react-native';

import { Label } from '~/common/styleguide';
import { Button } from '~/components/Button';
import tw from '~/util/tailwind';

import { type ChartMode } from './types';

type Props = {
  mode: ChartMode;
  onModeChange: (mode: ChartMode) => void;
};

const CHART_MODES: { key: ChartMode; label: string }[] = [
  { key: 'version', label: 'All versions' },
  { key: 'minor', label: 'By minor' },
  { key: 'major', label: 'By major' },
];

export default function VersionDownloadsChartModes({ mode, onModeChange }: Props) {
  return (
    <View style={tw`flex-row gap-2 self-start`}>
      {CHART_MODES.map(({ key, label }) => (
        <Button
          key={key}
          onPress={() => onModeChange(key)}
          style={[
            tw`min-w-[92px] border bg-default px-3 py-1.5`,
            key === mode
              ? tw`border-[#bde0f7] bg-primary-hover dark:border-[#203b4d]`
              : tw`border-default`,
          ]}>
          <Label
            style={key === mode ? tw`text-primary-darker dark:text-primary` : tw`text-secondary`}>
            {label}
          </Label>
        </Button>
      ))}
    </View>
  );
}
