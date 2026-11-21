import { View } from 'react-native';

import { Label, useLayout } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { cx } from '~/util/tailwind';

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
    <View className={cx('w-full flex-row items-center gap-2', cx(isSmallScreen && 'flex-col'))}>
      <View
        className={cx('flex-1 flex-row flex-wrap gap-2', cx(isSmallScreen && 'w-full gap-[3.3%]'))}>
        {CHART_MODES.map(({ key, label, shortLabel }) => (
          <Button
            key={key}
            onPress={() => onModeChange(key)}
            containerClassName={isSmallScreen ? 'min-w-[30%] flex-1' : 'min-w-[92px]'}
            className={cx(
              'border bg-default px-3 py-1.5',
              cx(
                key === mode
                  ? 'border-[#bde0f7] bg-primary-hover dark:border-[#203b4d]'
                  : 'border-border'
              )
            )}>
            <Label
              className={cx(
                key === mode ? 'text-primary-darker dark:text-primary' : 'text-secondary'
              )}>
              {isSmallScreen ? shortLabel : label}
            </Label>
          </Button>
        ))}
      </View>
      <Label className="text-secondary shrink-0 text-right font-light">
        <span className="font-normal text-black dark:text-white">
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
