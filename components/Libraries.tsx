import dynamic from 'next/dynamic';
import { StyleSheet, View } from 'react-native';

import LoadingContent from './Library/LoadingContent';
import { NotFoundContent } from './NotFoundContent';
import { Library as LibraryType } from '../types';

type Props = {
  libraries: LibraryType[];
};

const LibraryWithLoading = dynamic(() => import('../components/Library'), {
  loading: () => <LoadingContent />,
});

const Libraries = ({ libraries }: Props) => {
  if (!libraries || !libraries.length) {
    return <NotFoundContent />;
  }

  return (
    <View style={styles.librariesContainer}>
      {libraries.map((item: any, index: number) => (
        <LibraryWithLoading key={`list-item-${index}-${item.github.name}`} library={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  librariesContainer: {
    paddingTop: 12,
  },
});

export default Libraries;
