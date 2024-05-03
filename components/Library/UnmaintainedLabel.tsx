import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, Label } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Warning } from '../Icons';

const UnmaintainedLabel = () => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <View style={styles.unmaintainedTextWrapper}>
      <View
        style={[
          styles.unmaintainedTextContainer,
          {
            backgroundColor: isDark ? darkColors.warningLight : colors.warningLight,
          },
        ]}>
        <Warning width={16} height={16} fill={isDark ? darkColors.warning : colors.warningDark} />
        <Label
          style={[
            styles.unmaintainedText,
            {
              color: isDark ? darkColors.warning : colors.warningDark,
            },
          ]}>
          This library is not actively maintained
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  unmaintainedTextWrapper: {
    flexDirection: 'row',
  },
  unmaintainedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -20,
    marginBottom: 12,
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 6,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  unmaintainedText: {
    marginLeft: 6,
  },
});

export default UnmaintainedLabel;
