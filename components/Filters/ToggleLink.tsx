import Link from 'next/link';
import { Platform, StyleSheet, View } from 'react-native';

import { P, colors } from '../../common/styleguide';
import urlWithQuery from '../../util/urlWithQuery';
import { CheckBox } from '../CheckBox';

export const ToggleLink = ({ query, paramName, title, basePath = '/' }) => {
  const isSelected = !!query[paramName];

  return (
    <Link
      href={urlWithQuery(basePath, {
        ...query,
        [paramName]: !isSelected,
        offset: null,
      })}
      style={{ textDecoration: 'none' }}>
      <View style={styles.link}>
        <CheckBox value={isSelected} color={colors.primaryDark} />
        <P style={{ fontSize: 14 }}>{title}</P>
      </View>
    </Link>
  );
};

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
});
