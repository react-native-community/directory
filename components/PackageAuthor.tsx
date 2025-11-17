import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, Caption, colors, Label } from '~/common/styleguide';
import { type NpmUser } from '~/types';

import CustomAppearanceContext from '../context/CustomAppearanceContext';

type Props = {
  author?: NpmUser;
  size?: 'sm' | 'md';
};

export function PackageAuthor({ author }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  if (!author) {
    return (
      <View>
        <Label>Unknown</Label>
      </View>
    );
  }

  if (author?.url) {
    if (author.url.includes('github.com/')) {
      const [, potentialGHUsername] = author.url.split('github.com/');
      const ghUsername = potentialGHUsername.replace(/[<>()]/g, '');
      const validName = getValidName(author.name);

      return (
        <View>
          <A
            href={`https://github.com/${ghUsername}`}
            target="_blank"
            style={styles.link}
            hoverStyle={isDark && { color: colors.primaryDark }}>
            <img
              src={`https://github.com/${ghUsername}.png`}
              style={styles.avatar}
              alt={`${ghUsername} avatar`}
            />
            <View>
              <Caption style={styles.secondLine}>{ghUsername}</Caption>
              <Label style={{ color: 'inherit' }}>{validName}</Label>
            </View>
          </A>
        </View>
      );
    } else if (!author.url.includes('@')) {
      return (
        <View>
          <A href={author.url} target="_blank">
            <Label>{author.name ?? 'Unknown'}</Label>
          </A>
        </View>
      );
    }
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
  link: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondLine: {
    lineHeight: 16,
    color: 'inherit',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '100%',
  },
});
