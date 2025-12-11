import { Image, View } from 'react-native';
import tw from 'twrnc';

import { H3, A, P } from '~/common/styleguide';
import Navigation from '~/components/Navigation';
import NotFound from '~/components/Package/NotFound';
import PageMeta from '~/components/PageMeta';

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
      <View style={tw`items-center justify-center w-full px-6 mt-12 mb-18 flex flex-1`}>
        <Image
          style={tw`mt-12 mb-6 size-[64px]`}
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
