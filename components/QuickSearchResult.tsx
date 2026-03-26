import { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { Caption, useLayout } from '~/common/styleguide';
import CompatibilityTags from '~/components/CompatibilityTags';
import { Warning } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import Tooltip from '~/components/Tooltip';
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
        <Caption style={tw`relative top-px flex items-center gap-1`}>
          {library.npmPkg}
          {library.unmaintained && (
            <Tooltip
              trigger={
                <View style={tw`relative top-px`}>
                  <Warning style={tw`text-warning-dark dark:text-warning`} />
                </View>
              }>
              Unmaintained
            </Tooltip>
          )}
        </Caption>
        <LibraryDescription
          github={library.github}
          maxLines={isSmallScreen ? 3 : undefined}
          style={tw`text-[12px] font-light leading-snug text-secondary`}
        />
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
