import Link from 'next/link';
import { useState } from 'react';
import { View } from 'react-native';

import { P } from '~/common/styleguide';
import CheckBox from '~/components/CheckBox';
import { type FilterParamsType, type Query } from '~/types';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  query: Query;
  filterParam: FilterParamsType;
  basePath?: string;
};

export function ToggleLink({ query, filterParam, basePath = '/packages' }: Props) {
  const [isHovered, setHovered] = useState<boolean>(false);
  const isSelected = !!query[filterParam.param];

  return (
    <Link
      href={urlWithQuery(basePath, {
        ...query,
        [filterParam.param]: !isSelected,
        offset: null,
      })}
      style={tw`my-1 mr-4 no-underline`}>
      <View
        style={tw`cursor-pointer flex-row items-center`}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}>
        <CheckBox value={isSelected} style={isHovered && tw`border-primary-dark`} />
        <P style={[tw`text-sm font-light leading-[18px]`, isHovered && tw`text-hover`]}>
          {filterParam.title}
        </P>
      </View>
    </Link>
  );
}
