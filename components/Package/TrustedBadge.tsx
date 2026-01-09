import { View } from 'react-native';

import { Verified } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

export default function TrustedBadge() {
  return (
    <Tooltip
      trigger={
        <View role="button" aria-label="Trusted publisher">
          <Verified width={16} height={16} style={tw`text-success`} />
        </View>
      }>
      Trusted publisher
    </Tooltip>
  );
}
