import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, Label, useLayout } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Warning } from '../Icons';

const UnmaintainedLabel = ({ value }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const linkHoverStyle = isDark && { color: colors.secondary };
  const contentColor = isDark ? darkColors.secondary : colors.gray5;

  return (
    <View style={styles.unmaintainedTextWrapper}>
      <View
        style={[
          styles.unmaintainedTextContainer,
          {
            flexDirection: isSmallScreen ? 'column' : 'row',
            backgroundColor: isDark ? darkColors.dark : colors.gray1,
            borderColor: isDark ? darkColors.border : colors.gray2,
            // @ts-expect-error
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, ${isDark ? '#18181f' : '#f0f0f0'} 20px, ${isDark ? '#18181f' : '#f0f0f0'} 40px)`,
          },
        ]}>
        <View style={styles.unmaintainedTextWrapper}>
          <Warning width={16} height={16} fill={contentColor} />
          <Label
            style={{
              color: contentColor,
            }}>
            This library is not actively maintained.
          </Label>
        </View>
        {typeof value === 'string' && (
          <Label
            style={{
              color: contentColor,
            }}>
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
    gap: 6,
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
    gap: 4,
    borderWidth: 1,
    borderLeftWidth: 0,
  },
});

export default UnmaintainedLabel;
