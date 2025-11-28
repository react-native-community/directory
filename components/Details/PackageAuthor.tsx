import SHA256 from 'crypto-js/sha256';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, Label } from '~/common/styleguide';
import Tooltip from '~/components/Tooltip';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type NpmUser } from '~/types';

type Props = {
  author?: NpmUser;
  compact?: boolean;
};

export default function PackageAuthor({ author, compact }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  if (!author) {
    return (
      <View>
        <Label>Unknown</Label>
      </View>
    );
  }

  if (author?.url && !author.url.includes('@')) {
    if (author.url.includes('github.com/')) {
      const [, potentialGHUsername] = author.url.split('github.com/');
      const ghUsername = potentialGHUsername.replace(/[<>()]/g, '');
      const validName = getValidName(author.name);

      return (
        <View>
          <A
            href={`https://github.com/${ghUsername}`}
            style={styles.authorContainer}
            hoverStyle={isDark && { color: colors.primaryDark }}>
            <img
              src={`https://github.com/${ghUsername}.png`}
              style={styles.avatar}
              alt={`${ghUsername} avatar`}
            />
            <View>
              <Label>{ghUsername}</Label>
              <Label style={[styles.sublabel, { color: 'inherit' }]}>{validName}</Label>
            </View>
          </A>
        </View>
      );
    }

    return (
      <View>
        <A href={author.url} target="_blank">
          <Label>{author.name ?? 'Unknown'}</Label>
        </A>
      </View>
    );
  }

  if (author.email || (author?.url && author.url.includes('@'))) {
    const email = author.email ?? author.url;

    if (compact) {
      return (
        <View style={styles.authorContainer}>
          <Tooltip
            sideOffset={2}
            delayDuration={100}
            trigger={
              <img
                src={`https://gravatar.com/avatar/${SHA256(email!).toString()}?d=retro`}
                style={{
                  ...styles.avatar,
                  backgroundColor: isDark ? darkColors.powder : colors.gray2,
                }}
                alt={`${author.name} avatar`}
              />
            }>
            <View style={styles.tooltipContent}>
              <Label>{author.name}</Label>
              <Label
                style={[styles.sublabel, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
                {email}
              </Label>
            </View>
          </Tooltip>
        </View>
      );
    }

    return (
      <View style={styles.authorContainer}>
        <img
          src={`https://gravatar.com/avatar/${SHA256(email!).toString()}?d=retro`}
          style={styles.avatar}
          alt={`${author.name} avatar`}
        />
        <View>
          <Label style={{ color: isDark ? colors.white : colors.black }}>{author.name}</Label>
          <Label style={[styles.sublabel, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
            {email}
          </Label>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Label>{getValidName(author.name ?? author) ?? 'Unknown'}</Label>
    </View>
  );
}

function getValidName(potentialName: string): string {
  const cleanName = potentialName
    .split(' ')
    .filter(word => !(word.includes('(') || word.includes('/') || word.includes('<')))
    .join(' ');
  return cleanName.length ? cleanName : potentialName.replace(/[<>()]/g, '');
}

const styles = StyleSheet.create({
  authorContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sublabel: {
    fontSize: 11,
    fontWeight: 300,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '100%',
  },
  tooltipContent: {
    display: 'flex',
    gap: 2,
  },
});
