import { UL } from '@expo/html-elements';
import { orderBy } from 'es-toolkit/array';
import useSWR from 'swr';

import { H6Section, useLayout } from '~/common/styleguide';
import FundingRow from '~/components/Package/FoundingRow';
import { type LibraryFundingLink } from '~/types';
import { TimeRange } from '~/util/datetime';
import tw from '~/util/tailwind';

type Props = {
  fullName: string;
};

export default function FundingSection({ fullName }: Props) {
  const { isSmallScreen } = useLayout();

  const repoOwner = fullName.split('/')[0];
  const repoName = fullName.replace(`${repoOwner}/`, '');

  const { data, isLoading } = useSWR(
    `/api/proxy/github-funding?owner=${repoOwner}&name=${repoName}`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
    }
  );

  const links = sortFundingLinks(data?.fundingLinks ?? []);

  if (isLoading || links.length === 0) {
    return null;
  }

  return (
    <>
      <H6Section style={[tw`flex gap-1.5`, !isSmallScreen && tw`mt-3`]}>Funding</H6Section>
      <UL style={[tw`m-0 gap-2`, !isSmallScreen ? tw`flex-row flex-wrap` : tw`mb-2`]}>
        {links.map(fund => (
          <FundingRow fund={fund} key={fund.url} />
        ))}
      </UL>
    </>
  );
}

function sortFundingLinks(links: LibraryFundingLink[]) {
  return orderBy(
    links,
    [
      link => (link.platform === 'GITHUB' ? 0 : link.platform === 'CUSTOM' ? 2 : 1),
      link => (link.platform === 'CUSTOM' ? link.url : link.platform),
    ],
    ['asc', 'asc']
  );
}
