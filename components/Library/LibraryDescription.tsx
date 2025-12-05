import * as emoji from 'node-emoji';
import { useContext } from 'react';
import { Linkify } from 'react-easy-linkify';
import { StyleSheet } from 'react-native';

import { A, Caption, colors, darkColors, Headline } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type LibraryType } from '~/types';

type Props = {
  github: LibraryType['github'];
  maxLines?: number;
};

export default function LibraryDescription({ github, maxLines }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  return github.description && github.description.length > 0 ? (
    <Headline numberOfLines={maxLines} style={{ fontWeight: 300, lineHeight: 23 }}>
      <Linkify
        options={{
          linkWrapper: ({ children, ...rest }) => <A {...rest}>{children}</A>,
        }}>
        {emoji.emojify(github.description)}
      </Linkify>
    </Headline>
  ) : (
    <Caption style={[styles.description, { color: isDark ? darkColors.secondary : colors.gray4 }]}>
      The package does not have a description defined.
    </Caption>
  );
}

const styles = StyleSheet.create({
  description: {
    fontWeight: 300,
    lineHeight: 23,
  },
});
