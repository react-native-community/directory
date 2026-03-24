import { LI } from '@expo/html-elements';
import { startCase } from 'es-toolkit';
import { View } from 'react-native';

import { A, Label, useLayout } from '~/common/styleguide';
import { Funding, FundingGitHub, Link } from '~/components/Icons';
import UserAvatar from '~/components/Package/UserAvatar';
import { type LibraryFundingLink } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  fund: LibraryFundingLink;
};

export default function FundingRow({ fund }: Props) {
  const { isSmallScreen } = useLayout();
  return (
    // @ts-expect-error calculated width
    <LI style={!isSmallScreen && { width: 'calc(50% - 4px)' }}>
      <A
        href={correctFundLink(fund)}
        style={[
          tw`flex flex-row items-center justify-between rounded-lg border border-palette-gray2 px-4 py-2.5 no-underline dark:border-default`,
          isSmallScreen && tw`px-3 py-2`,
        ]}
        hoverStyle={tw`bg-palette-gray1 dark:bg-dark`}>
        {formatFundPlatform(fund)}
      </A>
    </LI>
  );
}

function formatFundPlatform({ platform, url }: LibraryFundingLink) {
  if (platform === 'GITHUB') {
    const ghUsername = url.split('/').at(-1);
    return (
      <>
        <View style={tw`flex-row items-center gap-2.5`}>
          <FundingGitHub style={tw`min-w-6 text-[#db61a2]`} />
          <View style={tw`flex-row items-center gap-1.5`}>
            <UserAvatar
              src={`https://github.com/${ghUsername}.png`}
              alt={`${ghUsername} avatar`}
              style={tw`size-5`}
            />
            <span>{ghUsername}</span>
          </View>
        </View>
        <Label style={tw`font-light text-secondary`}>GitHub Sponsorship</Label>
      </>
    );
  }
  if (platform === 'CUSTOM') {
    const parsedUrl = new URL(correctFundLink({ platform, url }));
    return (
      <View style={tw`max-w-full flex-row items-center gap-2.5 font-light`}>
        <Link style={tw`min-w-6 text-icon`} />
        <span>
          {startCase(platform)}: {parsedUrl.hostname.replace('www.', '')}
        </span>
      </View>
    );
  }
  const parsedUrl = new URL(url);
  return (
    <View style={tw`max-w-full flex-row items-center gap-2.5 font-light`}>
      <Funding style={tw`min-w-6 text-icon`} />
      <span>
        {startCase(platform)}: {parsedUrl.pathname.split('/').at(-1)}
      </span>
    </View>
  );
}

function correctFundLink({ platform, url }: LibraryFundingLink) {
  if (platform === 'GITHUB') {
    return url.replace('github.com', 'github.com/sponsors');
  }
  if (!url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
