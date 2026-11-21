import { LI } from '@expo/html-elements';
import { Text, View } from 'react-native';

import { A, useLayout } from '~/common/styleguide';
import { CodeBracketsIcon, GitHubIcon, SnackIcon } from '~/components/Icons';
import { cx } from '~/util/tailwind';

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
        className={cx(
          'flex flex-row items-center justify-between rounded-lg border border-palette-gray2 px-4 py-2.5 no-underline dark:border-border',
          cx(isSmallScreen && 'px-3 py-2')
        )}
        hoverStyle="bg-palette-gray1 dark:bg-dark">
        <View className="flex max-w-full flex-row items-center gap-2.5">
          {example.includes('github.com') && <GitHubIcon className="text-icon size-6" />}
          {example.includes('snack.expo.dev') && <SnackIcon className="text-icon" />}
          {!example.includes('github.com') && !example.includes('snack.expo.dev') && (
            <CodeBracketsIcon className="text-icon" />
          )}
          <span className="font-light">{getExampleDescription(example)}</span>
        </View>
        <Text
          className={cx(
            'text-2xl tabular-nums leading-[28px] text-icon opacity-30',
            cx(isSmallScreen && 'hidden')
          )}>
          #{index + 1}
        </Text>
      </A>
    </LI>
  );
}

function getExampleDescription(url: string) {
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
