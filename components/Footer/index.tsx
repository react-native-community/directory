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
    <View style={tw`w-full pt-8 pb-7 mt-1 bg-palette-gray1 dark:bg-dark`}>
      <ContentContainer>
        <View style={tw`flex-row mt-1 justify-center flex-wrap gap-3.5 mb-7 max-w-footer mx-auto`}>
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
        <View style={[tw`flex-row px-4 mt-3`, isSmallScreen && tw`flex-col`]}>
          <View style={[tw`flex-col flex-1`, isSmallScreen && tw`items-center`]}>
            <P style={tw`py-1.5 text-[13px] font-light text-palette-gray5 dark:text-secondary`}>
              Missing a library?{' '}
              <A href="https://github.com/react-native-community/react-native-directory#how-do-i-add-a-library">
                Add it to the directory
              </A>
              .
            </P>
            <P
              style={[
                tw`py-1.5 text-[13px] font-light text-palette-gray5 dark:text-secondary`,
                isSmallScreen && tw`items-center text-center`,
              ]}>
              Want to learn more? Check out the{' '}
              <A href="https://reactnative.dev/docs/getting-started">official React Native docs</A>,
              and <A href="https://expo.dev">Expo</A>.
            </P>
          </View>
          <View style={[tw`self-center`, isSmallScreen && tw`items-center mt-6`]}>
            <A
              href="https://vercel.com/?utm_source=rndir&utm_campaign=oss"
              aria-label="Vercel banner">
              <VercelBanner />
            </A>
          </View>
        </View>
        <View style={tw`items-center pt-12 pb-8`}>
          <Logo style={tw`text-palette-gray3 dark:text-powder`} width={42} height={38} />
        </View>
      </ContentContainer>
    </View>
  );
}
