import { type StyleProp, type ViewStyle } from 'react-native';

import { HoverEffect } from '~/common/styleguide';
import { Bookmark, BookmarkFilled } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { useBookmarks } from '~/context/BookmarksContext';
import tw from '~/util/tailwind';

type BookmarkButtonProps = {
  bookmarkId: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
};

export default function BookmarkButton({ bookmarkId, style, iconStyle }: BookmarkButtonProps) {
  const { checkIsBookmarked, toggleBookmark } = useBookmarks();
  const isBookmarked = checkIsBookmarked(bookmarkId);

  function handleToggleBookmark() {
    toggleBookmark(bookmarkId);
  }

  return (
    <Tooltip
      trigger={
        <HoverEffect onPress={handleToggleBookmark} style={style}>
          {isBookmarked ? (
            <BookmarkFilled style={[tw`size-4 text-primary-dark dark:text-primary`, iconStyle]} />
          ) : (
            <Bookmark style={[tw`size-4 text-palette-gray5 dark:text-palette-gray4`, iconStyle]} />
          )}
        </HoverEffect>
      }>
      {isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    </Tooltip>
  );
}
