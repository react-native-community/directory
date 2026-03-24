import { UL } from '@expo/html-elements';
import { useMemo } from 'react';

import { H6Section, useLayout } from '~/common/styleguide';
import FundingRow from '~/components/Package/FoundingRow';
import { type LibraryFundingLink } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  fundingLinks: LibraryFundingLink[];
};

export default function FundingSection({ fundingLinks }: Props) {
  const { isSmallScreen } = useLayout();

  const links = useMemo(() => sortFundingLinks(fundingLinks), [fundingLinks]);

  if (links.length === 0) {
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
  return links.sort((a, b) => {
    const aIsGitHub = a.platform === 'GITHUB';
    const bIsGitHub = b.platform === 'GITHUB';

    if (aIsGitHub !== bIsGitHub) {
      return aIsGitHub ? -1 : 1;
    }

    const aIsCustom = a.platform === 'CUSTOM';
    const bIsCustom = b.platform === 'CUSTOM';

    if (aIsCustom !== bIsCustom) {
      return aIsCustom ? 1 : -1;
    }

    if (aIsCustom && bIsCustom) {
      return a.url.localeCompare(b.url);
    }

    return a.platform.localeCompare(b.platform);
  });
}
