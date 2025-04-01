import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors } from '~/common/styleguide';
import Tooltip from '~/components/Tooltip';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { Library as LibraryType } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';

import { Calendar } from '../Icons';

type Props = {
  library: LibraryType;
};

export default function UpdatedAtView({ library }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const iconColor = isDark ? darkColors.pewter : colors.secondary;
  const textColor = isDark ? darkColors.secondary : colors.gray5;
  const decorationColor = isDark ? colors.gray5 : colors.gray3;
  const unmaintainedIconColor = isDark ? darkColors.warning : colors.warningDark;
  const unmaintainedTextColor = isDark ? darkColors.warning : colors.warningDark;

  return (
    <View style={styles.updatedAtContainer}>
      <Tooltip
        sideOffset={2}
        trigger={
          <View style={{ cursor: 'pointer' }} aria-label="Last updated">
            <Calendar
              fill={library.unmaintained ? unmaintainedIconColor : iconColor}
              width={14}
              height={16}
            />
          </View>
        }>
        Last updated
      </Tooltip>
      <A
        href={`${library.github.urls.repo}/commits`}
        style={[
          styles.link,
          {
            color: library.unmaintained ? unmaintainedTextColor : textColor,
            textDecorationColor: decorationColor,
          },
        ]}
        hoverStyle={[
          {
            color: library.unmaintained
              ? unmaintainedTextColor
              : isDark
                ? colors.primaryDark
                : textColor,
            textDecorationColor: library.unmaintained
              ? unmaintainedTextColor
              : isDark
                ? colors.gray6
                : colors.gray4,
          },
        ]}>
        {getTimeSinceToday(library.github.stats.pushedAt)}
      </A>
    </View>
  );
}

const styles = StyleSheet.create({
  updatedAtContainer: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  link: {
    fontSize: 13,
    fontWeight: 300,
    backgroundColor: 'transparent',
    textDecorationColor: 'transparent',
  },
});
