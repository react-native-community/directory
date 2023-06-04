import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, Label } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Badge } from '../Icons';

const RecommendedLabel = ({ isSmallScreen }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <View
      style={[
        styles.recommendedContainer,
        isSmallScreen ? styles.recommendedContainerSmall : null,
        {
          backgroundColor: isDark ? colors.primaryDark : colors.primaryLight,
        },
      ]}>
      <View style={styles.recommendedTextContainer}>
        <Badge width={11} height={16} />
        <Label
          style={[
            styles.recommendedText,
            {
              color: isDark ? darkColors.dark : colors.black,
            },
          ]}>
          Recommended Library
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recommendedContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginLeft: 10,
    top: 1,
    userSelect: 'none',
  },
  recommendedContainerSmall: {
    marginLeft: 0,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  recommendedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedText: {
    marginLeft: 6,
  },
});

export default RecommendedLabel;
