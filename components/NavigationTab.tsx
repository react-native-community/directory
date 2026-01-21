import { useRouter } from 'next/router';
import { View } from 'react-native';

import { A, P } from '~/common/styleguide';
import EntityCounter from '~/components/Package/EntityCounter';
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
        tw`rounded no-underline`,
        {
          transition: 'color 0.33s, background-color 0.33s',
        },
        isActive && tw`bg-primary-hover text-primary`,
      ]}
      hoverStyle={[
        tw`bg-palette-gray6 text-tertiary dark:bg-default`,
        isActive && tw`bg-primary-active-hover`,
      ]}
      target="_self">
      <View style={tw`flex-row items-center gap-2 px-4 pb-2 pt-1.5`}>
        <P style={[tw`text-white`, isActive && tw`text-primary`]}>{title}</P>
        {!!counter && (
          <EntityCounter
            count={counter}
            style={[
              tw`mt-[3px] rounded-xl px-1.5 py-0.5 text-[11px] text-white`,
              isActive ? tw`bg-primary-dark text-black dark:text-white` : tw`bg-accented`,
            ]}
          />
        )}
      </View>
    </A>
  );
}

export default NavigationTab;
