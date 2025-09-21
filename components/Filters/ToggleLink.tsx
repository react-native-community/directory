import Link from 'next/link';
import { useContext, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { P, colors } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type Query } from '~/types';
import urlWithQuery from '~/util/urlWithQuery';

import { CheckBox } from '../CheckBox';

type Props = {
  query: Query;
  paramName: keyof Query;
  title: string;
  basePath?: string;
};

export function ToggleLink({ query, paramName, title, basePath = '/' }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const [isHovered, setHovered] = useState<boolean>(false);
  const isSelected = !!query[paramName];

  return (
    <Link
      href={urlWithQuery(basePath, {
        ...query,
        [paramName]: !isSelected,
        offset: null,
      })}
      style={{ textDecoration: 'none' }}>
      <View
        style={styles.link}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}>
        <CheckBox
          value={isSelected}
          color={colors.primaryDark}
          style={isHovered && { borderColor: colors.primaryDark }}
        />
        <P style={[styles.text, isHovered && { color: isDark ? colors.gray3 : colors.gray5 }]}>
          {title}
        </P>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
    marginRight: 16,
    marginVertical: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    fontWeight: 300,
  },
});
