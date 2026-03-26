import * as emoji from 'node-emoji';
import { Linkify } from 'react-easy-linkify';
import { type StyleProp } from 'react-native';
import { type Style } from 'twrnc';

import { A, Caption, Headline } from '~/common/styleguide';
import { type LibraryType } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  github: LibraryType['github'];
  maxLines?: number;
  style?: StyleProp<Style>;
};

export default function LibraryDescription({ github, maxLines, style }: Props) {
  return github.description && github.description.length > 0 ? (
    <Headline numberOfLines={maxLines} style={[tw`text-base font-light leading-snug`, style]}>
      <Linkify
        options={{
          linkWrapper: ({ children, ...rest }) => <A {...rest}>{children}</A>,
        }}>
        {emoji.emojify(github.description)}
      </Linkify>
    </Headline>
  ) : (
    <Caption
      style={[tw`text-base font-light leading-snug text-palette-gray4 dark:text-secondary`, style]}>
      The package does not have a description defined.
    </Caption>
  );
}
