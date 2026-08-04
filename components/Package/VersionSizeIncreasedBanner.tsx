import { View } from 'react-native';

import { Label } from '~/common/styleguide';
import { WarningIcon } from '~/components/Icons';
import { type PackageVersionsData } from '~/types';
import tw from '~/util/tailwind';

const RECENT_RELEASE_COUNT = 10;
const SIZE_INCREASE_THRESHOLD = 0.5;

type Props = {
  data: PackageVersionsData;
};

export function VersionSizeIncreasedBanner({ data }: Props) {
  const analysis = analyzeRecentPackageSizeIncrease(data);

  if (!analysis || !analysis.shouldWarn) {
    return null;
  }

  return (
    <View
      style={tw`mt-2 flex flex-row items-center gap-1.5 rounded-lg border border-warning-opaque bg-warning-light p-3 dark:bg-warning-light`}>
      <WarningIcon style={tw`size-4 text-warning-dark`} />
      <Label style={tw`text-warning-dark dark:text-warning`}>
        Warning: package size increased by{' '}
        <strong>{analysis.flaggedRelease.increasePercent?.toFixed(1)}%</strong> in version{' '}
        <span style={tw`font-mono`}>{analysis.flaggedRelease.version}</span> compared to{' '}
        <span style={tw`font-mono`}>{analysis.flaggedRelease.previousVersion}</span>.
      </Label>
    </View>
  );
}

type SizeIncreaseWarning = {
  shouldWarn: boolean;
  flaggedRelease: {
    version: string;
    publishedAt: string;
    size: number;
    previousVersion: string | null;
    previousSize: number | null;
    increaseRatio: number | null;
    increasePercent: number | null;
    exceedsThreshold: boolean;
  };
};

function analyzeRecentPackageSizeIncrease(data: PackageVersionsData): SizeIncreaseWarning | null {
  const versions = data.versions ?? {};
  const time = data.time ?? {};

  const publishedVersions = Object.keys(versions)
    .filter(version => {
      if (version.includes('-')) {
        return false;
      }

      const publishedAt = time[version];
      const size = versions[version]?.dist?.unpackedSize;

      return Boolean(publishedAt) && typeof size === 'number';
    })
    .sort((a, b) => {
      return new Date(time[a]).getTime() - new Date(time[b]).getTime();
    });

  const recentVersionsOnly = publishedVersions.slice(-RECENT_RELEASE_COUNT);

  const recentVersions = recentVersionsOnly.map((version, index) => {
    const currentSize = versions[version]?.dist?.unpackedSize ?? 0;
    const publishedAt = time[version];
    const previousVersion = index > 0 ? recentVersionsOnly[index - 1] : null;
    const previousSize = previousVersion
      ? (versions[previousVersion]?.dist?.unpackedSize ?? null)
      : null;

    const increaseRatio =
      previousSize && previousSize > 0 ? (currentSize - previousSize) / previousSize : null;

    const increasePercent = increaseRatio !== null ? increaseRatio * 100 : null;

    return {
      version,
      publishedAt,
      size: currentSize,
      previousVersion,
      previousSize,
      increaseRatio,
      increasePercent,
      exceedsThreshold: increaseRatio !== null && increaseRatio > SIZE_INCREASE_THRESHOLD,
    };
  });

  const flaggedRelease = [...recentVersions].reverse().find(release => release.exceedsThreshold);

  if (!flaggedRelease) {
    return null;
  }

  return {
    shouldWarn: true,
    flaggedRelease,
  };
}
