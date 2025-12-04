import { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { colors, darkColors, P } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

import { Button } from '../Button';
import { GitHub } from '../Icons';

type Props = {
  href: string;
};

export default function GitHubButton({ href }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const primaryButtonColorStyle = {
    backgroundColor: isDark ? darkColors.primaryDark : colors.primary,
  };

  return (
    <Button openInNewTab href={href} style={[styles.button, primaryButtonColorStyle]}>
      <GitHub width={16} />
      <P style={styles.githubButtonLabel}>GitHub</P>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    minHeight: 32,
    fontSize: 14,
    gap: 6,
  },
  githubButtonLabel: {
    color: 'inherit',
    fontSize: 14,
  },
});
