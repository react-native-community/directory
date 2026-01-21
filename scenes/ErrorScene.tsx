import { Image, View } from 'react-native';

import { A, H3, P } from '~/common/styleguide';
import Navigation from '~/components/Navigation';
import NotFound from '~/components/Package/NotFound';
import PageMeta from '~/components/PageMeta';
import tw from '~/util/tailwind';

type Props = {
  statusCode: number;
  reason?: string;
};

export default function ErrorScene({ statusCode, reason }: Props) {
  if (statusCode === 404) {
    return <NotFound />;
  }

  return (
    <>
      <PageMeta title="Error" description="Uh oh, something went wrong" />
      <Navigation header={<></>} />
      <View style={tw`mb-18 mt-12 flex w-full flex-1 items-center justify-center px-6`}>
        <Image
          style={tw`mb-6 mt-12 size-[64px]`}
          source={require('~/assets/notfound.png')}
          alt="Error"
        />
        <H3>Uh oh, something went wrong ({statusCode})</H3>
        <P style={tw`mt-4`}>
          {reason ?? (
            <>
              Help fix it? Submit a PR to the{' '}
              <A href="https://github.com/react-native-community/directory">GitHub repository</A>.
            </>
          )}
        </P>
      </View>
    </>
  );
}
