import { View } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import { PackageDiffCollapseIcon, PackageDiffExpandIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import tw from '~/util/tailwind';

type Props = {
  isFullFileView: boolean;
  toggleFullFileView: () => void;
};

export default function DiffViewButton({ isFullFileView, toggleFullFileView }: Props) {
  const label = isFullFileView ? 'Collapse to diff hunks' : 'Show full file diff';
  const Icon = isFullFileView ? PackageDiffCollapseIcon : PackageDiffExpandIcon;

  return (
    <Tooltip
      trigger={
        <HoverEffect onPress={toggleFullFileView}>
          <View accessibilityLabel={label} accessibilityRole="button" style={tw`cursor-pointer`}>
            <Icon style={tw`size-5 text-palette-gray4 dark:text-pewter`} />
          </View>
        </HoverEffect>
      }>
      {label}
    </Tooltip>
  );
}
