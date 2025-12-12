import { createElement, useContext, type ComponentType } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { A, colors, darkColors, P } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type PlatformProps = {
  name: string;
  pkgName: string;
  url: string;
  Icon: ComponentType<IconProps>;
  style?: ViewStyle;
};

export default function Platform({ name, pkgName, url, Icon, style }: PlatformProps) {
  const { isDark } = useContext(CustomAppearanceContext);

  const packageHoverStyle = {
    backgroundColor: isDark ? darkColors.background : colors.gray2,
    borderRadius: 8,
  };

  return (
    <A href={url} style={styles.itemLink} hoverStyle={packageHoverStyle}>
      <View style={[styles.platformItem, style]}>
        {createElement(Icon, {
          fill: isDark ? darkColors.pewter : colors.gray5,
          width: 32,
          height: 32,
        })}
        <P style={styles.platformName}>{name}</P>
        <P style={styles.platformPackageName}>{pkgName}</P>
      </View>
    </A>
  );
}

const styles = StyleSheet.create({
  platformItem: {
    minWidth: 160,
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  platformName: {
    marginTop: 12,
  },
  platformPackageName: {
    fontSize: 12,
    fontFamily: 'monospace',
    borderRadius: 4,
    paddingHorizontal: 8,
    lineHeight: 22,
    marginTop: 2,
  },
  itemLink: {
    backgroundColor: 'none',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
