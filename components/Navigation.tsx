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
  subHeader?: ReactElement;
  style?: StyleProp<ViewStyle>;
}>;

export default function Navigation({
  title,
  description,
  children,
  header,
  subHeader,
  style,
}: NavigationProps) {
  const { isSmallScreen } = useLayout();

  return (
    <>
      <TopBar />
      {subHeader}
      {header ?? (
        <View
          style={[
            tw`overflow-hidden bg-palette-gray6 py-10 dark:bg-dark`,
            isSmallScreen && tw`py-6`,
            style,
          ]}>
          <Logo
            width={580}
            height={520}
            style={tw`absolute left-1/2 top-[-76px] ml-[-280px] text-palette-gray5 opacity-15 dark:text-palette-gray7`}
          />
          <H1
            style={[
              tw`px-5 text-center text-[42px] leading-[54px] text-white`,
              isSmallScreen && tw`text-3xl`,
            ]}>
            {title}
          </H1>
          <H2
            style={tw`px-10 py-1 text-center text-base font-normal text-palette-gray3 dark:text-secondary`}>
            {description}
          </H2>
          {children}
        </View>
      )}
    </>
  );
}
