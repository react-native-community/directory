import { View } from 'react-native';

import { Label, useLayout } from '~/common/styleguide';
import { Warning } from '~/components/Icons';
import { strippedBackground } from '~/util/style';
import tw from '~/util/tailwind';

type Props = {
  block?: boolean;
};

export default function UnmaintainedLabel({ block }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <View style={tw`flex-shrink flex-row gap-1.5`}>
      <View
        style={[
          tw`-ml-5 -mt-1 mb-2 flex-shrink flex-row flex-wrap items-start gap-1 rounded-r border border-l-0 border-palette-gray3 bg-palette-gray1 py-1.5 pl-5 pr-3 dark:border-default dark:bg-dark`,
          block && tw`ml-0 rounded-lg rounded-r-lg border-l py-2 pl-3`,
          isSmallScreen && tw`flex-col`,
          strippedBackground(tw.prefixMatch('dark') ? 'var(--background)' : 'var(--gray-2)'),
        ]}>
        <View style={tw`flex-shrink flex-row gap-1.5`}>
          <Warning style={tw`size-4 text-warning-dark dark:text-warning`} />
          <Label style={tw`text-warning-dark dark:text-warning`}>
            This template is not actively maintained.
          </Label>
        </View>
      </View>
    </View>
  );
}
