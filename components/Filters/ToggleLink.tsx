import Link from 'next/link';
import { useState } from 'react';
import { View } from 'react-native';

import { P } from '~/common/styleguide';
import { type FilterParamsType, type Query } from '~/types';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import CheckBox from '../CheckBox';

type Props = {
  query: Query;
  filterParam: FilterParamsType;
  basePath?: string;
};

export function ToggleLink({ query, filterParam, basePath = '/' }: Props) {
  const [isHovered, setHovered] = useState<boolean>(false);
  const isSelected = !!query[filterParam.param];

  return (
    <Link
      href={urlWithQuery(basePath, {
        ...query,
        [filterParam.param]: !isSelected,
        offset: null,
      })}
      style={tw`no-underline mr-4 my-1`}>
      <View
        style={tw`cursor-pointer items-center flex-row`}
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
