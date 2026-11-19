import { Fragment } from 'react';
import { View } from 'react-native';

import { A, Label, useLayout } from '~/common/styleguide';
import { WarningIcon } from '~/components/Icons';
import { type LibraryDataEntryType } from '~/types';
import { strippedBackground } from '~/util/style';
import { cx, useIsDark } from '~/util/tailwind';

type Props = {
  alternatives?: LibraryDataEntryType['alternatives'];
  block?: boolean;
};

export default function UnmaintainedLabel({ alternatives, block }: Props) {
  const { isSmallScreen } = useLayout();
  const isDark = useIsDark();

  return (
    <View className="flex-shrink flex-row gap-1.5">
      <View
        className={cx(
          '-ml-5 -mt-1.5 mb-1.5 mr-8 flex-shrink flex-row flex-wrap items-start gap-1 rounded-r border border-l-0 border-palette-gray3 bg-palette-gray1 py-1.5 pl-5 pr-3 dark:border-border dark:bg-dark',
          cx(block && 'ml-0 mr-0 rounded-lg rounded-r-lg border-l py-2 pl-3'),
          cx(isSmallScreen && 'flex-col')
        )}
        style={strippedBackground(isDark ? 'var(--background)' : 'var(--gray-2)')}>
        <View className="flex-shrink flex-row gap-1.5">
          <WarningIcon className="text-warning-dark dark:text-warning size-4" />
          <Label className="text-warning-dark dark:text-warning">
            This library is not actively maintained.
          </Label>
        </View>
        {alternatives && alternatives.length > 0 && (
          <Label className="text-warning-dark dark:text-warning">
            You can use{' '}
            {alternatives.map((alternative, index) => (
              <Fragment key={alternative}>
                <A
                  href={`/package/${alternative}`}
                  hoverStyle="decoration-warning-dark dark:decoration-warning">
                  {alternative}
                </A>
                {index < alternatives.length - 1 && alternatives.length > 2 ? ', ' : ' '}
                {index === alternatives.length - 2 && 'or '}
              </Fragment>
            ))}{' '}
            instead.
          </Label>
        )}
      </View>
    </View>
  );
}
