import Link from 'next/link';
import { useState } from 'react';
import { View } from 'react-native';

import { P } from '~/common/styleguide';
import CheckBox from '~/components/CheckBox';
import { XIcon } from '~/components/Icons';
import { type FilterParamsType, type Query } from '~/types';
import { cx } from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  query: Query;
  filterParam: FilterParamsType;
  basePath?: string;
  allowFalse?: boolean;
};

export function ToggleLink({ query, filterParam, basePath = '/packages', allowFalse }: Props) {
  const [isHovered, setHovered] = useState(false);
  const isSelected = !!query[filterParam.param];
  const isFalsy = allowFalse && query[filterParam.param] === 'false';

  return (
    <Link
      href={urlWithQuery(basePath, {
        ...query,
        [filterParam.param]: !isSelected,
        offset: null,
      })}
      className="my-1 mr-4 no-underline">
      <View
        className="cursor-pointer flex-row items-center"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}>
        <CheckBox
          value={isSelected}
          className={cx(
            cx(isFalsy && 'border-error bg-error'),
            cx(isHovered && 'border-primary-dark'),
            cx(isHovered && isFalsy && 'border-error')
          )}
          Icon={isFalsy ? XIcon : undefined}
        />
        <P className={cx('text-sm font-light leading-[18px]', cx(isHovered && 'text-hover'))}>
          {filterParam.title}
        </P>
      </View>
    </Link>
  );
}
