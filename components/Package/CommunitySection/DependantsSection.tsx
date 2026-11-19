import { UL } from '@expo/html-elements';
import { type NextPageContext } from 'next';
import useSWR from 'swr';

import { A, Caption, H6Section, Label, useLayout } from '~/common/styleguide';
import EntityCounter from '~/components/Package/EntityCounter';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import { type APIResponseType, type LibraryType } from '~/types';
import { TimeRange } from '~/util/datetime';
import getApiUrl from '~/util/getApiUrl';
import { cx } from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import MorePackagesSectionRow from './MorePackagesSectionRow';

type Props = {
  library: LibraryType;
};

const LIMIT = 5;

export default function DependantsSection({ library }: Props) {
  const { isSmallScreen } = useLayout();
  const seeAllUrl = urlWithQuery('/packages', {
    dependantsOf: library.npmPkg,
    order: 'downloads',
  });
  const { data, isLoading } = useSWR<APIResponseType>(
    getApiUrl(
      `/library/dependants?name=${encodeURIComponent(library.npmPkg)}&limit=${LIMIT}`,
      {} as NextPageContext
    ),
    (url: string) =>
      fetch(url).then(res => {
        if (res.status === 200) {
          return res.json();
        }
        return { libraries: [], total: 0 };
      }),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  if (data?.total === 0) {
    return null;
  }

  return (
    <>
      <H6Section className={cx('flex items-center gap-1.5', cx(!isSmallScreen && 'mt-4'))}>
        <span>
          Packages that depend on <code className="pl-px text-[90%]">{library.npmPkg}</code>
        </span>
        {!isLoading && data?.total !== undefined && <EntityCounter count={data.total} />}
        {!isSmallScreen && data?.total && data.total > LIMIT && (
          <A href={seeAllUrl} className="ml-auto">
            <Label className="font-light">See all packages</Label>
          </A>
        )}
      </H6Section>
      {!data || isLoading ? (
        <ThreeDotsLoader />
      ) : (
        <UL className={cx('m-0 gap-2', cx(isSmallScreen && 'mb-2'))}>
          {data.libraries.map(dependant => (
            <MorePackagesSectionRow library={dependant} key={dependant.npmPkg} />
          ))}
        </UL>
      )}
      {isSmallScreen && data?.total && data.total > LIMIT && (
        <A href={seeAllUrl} className="text-center">
          <Caption className="font-light">See all packages</Caption>
        </A>
      )}
    </>
  );
}
