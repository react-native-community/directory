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
    <View style={tw`border border-default px-5 py-4 rounded-xl`}>
      <H3 style={tw`text-xl mb-0.5`}>{name}</H3>
      <P style={tw`mb-3 font-light leading-[29px]`}>{description}</P>
      <View style={tw`flex-row flex-wrap gap-3`}>
        <GitHubButton href={githubUrl} />
        {buttons.map(({ label, href }) => (
          <Button
            key={label}
            openInNewTab
            href={href}
            style={[
              tw`flex-row px-3 min-h-8 gap-1.5 text-sm bg-palette-gray3`,
              tw`dark:bg-accented dark:text-white`,
            ]}>
            <span>{label}</span>
          </Button>
        ))}
      </View>
    </View>
  );
}
