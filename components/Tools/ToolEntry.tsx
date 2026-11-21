import { type ReactNode } from 'react';
import { View } from 'react-native';

import { Caption, H3, P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { ArrowUpRightIcon } from '~/components/Icons';
import { cx } from '~/util/tailwind';

import GitHubButton from './GitHubButton';

type Props = {
  name: string;
  description: ReactNode;
  note?: ReactNode;
  githubUrl: string;
  buttons?: {
    label: string;
    href: string;
  }[];
};

export default function ToolEntry({ name, description, note, githubUrl, buttons }: Props) {
  return (
    <View className="border-border overflow-hidden rounded-xl border pt-3">
      <H3 className="mb-1 px-5 text-xl">{name}</H3>
      <View className="mb-3.5 gap-1.5 px-5">
        <P className="leading-[23px] font-light">{description}</P>
        {note && <Caption className="text-secondary font-light">{note}</Caption>}
      </View>
      <View className="border-border bg-palette-gray1 dark:bg-dark-bright flex-row flex-wrap items-center gap-3 border-t px-5 py-3">
        <GitHubButton href={githubUrl} name={name} />
        {buttons?.map(({ label, href }) => (
          <Button
            key={label}
            openInNewTab
            href={href}
            className={cx(
              'min-h-8 flex-row gap-1 bg-palette-gray3 pl-3 pr-2.5 text-sm',
              'dark:bg-accented dark:text-white'
            )}>
            <span>{label}</span>
            <ArrowUpRightIcon className="text-icon size-4" />
          </Button>
        ))}
      </View>
    </View>
  );
}
