import { LI } from '@expo/html-elements';
import * as emoji from 'node-emoji';
import { View } from 'react-native';

import { A, Caption, Label, useLayout } from '~/common/styleguide';
import { DownloadIcon, StarIcon, WarningIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryType } from '~/types';
import { bigNumberFormatter, NUMBER_FORMATTER } from '~/util/strings';
import { cx } from '~/util/tailwind';

type Props = {
  library: LibraryType;
};

export default function MorePackagesSectionRow({ library }: Props) {
  const { isSmallScreen } = useLayout();
  const { npmPkg, github, unmaintained, npm } = library;

  return (
    <LI key={npmPkg}>
      <A
        href={`/package/${npmPkg}`}
        className={cx(
          'flex flex-row items-center justify-between rounded-lg border border-solid border-palette-gray2 px-4 py-2.5 no-underline dark:border-border',
          cx(isSmallScreen && 'px-3 pt-2')
        )}
        hoverStyle="bg-palette-gray1 dark:bg-dark">
        <View
          className={cx(
            'flex w-full max-w-full flex-row items-center gap-2',
            cx(isSmallScreen && 'flex-col items-start gap-1')
          )}>
          <Caption className="flex flex-shrink-0 items-center gap-1.5 text-sm">
            {unmaintained && (
              <Tooltip
                trigger={
                  <View>
                    <WarningIcon className="text-warning-dark dark:text-warning" />
                  </View>
                }>
                Unmaintained
              </Tooltip>
            )}
            {npmPkg}
          </Caption>
          {github.description ? (
            <Label numberOfLines={1} className="text-secondary font-light">
              {emoji.emojify(github.description)}
            </Label>
          ) : (
            <Label numberOfLines={1} className="text-tertiary dark:text-palette-gray5 font-light">
              The package does not have a description defined.
            </Label>
          )}
          <View
            className={cx(
              'ml-auto flex-row gap-4 text-sm font-light leading-[14px] text-icon',
              cx(isSmallScreen && 'ml-0 mt-1')
            )}>
            <View className="flex-row items-center gap-1 tabular-nums">
              <StarIcon className="text-tertiary dark:text-palette-gray5 size-4" />
              <span>{NUMBER_FORMATTER.format(github.stats.stars)}</span>
            </View>
            <View className="flex-row items-center gap-1 tabular-nums">
              <DownloadIcon className="text-tertiary dark:text-palette-gray5" />
              <span>{bigNumberFormatter(npm?.downloads ?? 0)}</span>
            </View>
          </View>
        </View>
      </A>
    </LI>
  );
}
