import { View } from 'react-native';

import { A, Caption, Label } from '../common/styleguide';
import { PackageJsonData } from '../types';

type Props = {
  author?: PackageJsonData['author'];
  size?: 'sm' | 'md';
};

export function PackageAuthor({ author }: Props) {
  if (!author) {
    return (
      <View>
        <Label>Unknown</Label>
      </View>
    );
  }

  if (typeof author !== 'string') {
    if (author?.url) {
      return (
        <View>
          <A href={author?.url} target="_blank">
            <Label>{author?.name ?? 'Unknown'}</Label>
          </A>
        </View>
      );
    }
    return (
      <View>
        <Label>{author?.name ?? 'Unknown'}</Label>
      </View>
    );
  }

  if (author.includes('github.com/')) {
    const [potentialName, potentialGHUsername] = author.split('github.com/');
    const ghUsername = potentialGHUsername.replace(/[<>()]/g, '');
    const validName = getValidName(potentialName);

    return (
      <View>
        <A
          href={`https://github.com/${ghUsername}`}
          target="_blank"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
          <img
            src={`https://github.com/${ghUsername}.png`}
            style={{ width: 36, height: 36, borderRadius: '100%' }}
            alt={`${ghUsername} avatar`}
          />
          <View>
            <Caption style={{ lineHeight: 16 }}>{ghUsername}</Caption>
            <Label>{validName}</Label>
          </View>
        </A>
      </View>
    );
  }

  return (
    <View>
      <Label>{getValidName(author) ?? author ?? 'Unknown'}</Label>
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
