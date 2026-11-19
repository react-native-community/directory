import SHA256 from 'crypto-js/sha256';
import { View } from 'react-native';

import { A, Caption, Label } from '~/common/styleguide';
import UserAvatar from '~/components/Package/UserAvatar';
import { Tooltip } from '~/components/Tooltip';
import { type NpmUser } from '~/types';
type Props = {
  author?: NpmUser | string;
  compact?: boolean;
};

const authorContainerClassName = 'flex flex-row items-center gap-3 bg-transparent';
const labelClassName = 'text-[13px] leading-[18px]';
const sublabelClassName = 'text-palette-gray4 dark:text-secondary text-[11px] font-light';

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
          <A href={`https://github.com/${ghUsername}`} className={authorContainerClassName}>
            <UserAvatar src={`https://github.com/${ghUsername}.png`} alt={`${ghUsername} avatar`} />
            <View>
              <Caption className={labelClassName}>{ghUsername}</Caption>
              <span className={sublabelClassName}>
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
          <A href={`https://github.com/${ghUsername}`} className={authorContainerClassName}>
            <UserAvatar src={`https://github.com/${ghUsername}.png`} alt={`${ghUsername} avatar`} />
            <View>
              <Caption className={labelClassName}>{ghUsername}</Caption>
              <span className={sublabelClassName}>{validName}</span>
            </View>
          </A>
        </View>
      );
    }

    return (
      <View>
        <A href={potentialHref} target="_blank">
          <Caption className={labelClassName}>{author.name ?? 'Unknown'}</Caption>
        </A>
      </View>
    );
  }

  // Email
  if (potentialHref?.includes('@')) {
    if (compact) {
      return (
        <View className={authorContainerClassName}>
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
              <Caption className={labelClassName}>{author.name}</Caption>
              <span className={sublabelClassName}>{potentialHref}</span>
            </View>
          </Tooltip>
        </View>
      );
    }

    return (
      <View className={authorContainerClassName}>
        <UserAvatar
          src={`https://gravatar.com/avatar/${SHA256(potentialHref).toString()}?d=retro`}
          alt={`${author.name} avatar`}
        />
        <View>
          <Caption className={labelClassName}>{author.name}</Caption>
          <span className={sublabelClassName}>{potentialHref}</span>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Caption className={labelClassName}>{getValidName(author.name) ?? 'Unknown'}</Caption>
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
