import Link from 'next/link';
import { useState } from 'react';
import { View } from 'react-native';

import { P } from '~/common/styleguide';
import { type Query } from '~/types';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import CheckBox from '../CheckBox';

type Props = {
  query: Query;
  paramName: keyof Query;
  title: string;
  basePath?: string;
};

export function ToggleLink({ query, paramName, title, basePath = '/' }: Props) {
  const [isHovered, setHovered] = useState<boolean>(false);
  const isSelected = !!query[paramName];

  return (
    <Link
      href={urlWithQuery(basePath, {
        ...query,
        [paramName]: !isSelected,
        offset: null,
      })}
      style={{ textDecoration: 'none' }}>
      <View
        style={tw`cursor-pointer mr-4 my-1 items-center flex-row`}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}>
        <CheckBox value={isSelected} style={isHovered && tw`border-primary-dark`} />
        <P
          style={[
            tw`text-sm font-light leading-[18px]`,
            isHovered && tw`text-palette-gray5 dark:text-palette-gray3`,
          ]}>
          {title}
        </P>
      </View>
    </Link>
  );
}
