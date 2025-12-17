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
      style={tw`no-underline`}>
      <View
        // TODO: support pointer styles?
        style={[tw`cursor-pointer mr-4 my-1 items-center flex-row`, { cursor: 'pointer' }]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}>
        <CheckBox value={isSelected} style={isHovered && tw`border-primary-dark`} />
        <P
          style={[
            tw`text-sm font-light leading-[18px]`,
            isHovered && tw`text-palette-gray5 dark:text-palette-gray3`,
          ]}>
          {filterParam.title}
        </P>
      </View>
    </Link>
  );
}
