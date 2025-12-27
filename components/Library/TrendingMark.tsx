import { View, type ViewStyle } from 'react-native';

import { P, A, HoverEffect } from '~/common/styleguide';
import { type LibraryType } from '~/types';
import { getPopularityGrade } from '~/util/scoring';
import tw from '~/util/tailwind';

type Props = {
  library: LibraryType | { popularity: number };
  markOnly?: boolean;
  style?: ViewStyle;
};

export default function TrendingMark({ library, style, markOnly = false }: Props) {
  const { popularity = -100 } = library;
  const popularityStyles = getPopularityStyles(popularity);

  const content = (
    <>
      <View
        style={[
          tw`absolute h-1.5 w-8 rounded bg-palette-gray2 dark:bg-accented`,
          markOnly ? tw`top-[11px]` : tw`top-[7px]`,
        ]}
      />
      <View
        style={[
          tw`absolute h-1.5 rounded`,
          markOnly ? tw`top-[11px]` : tw`top-[7px]`,
          popularityStyles,
        ]}
      />
      <P
        style={[
          tw`pl-10 font-bold`,
          markOnly ? tw`-my-px text-[15px]` : tw`my-0.5 text-xs`,
          {
            color: popularityStyles.backgroundColor,
          },
        ]}>
        {getPopularityGrade(popularity)}
        {!markOnly && ` (${(popularity * 100).toFixed(1)})`}
      </P>
    </>
  );

  return markOnly ? (
    <View style={[tw`mb-1`, style]}>{content}</View>
  ) : (
    <HoverEffect>
      <A href="/scoring" style={[tw`flex relative items-start no-underline`, style]}>
        {content}
      </A>
    </HoverEffect>
  );
}

function getPopularityStyles(popularity: number) {
  if (popularity > 0.5) {
    return tw`w-8 bg-[#fb0d9e]`;
  } else if (popularity > 0.25) {
    return tw`w-6 bg-[#e70a2f]`;
  } else if (popularity > 0.1) {
    return tw`w-4.5 bg-[#ff5900]`;
  } else if (popularity > 0) {
    return tw`w-3 bg-[#dc9a00]`;
  } else {
    return tw`w-1.5 bg-palette-gray4`;
  }
}
