import { UL } from '@expo/html-elements';
import { startCase } from 'es-toolkit/string';
import { type NextPageContext } from 'next';
import useSWR from 'swr';

import { A, Caption, H6Section, Label, useLayout } from '~/common/styleguide';
import EntityCounter from '~/components/Package/EntityCounter';
import ThreeDotsLoader from '~/components/Package/ThreeDotsLoader';
import { type APIResponseType, type LibraryType } from '~/types';
import { TimeRange } from '~/util/datetime';
import getApiUrl from '~/util/getApiUrl';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import MorePackagesSectionRow from './MorePackagesSectionRow';

type Props = {
  library: LibraryType;
};

const LIMIT = 6;

export default function MorePackagesSection({ library }: Props) {
  const owner = library.github.fullName.split('/')[0];

  const { isSmallScreen } = useLayout();
  const { data, isLoading } = useSWR<APIResponseType>(
    getApiUrl(
      urlWithQuery(`/libraries`, { owner, order: 'downloads', limit: LIMIT.toString() }),
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

  if (data && data.libraries.length <= 1) {
    return null;
  }

  return (
    <>
      <H6Section style={[tw`flex items-center gap-1.5`, !isSmallScreen && tw`mt-4`]}>
        More packages from {startCase(owner)}
        {!isLoading && data?.total && data.total > 0 ? (
          <EntityCounter count={data.total > LIMIT ? data.total : data.total - 1} />
        ) : null}
        {!isSmallScreen && data?.total && data.total > LIMIT && (
          <A href={`/packages?owner=${encodeURI(owner)}`} style={tw`ml-auto`}>
            <Label style={tw`font-light`}>See all packages</Label>
          </A>
        )}
      </H6Section>
      {!data || isLoading ? (
        <ThreeDotsLoader />
      ) : (
        <>
          <UL style={[tw`m-0 gap-2`, isSmallScreen && tw`mb-2`]}>
            {data.libraries
              .filter(({ npmPkg }) => npmPkg !== library.npmPkg)
              .slice(0, LIMIT - 1)
              .map(library => (
                <MorePackagesSectionRow library={library} key={library.npmPkg} />
              ))}
          </UL>
          {isSmallScreen && data.total > LIMIT && (
            <A href={`/packages?owner=${encodeURI(owner)}`} style={tw`text-center`}>
              <Caption style={tw`font-light`}>See all packages</Caption>
            </A>
          )}
        </>
      )}
    </>
  );
}
