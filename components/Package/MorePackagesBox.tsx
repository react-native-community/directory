import { LI, UL } from '@expo/html-elements';
import { startCase } from 'es-toolkit';
import { type NextPageContext } from 'next';
import { useMemo } from 'react';
import { View } from 'react-native';
import useSWR from 'swr';

import { A, Caption, H6, Label, useLayout } from '~/common/styleguide';
import { Download, Star } from '~/components/Icons';
import { type APIResponseType, type LibraryType } from '~/types';
import { TimeRange } from '~/util/datetime';
import getApiUrl from '~/util/getApiUrl';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import EntityCounter from './EntityCounter';
import ThreeDotsLoader from './ThreeDotsLoader';

type Props = {
  library: LibraryType;
};

const LIMIT = 6;

export default function MorePackagesBox({ library }: Props) {
  const owner = useMemo(() => library.github.fullName.split('/')[0], [library]);

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
      <H6
        style={[
          tw`flex items-center gap-1.5 text-[16px] text-secondary`,
          !isSmallScreen && tw`mt-4`,
        ]}>
        More packages from {startCase(owner)}
        {!isLoading && data?.total && data.total > 0 ? (
          <EntityCounter count={data.total > LIMIT ? data.total : data.total - 1} />
        ) : null}
        {!isSmallScreen && data?.total && data.total > LIMIT && (
          <A href={`/?owner=${encodeURI(owner)}`} style={tw`ml-auto`}>
            <Caption style={tw`font-light`}>See all packages</Caption>
          </A>
        )}
      </H6>
      {!data || isLoading ? (
        <ThreeDotsLoader />
      ) : (
        <>
          <UL style={tw`m-0 mb-2 gap-2`}>
            {data.libraries
              .filter(({ npmPkg }) => npmPkg !== library.npmPkg)
              .slice(0, LIMIT - 1)
              .map(({ npmPkg, npm, github }) => (
                <LI key={npmPkg}>
                  <A
                    href={`/package/${npmPkg}`}
                    style={[
                      tw`flex flex-row items-center justify-between rounded-lg border border-solid border-palette-gray2 px-4 py-2.5 no-underline dark:border-default`,
                      isSmallScreen && tw`px-3 pt-2`,
                    ]}
                    hoverStyle={tw`bg-palette-gray1 dark:bg-dark`}>
                    <View
                      style={[
                        tw`flex w-full max-w-full flex-row items-center gap-2.5`,
                        isSmallScreen && tw`flex-col items-start gap-1`,
                      ]}>
                      <Caption style={tw`flex-shrink-0 text-sm`}>{npmPkg}</Caption>
                      <Label numberOfLines={1} style={tw`font-light text-secondary`}>
                        {github.description}
                      </Label>
                      <View
                        style={[
                          tw`ml-auto flex-row gap-4 text-sm font-light leading-[14px] text-icon`,
                          isSmallScreen && tw`ml-0 mt-1`,
                        ]}>
                        <View style={tw`flex-row items-center gap-1`}>
                          <Star style={tw`size-4 text-tertiary dark:text-palette-gray5`} />
                          <span>{github.stats.stars.toLocaleString()}</span>
                        </View>
                        <View style={tw`flex-row items-center gap-1`}>
                          <Download style={tw`text-tertiary dark:text-palette-gray5`} />
                          <span>{(npm?.downloads ?? 0).toLocaleString()}</span>
                        </View>
                      </View>
                    </View>
                  </A>
                </LI>
              ))}
          </UL>
          {isSmallScreen && data.total > LIMIT && (
            <A href={`/?owner=${encodeURI(owner)}`} style={tw`text-center`}>
              <Caption style={tw`font-light`}>See all packages</Caption>
            </A>
          )}
        </>
      )}
    </>
  );
}
