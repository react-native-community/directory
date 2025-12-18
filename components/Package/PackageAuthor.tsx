import SHA256 from 'crypto-js/sha256';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, Label } from '~/common/styleguide';
import UserAvatar from '~/components/Package/UserAvatar';
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

  const sublabelStyle = { color: isDark ? darkColors.secondary : colors.gray4 };

  const potentialHref = author.url ?? author.email;

  // URL
  if (potentialHref && !potentialHref.includes('@')) {
    if (potentialHref.includes('github.com/')) {
      const [, potentialGHUsername] = potentialHref.split('github.com/');
      const ghUsername = potentialGHUsername.replace(/[<>()]/g, '');
      const validName = getValidName(author.name);

      return (
        <View>
          <A
            href={`https://github.com/${ghUsername}`}
            style={styles.authorContainer}
            hoverStyle={isDark && { color: colors.primaryDark }}>
            <UserAvatar src={`https://github.com/${ghUsername}.png`} alt={`${ghUsername} avatar`} />
            <View>
              <span>{ghUsername}</span>
              <span style={{ ...styles.sublabel, ...sublabelStyle }}>{validName}</span>
            </View>
          </A>
        </View>
      );
    }

    return (
      <View>
        <A href={potentialHref} target="_blank">
          <Label>{author.name ?? 'Unknown'}</Label>
        </A>
      </View>
    );
  }

  // Email
  if (potentialHref && potentialHref.includes('@')) {
    if (compact) {
      return (
        <View style={styles.authorContainer}>
          <Tooltip
            sideOffset={2}
            delayDuration={100}
            trigger={
              <UserAvatar
                src={`https://gravatar.com/avatar/${SHA256(potentialHref).toString()}?d=retro`}
                alt={`${author.name} avatar`}
              />
            }>
            <View style={styles.tooltipContent}>
              <span>{author.name}</span>
              <span style={{ ...styles.sublabel, ...sublabelStyle }}>{potentialHref}</span>
            </View>
          </Tooltip>
        </View>
      );
    }

    return (
      <View style={styles.authorContainer}>
        <UserAvatar
          src={`https://gravatar.com/avatar/${SHA256(potentialHref).toString()}?d=retro`}
          alt={`${author.name} avatar`}
        />
        <View>
          <span style={{ color: isDark ? colors.white : colors.black }}>{author.name}</span>
          <span style={{ ...styles.sublabel, ...sublabelStyle }}>{potentialHref}</span>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Label>{getValidName(author.name) ?? 'Unknown'}</Label>
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
  tooltipContent: {
    display: 'flex',
  },
});
