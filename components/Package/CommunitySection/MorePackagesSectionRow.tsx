import { LI } from '@expo/html-elements';
import * as emoji from 'node-emoji';
import { View } from 'react-native';

import { A, Caption, Label, useLayout } from '~/common/styleguide';
import { DownloadIcon, StarIcon, WarningIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryType } from '~/types';
import { bigNumberFormatter, NUMBER_FORMATTER } from '~/util/strings';
import tw from '~/util/tailwind';

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
        style={[
          tw`flex flex-row items-center justify-between rounded-lg border border-solid border-palette-gray2 px-4 py-2.5 no-underline dark:border-default`,
          isSmallScreen && tw`px-3 pt-2`,
        ]}
        hoverStyle={tw`bg-palette-gray1 dark:bg-dark`}>
        <View
          style={[
            tw`flex w-full max-w-full flex-row items-center gap-2`,
            isSmallScreen && tw`flex-col items-start gap-1`,
          ]}>
          <Caption style={tw`flex flex-shrink-0 items-center gap-1.5 text-sm`}>
            {unmaintained && (
              <Tooltip
                trigger={
                  <View>
                    <WarningIcon style={tw`text-warning-dark dark:text-warning`} />
                  </View>
                }>
                Unmaintained
              </Tooltip>
            )}
            {npmPkg}
          </Caption>
          {github.description ? (
            <Label numberOfLines={1} style={tw`font-light text-secondary`}>
              {emoji.emojify(github.description)}
            </Label>
          ) : (
            <Label numberOfLines={1} style={tw`font-light text-tertiary dark:text-palette-gray5`}>
              The package does not have a description defined.
            </Label>
          )}
          <View
            style={[
              tw`ml-auto flex-row gap-4 text-sm font-light leading-[14px] text-icon`,
              isSmallScreen && tw`ml-0 mt-1`,
            ]}>
            <View style={tw`flex-row items-center gap-1 tabular-nums`}>
              <StarIcon style={tw`size-4 text-tertiary dark:text-palette-gray5`} />
              <span>{NUMBER_FORMATTER.format(github.stats.stars)}</span>
            </View>
            <View style={tw`flex-row items-center gap-1 tabular-nums`}>
              <DownloadIcon style={tw`text-tertiary dark:text-palette-gray5`} />
              <span>{bigNumberFormatter(npm?.downloads ?? 0)}</span>
            </View>
          </View>
        </View>
      </A>
    </LI>
  );
}
