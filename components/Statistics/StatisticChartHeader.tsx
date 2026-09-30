import { kebabCase } from 'es-toolkit/string';
import Link from 'next/link';
import { useEffect } from 'react';
import { View } from 'react-native';

import { H4, H6Section, useLayout } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  title: string;
  large?: boolean;
};

export default function StatisticChartHeader({ title, large = false }: Props) {
  const { isSmallScreen } = useLayout();

  const HeaderTag = large ? H4 : H6Section;
  const id = `statistic-chart-${kebabCase(title)}`;

  useEffect(() => {
    if (window.location.hash !== `#${id}`) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id]);

  return (
    <View style={tw`mt-3 gap-1`}>
      <HeaderTag
        id={id}
        style={[
          tw`flex items-end justify-between text-secondary`,
          isSmallScreen && tw`flex-col items-start gap-y-0.5`,
        ]}>
        <Link href={`#${id}`} style={tw`text-secondary no-underline`}>
          {title}
        </Link>
      </HeaderTag>
    </View>
  );
}
