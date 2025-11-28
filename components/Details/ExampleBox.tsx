import { LI } from '@expo/html-elements';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { A, colors, darkColors, useLayout } from '~/common/styleguide';
import { CodeBrackets, GitHub, Snack } from '~/components/Icons';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = {
  example: string;
  index: number;
};

export default function ExampleBox({ example, index }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  return (
    <LI>
      <A
        href={example}
        style={[
          styles.exampleBox,
          {
            borderColor: isDark ? darkColors.border : colors.gray2,
          },
        ]}
        hoverStyle={{
          backgroundColor: isDark ? darkColors.dark : colors.gray1,
        }}>
        <View style={styles.exampleLabelWrapper}>
          {example.includes('github.com') && (
            <GitHub fill={isDark ? darkColors.pewter : colors.gray5} />
          )}
          {example.includes('snack.expo.dev') && (
            <Snack fill={isDark ? darkColors.pewter : colors.gray5} />
          )}
          {!example.includes('github.com') && !example.includes('snack.expo.dev') && (
            <CodeBrackets fill={isDark ? darkColors.pewter : colors.gray5} />
          )}
          <span style={{ ...styles.exampleLabel, color: isDark ? colors.white : colors.black }}>
            {getExampleDescription(example)}
          </span>
        </View>
        <Text
          style={[
            styles.exampleIndex,
            {
              color: isDark ? darkColors.pewter : colors.gray5,
            },
            isSmallScreen && { display: 'none' },
          ]}>
          #{index + 1}
        </Text>
      </A>
    </LI>
  );
}

export function getExampleDescription(url: string) {
  if (url.includes('github.com')) {
    if (url.includes('/tree/')) {
      return `GitHub project (${url.split('/').reverse()[0]})`;
    }
    return 'GitHub repository example';
  }
  if (url.includes('snack.expo.dev')) {
    return 'Snack';
  }
  return 'Code example';
}

const styles = StyleSheet.create({
  exampleBox: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    textDecorationLine: 'none',
  },
  exampleLabelWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 400,
    maxWidth: '100%',
    gap: 10,
  },
  exampleLabel: {
    fontWeight: 300,
  },
  exampleIndex: {
    opacity: 0.33,
    fontSize: 24,
  },
});
