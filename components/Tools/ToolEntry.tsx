import { type ReactNode } from 'react';
import { View } from 'react-native';

import { Caption, H3, P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { ArrowUpRightIcon } from '~/components/Icons';
import tw from '~/util/tailwind';

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
    <View style={tw`overflow-hidden rounded-xl border border-default pt-3`}>
      <H3 style={tw`mb-1 px-5 text-xl`}>{name}</H3>
      <View style={tw`mb-3.5 gap-1.5 px-5`}>
        <P style={tw`font-light leading-[23px]`}>{description}</P>
        {note && <Caption style={tw`font-light leading-tight text-secondary`}>{note}</Caption>}
      </View>
      <View
        style={tw`flex-row flex-wrap items-center gap-3 border-t border-default bg-palette-gray1 px-5 py-3 dark:bg-dark-bright`}>
        <GitHubButton href={githubUrl} name={name} />
        {buttons?.map(({ label, href }) => (
          <Button
            key={label}
            openInNewTab
            href={href}
            style={[
              tw`min-h-8 flex-row gap-1 bg-palette-gray3 pl-3 pr-2.5 text-sm`,
              tw`dark:bg-accented dark:text-white`,
            ]}>
            <span>{label}</span>
            <ArrowUpRightIcon style={tw`size-4 text-icon`} />
          </Button>
        ))}
      </View>
    </View>
  );
}
