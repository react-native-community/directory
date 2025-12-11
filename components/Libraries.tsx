import dynamic from 'next/dynamic';
import { View } from 'react-native';
import tw from 'twrnc';

import LoadingContent from '~/components/Library/LoadingContent';
import NotFound from '~/components/Package/NotFound';
import { type LibraryType } from '~/types';

type Props = {
  libraries: LibraryType[];
};

const LibraryWithLoading = dynamic(() => import('~/components/Library'), {
  loading: () => <LoadingContent />,
});

export default function Libraries({ libraries }: Props) {
  if (!libraries || !libraries.length) {
    return <NotFound />;
  }

  return (
    <View style={tw`pt-3`}>
      {libraries.map((item, index) => (
        <LibraryWithLoading key={`list-item-${index}-${item.github.name}`} library={item} />
      ))}
    </View>
  );
}
