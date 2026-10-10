import { View } from 'react-native';

import { HoverEffect, useLayout } from '~/common/styleguide';
import { MaximizeIcon, MinimizeIcon } from '~/components/Icons';
import InputKeyHint from '~/components/InputKeyHint';
import { Tooltip } from '~/components/Tooltip';
import tw from '~/util/tailwind';

type Props = {
  isBrowserMaximized: boolean;
  toggleMaximized: () => void;
};

export default function DisplayModeButton({ isBrowserMaximized, toggleMaximized }: Props) {
  const { isSmallScreen } = useLayout();

  const Icon = isBrowserMaximized ? MinimizeIcon : MaximizeIcon;

  return (
    <Tooltip
      trigger={
        <HoverEffect onPress={toggleMaximized}>
          <View
            accessibilityLabel={
              isBrowserMaximized ? 'Minimize code browser' : 'Maximize code browser'
            }
            accessibilityRole="button"
            style={tw`cursor-pointer`}>
            <Icon style={tw`size-5 text-palette-gray4 dark:text-pewter`} />
          </View>
        </HoverEffect>
      }>
      {isBrowserMaximized ? (
        <View style={[tw`flex flex-row items-center gap-1.5`, !isSmallScreen && tw`-mr-1`]}>
          <span>Minimize code browser</span>
          {!isSmallScreen && <InputKeyHint content={[{ key: 'Esc' }]} />}
        </View>
      ) : (
        'Maximize code browser'
      )}
    </Tooltip>
  );
}
