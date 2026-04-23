import { Pressable, View } from 'react-native';

import { useLayout } from '~/common/styleguide';
import { MinimizeIcon } from '~/components/Icons';
import InputKeyHint from '~/components/InputKeyHint';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

type Props = {
  isBrowserMaximized: boolean;
  toggleMaximized: () => void;
};

export default function DisplayModeButton({ isBrowserMaximized, toggleMaximized }: Props) {
  const { isSmallScreen } = useLayout();

  const Icon = isBrowserMaximized ? MinimizeIcon : MinimizeIcon;

  return (
    <Tooltip
      trigger={
        <Pressable onPress={toggleMaximized}>
          <Icon style={tw`size-5 text-palette-gray4 dark:text-pewter`} />
        </Pressable>
      }>
      {isBrowserMaximized ? (
        <View style={tw`-mr-1 flex flex-row items-center gap-1.5`}>
          <span>Minimize code browser</span>
          {!isSmallScreen && <InputKeyHint content={[{ key: 'Esc' }]} />}
        </View>
      ) : (
        'Maximize code browser'
      )}
    </Tooltip>
  );
}
