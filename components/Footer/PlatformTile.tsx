import { createElement, useContext, type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, P } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import tw from '~/util/tailwind';

type PlatformProps = {
  name: string;
  pkgName: string;
  url: string;
  Icon: ComponentType<IconProps>;
};

export default function Platform({ name, pkgName, url, Icon }: PlatformProps) {
  const { isDark } = useContext(CustomAppearanceContext);

  return (
    <A href={url} hoverStyle={tw`rounded-lg bg-palette-gray2 dark:bg-default`}>
      <View style={tw`min-w-[160px] px-2 py-4 rounded-lg items-center`}>
        {createElement(Icon, {
          fill: isDark ? darkColors.pewter : colors.gray5,
          width: 32,
          height: 32,
        })}
        <P style={tw`mt-3`}>{name}</P>
        <P style={styles.platformPackageName}>{pkgName}</P>
      </View>
    </A>
  );
}

const styles = StyleSheet.create({
  // TODO: Tailwind fonts setup
  platformPackageName: {
    fontSize: 12,
    fontFamily: 'monospace',
    borderRadius: 4,
    paddingHorizontal: 8,
    lineHeight: 22,
    marginTop: 2,
  },
});
