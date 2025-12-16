import dynamic from 'next/dynamic';
import { StyleSheet, View } from 'react-native';

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
    <View style={styles.librariesContainer}>
      {libraries.map((item, index) => (
        <LibraryWithLoading key={`list-item-${index}-${item.github.name}`} library={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  librariesContainer: {
    paddingTop: 12,
  },
});
