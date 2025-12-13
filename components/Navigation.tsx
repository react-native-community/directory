import { type PropsWithChildren, type ReactElement } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { H1, H2, useLayout } from '~/common/styleguide';
import { Logo } from '~/components/Icons';
import TopBar from '~/components/TopBar';
import tw from '~/util/tailwind';

type NavigationProps = PropsWithChildren<{
  title?: string;
  description?: string;
  header?: ReactElement;
  style?: StyleProp<ViewStyle>;
}>;

export default function Navigation({
  title,
  description,
  children,
  header,
  style,
}: NavigationProps) {
  const { isSmallScreen } = useLayout();

  return (
    <>
      <TopBar />
      {header ? (
        header
      ) : (
        <View style={[tw`py-10 overflow-hidden bg-palette-gray6 dark:bg-dark`, style]}>
          <Logo
            width={580}
            height={520}
            style={tw`absolute left-1/2 top-[-76px] ml-[-280px] opacity-15 text-palette-gray5 dark:text-palette-gray7`}
          />
          <H1
            style={[
              tw`text-center text-white text-[42px] leading-[54px] px-5`,
              isSmallScreen && tw`text-3xl`,
            ]}>
            {title}
          </H1>
          <H2 style={tw`text-center text-secondary text-base font-normal pt-1 pb-1.5 px-10`}>
            {description}
          </H2>
          {children}
        </View>
      )}
    </>
  );
}
