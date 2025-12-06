import { Fragment, useContext } from 'react';
import { type StyleProp, StyleSheet, type TextStyle, View } from 'react-native';

import { A, colors, darkColors, Label, useLayout } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type LibraryDataEntryType } from '~/types';

import { Warning } from '../Icons';

type Props = {
  alternatives?: LibraryDataEntryType['alternatives'];
  block?: boolean;
};

export default function UnmaintainedLabel({ alternatives, block }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const linkHoverStyle: StyleProp<TextStyle> = isDark && { color: colors.secondary };
  const contentColor = isDark ? darkColors.secondary : colors.gray5;

  return (
    <View style={styles.unmaintainedTextWrapper}>
      <View
        style={[
          styles.unmaintainedTextContainer,
          block && styles.unmaintainedTextContainerBlock,
          {
            flexDirection: isSmallScreen ? 'column' : 'row',
            backgroundColor: isDark ? darkColors.dark : colors.gray1,
            borderColor: isDark ? darkColors.border : colors.gray2,
            // @ts-expect-error Correct, but too complex background definition
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
        {alternatives && alternatives.length > 0 && (
          <Label
            style={{
              color: contentColor,
            }}>
            You can use{' '}
            {alternatives.map((alternative, index) => (
              <Fragment key={alternative}>
                <A
                  href={`/?search=${encodeURIComponent(alternative)}`}
                  style={{ backgroundColor: 'transparent' }}
                  hoverStyle={linkHoverStyle}>
                  {alternative}
                </A>
                {index < alternatives.length - 1 && alternatives.length > 2 ? ', ' : ' '}
                {index === alternatives.length - 2 && 'or '}
              </Fragment>
            ))}{' '}
            instead.
          </Label>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  unmaintainedTextWrapper: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 1,
  },
  unmaintainedTextContainer: {
    alignItems: 'flex-start',
    marginLeft: -20,
    marginBottom: 8,
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 6,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    gap: 4,
    borderWidth: 1,
    borderLeftWidth: 0,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  unmaintainedTextContainerBlock: {
    marginLeft: 0,
    borderLeftWidth: 1,
    paddingLeft: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
