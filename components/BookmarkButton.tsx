import { type StyleProp, type ViewStyle } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import { BookmarkFilledIcon, BookmarkIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { useBookmarks } from '~/context/BookmarksContext';
import { cx } from '~/util/tailwind';

type BookmarkButtonProps = {
  bookmarkId: string;
  className?: string;
  iconClassName?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
};

export default function BookmarkButton({
  bookmarkId,
  className,
  iconClassName,
  style,
  iconStyle,
}: BookmarkButtonProps) {
  const { checkIsBookmarked, toggleBookmark } = useBookmarks();
  const isBookmarked = checkIsBookmarked(bookmarkId);

  function handleToggleBookmark() {
    toggleBookmark(bookmarkId);
  }

  return (
    <Tooltip
      trigger={
        <HoverEffect onPress={handleToggleBookmark} className={className} style={style}>
          {isBookmarked ? (
            <BookmarkFilledIcon
              className={cx('text-primary-dark dark:text-primary size-4', iconClassName)}
              style={iconStyle}
            />
          ) : (
            <BookmarkIcon
              className={cx('text-palette-gray5 dark:text-palette-gray4 size-4', iconClassName)}
              style={iconStyle}
            />
          )}
        </HoverEffect>
      }>
      {isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    </Tooltip>
  );
}
