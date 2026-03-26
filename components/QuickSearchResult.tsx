import { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { Caption, Label, useLayout } from '~/common/styleguide';
import CompatibilityTags from '~/components/CompatibilityTags';
import { type LibraryType } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  index: number;
  isActive: boolean;
  library: LibraryType;
  onHoverChange: (index: number | null) => void;
  onSelect: (npmPkg: string) => Promise<void>;
};

function QuickSearchResult({ index, isActive, library, onHoverChange, onSelect }: Props) {
  const { isSmallScreen } = useLayout();

  const handleHoverIn = useCallback(() => {
    onHoverChange(index);
  }, [index, onHoverChange]);

  const handleHoverOut = useCallback(() => {
    onHoverChange(null);
  }, [onHoverChange]);

  const handlePress = useCallback(async () => {
    await onSelect(library.npmPkg);
  }, [library.npmPkg, onSelect]);

  return (
    <Pressable
      onPress={handlePress}
      onPointerDown={event => event.preventDefault()}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={[
        tw`max-w-full flex-row items-center justify-between gap-x-3 gap-y-1.5 py-1 pl-4 pr-3`,
        isSmallScreen && tw`flex-wrap`,
        isActive && tw`bg-palette-gray2 dark:bg-palette-gray6`,
      ]}>
      <View style={tw`flex-shrink gap-0.5`}>
        <Caption>{library.npmPkg}</Caption>
        <Label
          style={[tw`font-light text-secondary`, isSmallScreen && tw`max-h-12 overflow-hidden`]}>
          {library.github.description}
        </Label>
      </View>
      <CompatibilityTags library={library} small />
    </Pressable>
  );
}

function arePropsEqual(previousProps: Props, nextProps: Props) {
  return (
    previousProps.index === nextProps.index &&
    previousProps.isActive === nextProps.isActive &&
    previousProps.library === nextProps.library &&
    previousProps.onHoverChange === nextProps.onHoverChange &&
    previousProps.onSelect === nextProps.onSelect
  );
}

export default memo(QuickSearchResult, arePropsEqual);
