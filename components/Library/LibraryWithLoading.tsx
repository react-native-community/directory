import dynamic from 'next/dynamic';
import { type ComponentProps } from 'react';

import LoadingContent from '~/components/Library/LoadingContent';
import tw from '~/util/tailwind';

import type Library from './index';

type LoadingProps = {
  loadingVariant?: 'default' | 'grid' | 'home';
};

export type LibraryWithLoadingProps = ComponentProps<typeof Library> & LoadingProps;

const LazyLibrary = dynamic<ComponentProps<typeof Library>>(() => import('./index'), {
  loading: () => <LoadingContent />,
});

const LazyGridLibrary = dynamic<ComponentProps<typeof Library>>(() => import('./index'), {
  loading: () => <LoadingContent width="48.5%" height={210} wrapperStyle={tw`mx-[2%]}`} />,
});

const LazyHomeLibrary = dynamic<ComponentProps<typeof Library>>(() => import('./index'), {
  loading: () => <LoadingContent width="48.5%" height={124} wrapperStyle={tw`mx-[2%]}`} />,
});

export function LibraryWithLoading({
  loadingVariant = 'default',
  ...libraryProps
}: LibraryWithLoadingProps) {
  const LibraryComponent =
    loadingVariant === 'grid'
      ? LazyGridLibrary
      : loadingVariant === 'home'
        ? LazyHomeLibrary
        : LazyLibrary;
  return <LibraryComponent {...libraryProps} />;
}
