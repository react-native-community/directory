import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Image, View } from 'react-native';

import { A, H4, P } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { Filters } from '~/components/Filters';
import { FilterButton } from '~/components/Filters/FilterButton';
import LoadingContent from '~/components/Library/LoadingContent';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import Pagination from '~/components/Pagination';
import { type LibraryType } from '~/types';
import { type TrendingPageProps } from '~/types/pages';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

const LibraryWithLoading = dynamic(() => import('~/components/Library'), {
  loading: () => <LoadingContent />,
});

export default function TrendingScene({ data, query }: TrendingPageProps) {
  const [isFilterVisible, setFilterVisible] = useState(Object.keys(query).length > 3);

  const router = useRouter();

  const total = data && data.total;

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
        <View style={tw`mx-auto mt-3`}>
          <FilterButton
            style={tw`h-8 min-w-40`}
            query={query}
            onPress={() => setFilterVisible(!isFilterVisible)}
            onClearAllPress={handleClearAllPress}
            isFilterVisible={isFilterVisible}
          />
        </View>
      </Navigation>
      {isFilterVisible && <Filters query={query} basePath="/trending" />}
      <ContentContainer style={tw`px-4 py-3`}>
        {data?.libraries.length ? (
          <>
            <Pagination query={query} total={total} basePath="/trending" />
            <View style={tw`mt-3`}>
              {data.libraries.map((item: LibraryType, index: number) => (
                <LibraryWithLoading
                  key={`list-item-${index}-${item.github.name}`}
                  library={item}
                  showTrendingMark
                />
              ))}
            </View>
            <Pagination query={query} total={total} basePath="/trending" />
          </>
        ) : (
          <View style={tw`mb-10 mt-6 items-center`}>
            <Image style={tw`size-16`} source={require('~/assets/notfound.png')} alt="No results" />
            <H4>Nothing was found!</H4>
          </View>
        )}
        <P style={tw`p-6 text-sm text-secondary`}>
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
