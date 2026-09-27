import { View } from 'react-native';

import { LibraryWithLoading } from '~/components/Library/LibraryWithLoading';
import NotFoundContent from '~/components/NotFoundContent';
import { type LibraryType } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  libraries: LibraryType[];
};

export default function Libraries({ libraries }: Props) {
  if (!libraries?.length) {
    return <NotFoundContent />;
  }

  return (
    <View style={tw`pt-3`}>
      {libraries.map(item => (
        <LibraryWithLoading key={`list-item-${item.npmPkg}`} library={item} />
      ))}
    </View>
  );
}
