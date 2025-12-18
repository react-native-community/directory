import { useRouter } from 'next/router';
import { View } from 'react-native';

import { A, Label, P } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  title: string;
  path?: string;
  counter?: number;
};

function NavigationTab({ title, counter, path = `/${title.toLowerCase()}` }: Props) {
  const router = useRouter();
  const isActive = router.asPath.split('?')[0] === path;

  return (
    <A
      href={path}
      style={[
        tw`no-underline rounded`,
        {
          // TODO: figure out transitions
          transition: 'color 0.33s, background-color 0.33s',
        },
        isActive && tw`text-primary bg-primary-hover`,
      ]}
      hoverStyle={tw`text-secondary bg-palette-gray6 dark:bg-default`}
      target="_self">
      <View style={tw`flex-row items-center gap-2 px-4 pt-1.5 pb-2`}>
        <P style={[tw`text-white`, isActive && tw`text-primary`]}>{title}</P>
        {!!counter && (
          <Label
            style={[
              tw`py-0.5 px-1.5 rounded-xl text-[11px] text-white mt-[3px]`,
              isActive
                ? tw`bg-primary-dark text-black dark:text-white`
                : tw`bg-palette-gray5 dark:bg-dark-brighter`,
            ]}>
            {counter}
          </Label>
        )}
      </View>
    </A>
  );
}

export default NavigationTab;
