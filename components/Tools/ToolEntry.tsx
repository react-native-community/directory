import { View } from 'react-native';

import { H3, P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import tw from '~/util/tailwind';

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
  return (
    <View style={tw`rounded-xl border border-default px-5 py-4`}>
      <H3 style={tw`mb-0.5 text-xl`}>{name}</H3>
      <P style={tw`mb-3 font-light leading-[29px]`}>{description}</P>
      <View style={tw`flex-row flex-wrap gap-3`}>
        <GitHubButton href={githubUrl} />
        {buttons.map(({ label, href }) => (
          <Button
            key={label}
            openInNewTab
            href={href}
            style={[
              tw`min-h-8 flex-row gap-1.5 bg-palette-gray3 px-3 text-sm`,
              tw`dark:bg-accented dark:text-white`,
            ]}>
            <span>{label}</span>
          </Button>
        ))}
      </View>
    </View>
  );
}
