import { useRouter } from 'next/router';
import { useState } from 'react';
import { Image, View } from 'react-native';

import { A, H4, P } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { Filters } from '~/components/Filters';
import { FilterButton } from '~/components/Filters/FilterButton';
import { LibraryWithLoading } from '~/components/Library/LibraryWithLoading';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import Pagination from '~/components/Pagination';
import { type TrendingPageProps } from '~/types/pages';
import urlWithQuery from '~/util/urlWithQuery';

export default function TrendingScene({ data, query }: TrendingPageProps) {
  const [isFilterVisible, setFilterVisible] = useState(Object.keys(query).length > 3);

  const router = useRouter();

  const total = data?.total ?? 0;

  function handleClearAllPress() {
    void router.replace(urlWithQuery('/trending'));
  }

  return (
    <>
      <PageMeta
        title="Trending libraries"
        description="See the libraries that are trending today"
        path="trending"
      />
      <Navigation
        title="Trending libraries"
        description="See the libraries that are trending today.">
        <View className="mx-auto mt-3">
          <FilterButton
            className="h-8 min-w-40"
            query={query}
            onPress={() => setFilterVisible(!isFilterVisible)}
            onClearAllPress={handleClearAllPress}
            isFilterVisible={isFilterVisible}
          />
        </View>
      </Navigation>
      {isFilterVisible && <Filters query={query} basePath="/trending" />}
      <ContentContainer className="px-4 py-3">
        {data?.libraries.length ? (
          <>
            <Pagination query={query} total={total} basePath="/trending" />
            <View className="mt-3">
              {data.libraries.map(item => (
                <LibraryWithLoading
                  key={`list-item-${item.npmPkg}`}
                  library={item}
                  showTrendingMark
                />
              ))}
            </View>
            <Pagination query={query} total={total} basePath="/trending" />
          </>
        ) : (
          <View className="mt-6 mb-10 items-center">
            <Image className="size-16" source={require('~/assets/notfound.png')} alt="No results" />
            <H4>Nothing was found!</H4>
          </View>
        )}
        <P className="text-secondary p-6 text-sm">
          Unfortunately that&apos;s all, what&apos;s trending now. Want to explore more libraries?
          Check out the{' '}
          <A href={urlWithQuery('/packages')} target="_self">
            directory home page
          </A>
          .
        </P>
      </ContentContainer>
    </>
  );
}
