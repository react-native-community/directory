import * as emoji from 'node-emoji';
import { Linkify } from 'react-easy-linkify';
import { type StyleProp, type TextStyle } from 'react-native';

import { A, Caption, Headline } from '~/common/styleguide';
import { type LibraryType } from '~/types';
import { cx } from '~/util/tailwind';

type Props = {
  github: LibraryType['github'];
  maxLines?: number;
  className?: string;
  style?: StyleProp<TextStyle>;
};

export default function LibraryDescription({ github, maxLines, className, style }: Props) {
  return github.description && github.description.length > 0 ? (
    <Headline
      numberOfLines={maxLines}
      className={cx('text-base font-light leading-snug', className)}
      style={style}>
      <Linkify
        options={{
          linkWrapper: ({ children, ...rest }) => <A {...rest}>{children}</A>,
        }}>
        {emoji.emojify(github.description).replaceAll(/(\n)+/g, ' ')}
      </Linkify>
    </Headline>
  ) : (
    <Caption
      className={cx(
        'text-base font-light leading-snug text-palette-gray4 dark:text-secondary',
        className
      )}
      style={style}>
      The package does not have a description defined.
    </Caption>
  );
}
