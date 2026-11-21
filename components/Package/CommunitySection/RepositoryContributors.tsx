import ContentLoader from 'react-content-loader';
import { View } from 'react-native';
import useSWR from 'swr';

import { A, H6Section, Label, useLayout } from '~/common/styleguide';
import EntityCounter from '~/components/Package/EntityCounter';
import UserAvatar from '~/components/Package/UserAvatar';
import { Tooltip } from '~/components/Tooltip';
import { type GitHubUser } from '~/types';
import { TimeRange } from '~/util/datetime';
import { pluralize } from '~/util/strings';
import { cx, useIsDark } from '~/util/tailwind';

type Props = {
  fullName: string;
};

const LIMIT = 38;

export default function RepositoryContributors({ fullName }: Props) {
  const isDark = useIsDark();
  const { isSmallScreen } = useLayout();
  const { data, isLoading } = useSWR<GitHubUser[]>(
    `https://api.github.com/repos/${fullName}/contributors?per_page=${LIMIT}`,
    (url: string) => fetch(url).then(res => res.json()),
    {
      dedupingInterval: TimeRange.HOUR * 1000,
      revalidateOnFocus: false,
      fallbackData: [],
    }
  );

  const contributors =
    data && Array.isArray(data)
      ? data.sort((a, b) => {
          if (a.contributions === b.contributions) {
            return a.login.localeCompare(b.login);
          }
          return a.contributions < b.contributions ? 1 : -1;
        })
      : [];

  if (!isLoading && contributors.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <H6Section className={cx('flex gap-1.5', cx(!isSmallScreen && 'mt-3'))}>
          Contributors
        </H6Section>
        <ContentLoader
          speed={2}
          width="100%"
          height={36}
          backgroundColor={isDark ? '#2a2e36' : '#f3f3f3'}
          foregroundColor={isDark ? '#383c42' : '#ecebeb'}>
          <circle cx="18" cy="18" r="18" />
          <circle cx="62" cy="18" r="18" />
          <circle cx="106" cy="18" r="18" />
          <circle cx="150" cy="18" r="18" />
          <circle cx="194" cy="18" r="18" />
        </ContentLoader>
      </>
    );
  }

  const hasMore = contributors?.length >= LIMIT;

  return (
    <>
      <H6Section className={cx('flex gap-1.5', cx(!isSmallScreen && 'mt-3'))}>
        Contributors
        <EntityCounter count={hasMore ? `${LIMIT}+` : contributors.length} />
        {!isSmallScreen && hasMore && (
          <A href={`https://github.com/${fullName}/contributors`} className="ml-auto">
            <Label className="font-light">See all contributors</Label>
          </A>
        )}
      </H6Section>
      <View className="flex-row flex-wrap items-start gap-2">
        {contributors.map(contributor => (
          <View className="flex flex-row items-center gap-3 bg-transparent" key={contributor.login}>
            <Tooltip
              sideOffset={2}
              delayDuration={100}
              trigger={
                <View>
                  <A href={contributor.html_url} className="contents">
                    <UserAvatar src={contributor.avatar_url} alt={`${contributor.login} avatar`} />
                  </A>
                </View>
              }>
              <View>
                <Label className="text-[13px] leading-[18px]">{contributor.login}</Label>
                <span className="text-palette-gray4 dark:text-secondary text-[11px] font-light">
                  {contributor.contributions} {pluralize('contribution', contributor.contributions)}
                </span>
              </View>
            </Tooltip>
          </View>
        ))}
      </View>
    </>
  );
}
