import { UL } from '@expo/html-elements';
import { orderBy } from 'es-toolkit/array';
import useSWR from 'swr';

import { H6Section, useLayout } from '~/common/styleguide';
import { type LibraryFundingLink } from '~/types';
import { TimeRange } from '~/util/datetime';
import { swrJSONFetch } from '~/util/fetch';
import { cx } from '~/util/tailwind';

import FundingRow from './FoundingRow';

type Props = {
  fullName: string;
};

export default function FundingSection({ fullName }: Props) {
  const { isSmallScreen } = useLayout();

  const repoOwner = fullName.split('/')[0];
  const repoName = fullName.replace(`${repoOwner}/`, '');

  const { data, isLoading } = useSWR(
    `/api/proxy/github-funding?owner=${repoOwner}&name=${repoName}`,
    swrJSONFetch,
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
      <H6Section className={cx('flex gap-1.5', cx(!isSmallScreen && 'mt-3'))}>Funding</H6Section>
      <UL className={cx('m-0 gap-2', cx(!isSmallScreen ? 'flex-row flex-wrap' : 'mb-2'))}>
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
