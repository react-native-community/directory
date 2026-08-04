import { Pressable, View } from 'react-native';

import { Caption, useLayout } from '~/common/styleguide';
import CompatibilityTags from '~/components/CompatibilityTags';
import { WarningIcon } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import { Tooltip } from '~/components/Tooltip';
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

  return (
    <Pressable
      onPress={async () => await onSelect(library.npmPkg)}
      onPointerDown={event => event.preventDefault()}
      onHoverIn={() => onHoverChange(index)}
      onHoverOut={() => onHoverChange(null)}
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
                  <WarningIcon style={tw`text-warning-dark dark:text-warning`} />
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

export default QuickSearchResult;
