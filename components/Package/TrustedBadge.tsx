import { type StyleProp, View, type ViewStyle } from 'react-native';

import { VerifiedIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function TrustedBadge({ style }: Props) {
  return (
    <Tooltip
      trigger={
        <View role="button" aria-label="Trusted publisher" style={style}>
          <VerifiedIcon style={tw`h-[15px] w-4 text-success`} />
        </View>
      }
      sideOffset={0}>
      Trusted publisher
    </Tooltip>
  );
}
