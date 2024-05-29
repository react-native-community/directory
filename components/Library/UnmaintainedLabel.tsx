import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, Label, useLayout } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Warning } from '../Icons';

const UnmaintainedLabel = ({ value }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();
  const linkHoverStyle = isDark && { color: colors.secondary };

  return (
    <View style={styles.unmaintainedTextWrapper}>
      <View
        style={[
          styles.unmaintainedTextContainer,
          {
            gap: 4,
            flexDirection: isSmallScreen ? 'column' : 'row',
            backgroundColor: isDark ? darkColors.warningLight : colors.warningLight,
          },
        ]}>
        <View
          style={[
            styles.unmaintainedTextWrapper,
            {
              gap: 6,
            },
          ]}>
          <Warning width={16} height={16} fill={isDark ? darkColors.warning : colors.warningDark} />
          <Label
            style={[
              {
                color: isDark ? darkColors.warning : colors.warningDark,
              },
            ]}>
            This library is not actively maintained.
          </Label>
        </View>
        {typeof value === 'string' && (
          <Label
            style={[
              {
                color: isDark ? darkColors.warning : colors.warningDark,
              },
            ]}>
            You can use{' '}
            <A
              href={`/?search=${encodeURIComponent(value)}`}
              style={{ backgroundColor: 'transparent' }}
              hoverStyle={linkHoverStyle}>
              {value}
            </A>{' '}
            instead.
          </Label>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  unmaintainedTextWrapper: {
    flexDirection: 'row',
  },
  unmaintainedTextContainer: {
    alignItems: 'flex-start',
    marginLeft: -20,
    marginBottom: 12,
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 6,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});

export default UnmaintainedLabel;
