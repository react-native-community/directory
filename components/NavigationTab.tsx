import { useRouter } from 'next/router';
import { View } from 'react-native';

import { A, P } from '~/common/styleguide';
import EntityCounter from '~/components/Package/EntityCounter';
import { cx } from '~/util/tailwind';

type Props = {
  title: string;
  path?: string;
  counter?: number | string;
  measurement?: boolean;
};

function NavigationTab({
  title,
  counter,
  measurement = false,
  path = `/${title.toLowerCase()}`,
}: Props) {
  const router = useRouter();
  const isActive = decodeURIComponent(router.asPath.split('?')[0]) === decodeURIComponent(path);

  return (
    <A
      href={path}
      tabIndex={measurement ? -1 : undefined}
      aria-hidden={measurement}
      className={cx(
        'rounded no-underline transition-colors duration-300',
        isActive && 'bg-primary-hover text-primary'
      )}
      hoverStyle={cx(
        'bg-palette-gray6 text-tertiary dark:bg-default',
        isActive && 'bg-primary-active-hover'
      )}
      target="_self">
      <View className="flex-row items-center gap-2 px-4 pt-1.5 pb-2">
        <P className={cx('text-white', cx(isActive && 'text-primary'))}>{title}</P>
        {!!counter && (
          <EntityCounter
            count={counter}
            className={cx(
              'mt-[3px] rounded-xl px-1.5 py-0.5 text-[11px] text-white',
              cx(isActive ? 'bg-primary-dark text-black dark:text-white' : 'bg-accented')
            )}
          />
        )}
      </View>
    </A>
  );
}

export default NavigationTab;
