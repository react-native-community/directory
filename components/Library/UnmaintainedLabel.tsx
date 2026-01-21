import { Fragment } from 'react';
import { View } from 'react-native';

import { A, Label, useLayout } from '~/common/styleguide';
import { Warning } from '~/components/Icons';
import { type LibraryDataEntryType } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  alternatives?: LibraryDataEntryType['alternatives'];
  block?: boolean;
};

export default function UnmaintainedLabel({ alternatives, block }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <View style={tw`flex-shrink flex-row gap-1.5`}>
      <View
        style={[
          tw`-ml-5 mb-2 flex-shrink flex-row flex-wrap items-start gap-1 rounded-r border border-l-0 border-palette-gray3 bg-palette-gray1 py-1.5 pl-5 pr-3 dark:border-default dark:bg-dark`,
          block && tw`ml-0 rounded-lg rounded-r-lg border-l py-2 pl-3`,
          isSmallScreen && tw`flex-col`,
          {
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, ${tw.prefixMatch('dark') ? 'var(--background)' : 'var(--gray-2)'} 20px, ${tw.prefixMatch('dark') ? 'var(--background)' : 'var(--gray-2)'} 40px)`,
          },
        ]}>
        <View style={tw`flex-shrink flex-row gap-1.5`}>
          <Warning width={16} height={16} style={tw`text-secondary`} />
          <Label style={tw`text-secondary`}>This library is not actively maintained.</Label>
        </View>
        {alternatives && alternatives.length > 0 && (
          <Label style={tw`text-secondary`}>
            You can use{' '}
            {alternatives.map((alternative, index) => (
              <Fragment key={alternative}>
                <A href={`/?search=${encodeURIComponent(alternative)}`}>{alternative}</A>
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
