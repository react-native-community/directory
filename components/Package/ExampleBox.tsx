import { LI } from '@expo/html-elements';
import { Text, View } from 'react-native';

import { A, useLayout } from '~/common/styleguide';
import { CodeBrackets, GitHub, Snack } from '~/components/Icons';
import tw from '~/util/tailwind';

type Props = {
  example: string;
  index: number;
};

export default function ExampleBox({ example, index }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <LI>
      <A
        href={example}
        style={tw`flex flex-row items-center justify-between px-4 py-2.5 rounded-lg no-underline border border-palette-gray2 dark:border-default`}
        hoverStyle={tw`bg-palette-gray1 dark:bg-dark`}>
        <View style={tw`flex flex-row items-center max-w-full gap-2.5`}>
          {example.includes('github.com') && (
            <GitHub style={tw`text-palette-gray5 dark:text-pewter`} />
          )}
          {example.includes('snack.expo.dev') && (
            <Snack style={tw`text-palette-gray5 dark:text-pewter`} />
          )}
          {!example.includes('github.com') && !example.includes('snack.expo.dev') && (
            <CodeBrackets style={tw`text-palette-gray5 dark:text-pewter`} />
          )}
          <span style={tw`font-light`}>{getExampleDescription(example)}</span>
        </View>
        <Text
          style={[
            tw`opacity-30 text-2xl leading-[28px] text-palette-gray5 dark:text-pewter`,
            isSmallScreen && tw`hidden`,
          ]}>
          #{index + 1}
        </Text>
      </A>
    </LI>
  );
}

export function getExampleDescription(url: string) {
  if (url.includes('github.com')) {
    if (url.includes('/tree/')) {
      return `GitHub project (${url.split('/').reverse()[0]})`;
    }
    return `GitHub repository (${url.split('/')[4]})`;
  }
  if (url.includes('snack.expo.dev')) {
    return 'Snack';
  }
  return 'Code example';
}
