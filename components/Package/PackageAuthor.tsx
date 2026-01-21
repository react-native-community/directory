import SHA256 from 'crypto-js/sha256';
import { View } from 'react-native';

import { A, Caption, Label } from '~/common/styleguide';
import UserAvatar from '~/components/Package/UserAvatar';
import Tooltip from '~/components/Tooltip';
import { type NpmUser } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  author?: NpmUser | string;
  compact?: boolean;
};

const authorContainerStyle = tw`flex flex-row items-center gap-3 bg-transparent`;
const labelStyle = tw`leading-[18px]`;
const sublabelStyle = tw`text-[11px] font-light text-palette-gray4 dark:text-secondary`;

export default function PackageAuthor({ author, compact }: Props) {
  if (!author) {
    return (
      <View>
        <Label>Unknown</Label>
      </View>
    );
  }

  if (typeof author === 'string') {
    if (author.includes('github.com/')) {
      const ghUsername = extractGitHubUsername(author);

      return (
        <View>
          <A href={`https://github.com/${ghUsername}`} style={authorContainerStyle}>
            <UserAvatar src={`https://github.com/${ghUsername}.png`} alt={`${ghUsername} avatar`} />
            <View>
              <Caption style={labelStyle}>{ghUsername}</Caption>
              <span style={sublabelStyle}>
                {author
                  .replace(/\s*\(?https?:\/\/\S+\)?\s*/g, '')
                  .replace(/[<>()]/g, '')
                  .trim()}
              </span>
            </View>
          </A>
        </View>
      );
    }
    return (
      <View>
        <Label>{author}</Label>
      </View>
    );
  }

  const potentialHref = author.url ?? author.email;

  // URL
  if (potentialHref && !potentialHref.includes('@')) {
    if (potentialHref.includes('github.com/')) {
      const ghUsername = extractGitHubUsername(potentialHref);
      const validName = getValidName(author.name);

      return (
        <View>
          <A href={`https://github.com/${ghUsername}`} style={authorContainerStyle}>
            <UserAvatar src={`https://github.com/${ghUsername}.png`} alt={`${ghUsername} avatar`} />
            <View>
              <Caption style={labelStyle}>{ghUsername}</Caption>
              <span style={sublabelStyle}>{validName}</span>
            </View>
          </A>
        </View>
      );
    }

    return (
      <View>
        <A href={potentialHref} target="_blank">
          <Caption style={labelStyle}>{author.name ?? 'Unknown'}</Caption>
        </A>
      </View>
    );
  }

  // Email
  if (potentialHref && potentialHref.includes('@')) {
    if (compact) {
      return (
        <View style={authorContainerStyle}>
          <Tooltip
            sideOffset={2}
            delayDuration={100}
            trigger={
              <UserAvatar
                src={`https://gravatar.com/avatar/${SHA256(potentialHref).toString()}?d=retro`}
                alt={`${author.name} avatar`}
              />
            }>
            <View>
              <Caption style={labelStyle}>{author.name}</Caption>
              <span style={sublabelStyle}>{potentialHref}</span>
            </View>
          </Tooltip>
        </View>
      );
    }

    return (
      <View style={authorContainerStyle}>
        <UserAvatar
          src={`https://gravatar.com/avatar/${SHA256(potentialHref).toString()}?d=retro`}
          alt={`${author.name} avatar`}
        />
        <View>
          <Caption style={labelStyle}>{author.name}</Caption>
          <span style={sublabelStyle}>{potentialHref}</span>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Caption style={labelStyle}>{getValidName(author.name) ?? 'Unknown'}</Caption>
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

function extractGitHubUsername(author: string): string | null {
  const [, potentialGHUsername] = author.split('github.com/');
  return potentialGHUsername ? potentialGHUsername.replace(/[<>()]/g, '') : null;
}
