import { View } from 'react-native';

import { colors } from '~/common/styleguide';
import { Verified } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';

export default function TrustedBadge() {
  return (
    <Tooltip
      trigger={
        <View>
          <Verified width={16} height={16} fill={colors.success} />
        </View>
      }>
      Trusted publisher
    </Tooltip>
  );
}
