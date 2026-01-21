import { View } from 'react-native';

import { A, P, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import {
  Logo,
  PlatformAndroid,
  PlatformIOS,
  PlatformMacOS,
  PlatformTvOS,
  PlatformVisionOS,
  PlatformWeb,
  PlatformWindows,
} from '~/components/Icons';
import tw from '~/util/tailwind';

import PlatformTile from './PlatformTile';
import VercelBanner from './VercelBanner';

export default function Footer() {
  const { isSmallScreen } = useLayout();

  return (
    <View style={tw`mt-1 w-full bg-palette-gray1 pb-7 pt-8 dark:bg-dark`}>
      <ContentContainer>
        <View style={tw`mx-auto mb-7 mt-1 max-w-footer flex-row flex-wrap justify-center gap-3.5`}>
          <PlatformTile
            name="Android"
            pkgName="react-native"
            Icon={PlatformAndroid}
            url="https://github.com/facebook/react-native#readme"
          />
          <PlatformTile
            name="iOS"
            pkgName="react-native"
            Icon={PlatformIOS}
            url="https://github.com/facebook/react-native#readme"
          />
          <PlatformTile
            name="macOS"
            pkgName="react-native-macos"
            Icon={PlatformMacOS}
            url="https://github.com/microsoft/react-native-macos#readme"
          />
          <PlatformTile
            name="tvOS"
            pkgName="react-native-tvos"
            Icon={PlatformTvOS}
            url="https://github.com/react-native-community/react-native-tvos#readme"
          />
          <PlatformTile
            name="visionOS"
            pkgName="react-native-visionos"
            Icon={PlatformVisionOS}
            url="https://github.com/callstack/react-native-visionos#readme"
          />
          <PlatformTile
            name="Web"
            pkgName="react-native-web"
            Icon={PlatformWeb}
            url="https://github.com/necolas/react-native-web#readme"
          />
          <PlatformTile
            name="Windows"
            pkgName="react-native-windows"
            Icon={PlatformWindows}
            url="https://github.com/microsoft/react-native-windows#readme"
          />
        </View>
        <View style={[tw`mt-3 flex-row px-4`, isSmallScreen && tw`flex-col`]}>
          <View style={[tw`flex-1 flex-col`, isSmallScreen && tw`items-center`]}>
            <P style={tw`py-1.5 text-[13px] font-light text-secondary`}>
              Missing a library?{' '}
              <A href="https://github.com/react-native-community/react-native-directory#how-do-i-add-a-library">
                Add it to the directory
              </A>
              .
            </P>
            <P
              style={[
                tw`py-1.5 text-[13px] font-light text-secondary`,
                isSmallScreen && tw`items-center text-center`,
              ]}>
              Want to learn more? Check out the{' '}
              <A href="https://reactnative.dev/docs/getting-started">official React Native docs</A>,
              and <A href="https://expo.dev">Expo</A>.
            </P>
          </View>
          <View style={[tw`self-center`, isSmallScreen && tw`mt-6 items-center`]}>
            <A
              href="https://vercel.com/?utm_source=rndir&utm_campaign=oss"
              aria-label="Vercel banner"
              style={tw`flex`}>
              <VercelBanner />
            </A>
          </View>
        </View>
        <View style={tw`items-center pb-8 pt-12`}>
          <Logo style={tw`text-palette-gray3 dark:text-powder`} width={42} height={38} />
        </View>
      </ContentContainer>
    </View>
  );
}
