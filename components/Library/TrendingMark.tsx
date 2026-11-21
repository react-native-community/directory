import { View } from 'react-native';

import { A, HoverEffect, P } from '~/common/styleguide';
import { type LibraryType } from '~/types';
import { getPopularityGrade } from '~/util/scoring';
import { cx } from '~/util/tailwind';

type Props = {
  library: LibraryType | { popularity: number };
  markOnly?: boolean;
  className?: string;
};

export default function TrendingMark({ library, className, markOnly = false }: Props) {
  const { popularity = -100 } = library;
  const { className: popularityClassName, color } = getPopularityStyles(popularity);
  const positionClassName = markOnly ? 'top-[11px]' : 'top-[7px]';

  const content = (
    <>
      <View
        className={cx(
          'absolute h-1.5 w-8 rounded bg-palette-gray2 dark:bg-accented',
          positionClassName
        )}
      />
      <View className={cx('absolute h-1.5 rounded', positionClassName, popularityClassName)} />
      <P
        className={cx('pl-10', markOnly ? '-my-px text-[15px]' : 'my-0.5 text-xs')}
        style={{ color }}>
        {getPopularityGrade(popularity)}
        {!markOnly && ` (${(popularity * 100).toFixed(1)})`}
      </P>
    </>
  );

  return markOnly ? (
    <View className={cx('mb-1', className)}>{content}</View>
  ) : (
    <HoverEffect>
      <A
        href="/scoring#trending-score"
        className={cx('relative flex items-start no-underline', className)}>
        {content}
      </A>
    </HoverEffect>
  );
}

type PopularityStyles = { className: string; color: string };

function getPopularityStyles(popularity: number): PopularityStyles {
  if (popularity > 0.5) {
    return { className: 'w-8 bg-[#fb0d9e]', color: '#fb0d9e' };
  } else if (popularity > 0.25) {
    return { className: 'w-6 bg-[#e70a2f]', color: '#e70a2f' };
  } else if (popularity > 0.1) {
    return { className: 'w-4.5 bg-[#ff5900]', color: '#ff5900' };
  } else if (popularity > 0) {
    return { className: 'w-3 bg-[#dc9a00]', color: '#dc9a00' };
  } else {
    return { className: 'bg-palette-gray4 w-1.5', color: 'var(--palette-gray4)' };
  }
}
