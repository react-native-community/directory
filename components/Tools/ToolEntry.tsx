import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, H3, P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

import GitHubButton from './GitHubButton';

type Props = {
  name: string;
  description: string;
  githubUrl: string;
  buttons: {
    label: string;
    href: string;
  }[];
};

export default function ToolEntry({ name, description, githubUrl, buttons }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const textColorStyle = {
    color: isDark ? colors.gray2 : colors.black,
  };
  const buttonColorStyle = {
    backgroundColor: isDark ? darkColors.border : colors.gray3,
    color: isDark ? colors.white : colors.black,
  };

  return (
    <View style={[styles.box, { borderColor: isDark ? darkColors.border : colors.gray2 }]}>
      <H3 style={[styles.header, textColorStyle]}>{name}</H3>
      <P style={[styles.paragraph, textColorStyle]}>{description}</P>
      <View style={styles.buttonsContainer}>
        <GitHubButton href={githubUrl} />
        {buttons.map(({ label, href }) => (
          <Button key={label} openInNewTab href={href} style={[styles.button, buttonColorStyle]}>
            <span>{label}</span>
          </Button>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 4,
  },
  paragraph: {
    lineHeight: 29,
    marginBottom: 12,
    fontWeight: 300,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    minHeight: 32,
    fontSize: 14,
    gap: 6,
  },
});
