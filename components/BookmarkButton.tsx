import { useState } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import { BookmarkFilledIcon, BookmarkIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { useBookmarks } from '~/context/BookmarksContext';
import tw from '~/util/tailwind';

type BookmarkButtonProps = {
  bookmarkId: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
};

export default function BookmarkButton({ bookmarkId, style, iconStyle }: BookmarkButtonProps) {
  const { checkIsBookmarked, toggleBookmark } = useBookmarks();
  const [hasSaveFailed, setSaveFailed] = useState(false);
  const isBookmarked = checkIsBookmarked(bookmarkId);

  function handleToggleBookmark() {
    setSaveFailed(!toggleBookmark(bookmarkId));
  }

  function getTooltipContent() {
    if (hasSaveFailed) {
      return 'Bookmarks limit reached, remove some bookmarks to add more';
    }
    return isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
  }

  return (
    <Tooltip
      trigger={
        <HoverEffect onPress={handleToggleBookmark} style={style}>
          {isBookmarked ? (
            <BookmarkFilledIcon
              style={[tw`size-4 text-primary-dark dark:text-primary`, iconStyle]}
            />
          ) : (
            <BookmarkIcon
              style={[tw`size-4 text-palette-gray5 dark:text-palette-gray4`, iconStyle]}
            />
          )}
        </HoverEffect>
      }>
      {getTooltipContent()}
    </Tooltip>
  );
}
