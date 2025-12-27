import { Fragment } from 'react';
import { View } from 'react-native';

import { A, Label, useLayout } from '~/common/styleguide';
import { type LibraryDataEntryType } from '~/types';
import tw from '~/util/tailwind';

import { Warning } from '../Icons';

type Props = {
  alternatives?: LibraryDataEntryType['alternatives'];
  block?: boolean;
};

export default function UnmaintainedLabel({ alternatives, block }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <View style={tw`flex-row flex-shrink gap-1.5`}>
      <View
        style={[
          tw`flex-row flex-wrap flex-shrink items-start -ml-5 mb-2 pl-5 pr-3 py-1.5 rounded-r gap-1 bg-palette-gray1 border border-l-0 border-palette-gray3 dark:bg-dark dark:border-default`,
          block && tw`ml-0 border-l pl-3 py-2 rounded-lg rounded-r-lg`,
          isSmallScreen && tw`flex-col`,
          {
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, ${tw.prefixMatch('dark') ? 'var(--background)' : 'var(--gray-2)'} 20px, ${tw.prefixMatch('dark') ? 'var(--background)' : 'var(--gray-2)'} 40px)`,
          },
        ]}>
        <View style={tw`flex-row flex-shrink gap-1.5`}>
          <Warning width={16} height={16} style={tw`text-palette-gray5 dark:text-secondary`} />
          <Label style={tw`text-palette-gray5 dark:text-secondary`}>
            This library is not actively maintained.
          </Label>
        </View>
        {alternatives && alternatives.length > 0 && (
          <Label style={tw`text-palette-gray5 dark:text-secondary`}>
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
