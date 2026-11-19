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
import { cx } from '~/util/tailwind';

import PlatformTile from './PlatformTile';
import VercelBanner from './VercelBanner';

export default function Footer() {
  const { isSmallScreen } = useLayout();

  return (
    <View className="bg-palette-gray1 dark:bg-dark mt-1 w-full pt-8 pb-7">
      <ContentContainer>
        <View className="mx-auto mt-1 mb-7 w-full flex-row flex-wrap justify-center gap-x-2 gap-y-3">
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
        <View className={cx('mt-3 flex-row px-4', cx(isSmallScreen && 'flex-col'))}>
          <View className={cx('flex-1 flex-col', cx(isSmallScreen && 'items-center'))}>
            <P className="text-secondary py-1.5 text-[13px] font-light">
              Missing a library?{' '}
              <A href="https://github.com/react-native-community/react-native-directory#how-do-i-add-a-library">
                Add it to the directory
              </A>
              .
            </P>
            <P
              className={cx(
                'py-1.5 text-[13px] font-light text-secondary',
                cx(isSmallScreen && 'items-center text-center')
              )}>
              Want to learn more? Check out the{' '}
              <A href="https://reactnative.dev/docs/getting-started">official React Native docs</A>,
              and <A href="https://expo.dev">Expo</A>.
            </P>
          </View>
          <View className={cx('self-center', cx(isSmallScreen && 'mt-6 items-center'))}>
            <A
              href="https://vercel.com/?utm_source=rndir&utm_campaign=oss"
              aria-label="Vercel banner"
              className="flex">
              <VercelBanner />
            </A>
          </View>
        </View>
        <View className="items-center pt-12 pb-8">
          <Logo className="text-palette-gray3 dark:text-powder h-[38px] w-[42px]" />
        </View>
      </ContentContainer>
    </View>
  );
}
