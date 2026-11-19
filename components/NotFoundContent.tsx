import { type ReactElement } from 'react';
import { Image, View } from 'react-native';

import { A, H3, P } from '~/common/styleguide';

type Props = {
  header?: string;
  alt?: string;
  bottomSlot?: ReactElement;
};

export default function NotFoundContent({
  header = 'Nothing was found! Try another search.',
  alt = 'No results',
  bottomSlot,
}: Props) {
  return (
    <View className="mt-12 mb-18 flex w-full flex-1 items-center justify-center px-6">
      <Image
        className="mt-12 mb-6 size-[64px]"
        source={require('~/assets/notfound.png')}
        alt={alt}
      />
      <H3>{header}</H3>
      <P className="mt-4">
        Want to contribute a library you like? Submit a PR to the{' '}
        <A href="https://github.com/react-native-community/react-native-directory">GitHub Repo</A>.
      </P>
      {bottomSlot}
    </View>
  );
}
