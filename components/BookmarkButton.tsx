import { useRef, useState } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import { BookmarkFilledIcon, BookmarkIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { useBookmarks } from '~/context/BookmarksContext';
import tw from '~/util/tailwind';

const SAVE_FAILED_TOOLTIP_DURATION = 3000;

type BookmarkButtonProps = {
  bookmarkId: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
};

export default function BookmarkButton({ bookmarkId, style, iconStyle }: BookmarkButtonProps) {
  const { checkIsBookmarked, toggleBookmark } = useBookmarks();
  const [hasSaveFailed, setSaveFailed] = useState(false);
  const [isSaveFailedTooltipOpen, setSaveFailedTooltipOpen] = useState(false);
  const saveFailedTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isBookmarked = checkIsBookmarked(bookmarkId);

  function handleToggleBookmark() {
    const isSaved = toggleBookmark(bookmarkId);

    setSaveFailed(!isSaved);
    setSaveFailedTooltipOpen(!isSaved);
    clearTimeout(saveFailedTimeoutRef.current);

    if (!isSaved) {
      // Tooltip closes on press, so keep it open for a moment to show why nothing has changed
      saveFailedTimeoutRef.current = setTimeout(
        () => setSaveFailedTooltipOpen(false),
        SAVE_FAILED_TOOLTIP_DURATION
      );
    }
  }

  function getTooltipContent() {
    if (hasSaveFailed) {
      return 'Bookmarks limit reached, remove some bookmarks to add more';
    }
    return isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
  }

  return (
    <Tooltip
      forceOpen={isSaveFailedTooltipOpen}
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
