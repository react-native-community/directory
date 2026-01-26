import { type StyleProp, type ViewStyle } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import { Bookmark, BookmarkFilled } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { useBookmarks } from '~/context/BookmarksContext';

type BookmarkButtonProps = {
  bookmarkId: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  filledIconStyle?: StyleProp<ViewStyle>;
};

export default function BookmarkButton({
  bookmarkId,
  style,
  iconStyle,
  filledIconStyle,
}: BookmarkButtonProps) {
  const { isBookmarked: checkIsBookmarked, toggleBookmark: toggleBookmarkGlobal } = useBookmarks();
  const isBookmarked = checkIsBookmarked(bookmarkId);

  function handleToggleBookmark() {
    toggleBookmarkGlobal(bookmarkId);
  }

  return (
    <Tooltip
      trigger={
        <HoverEffect onPress={handleToggleBookmark} style={style}>
          {isBookmarked ? (
            <BookmarkFilled style={filledIconStyle ?? iconStyle} />
          ) : (
            <Bookmark style={iconStyle} />
          )}
        </HoverEffect>
      }>
      {isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    </Tooltip>
  );
}
