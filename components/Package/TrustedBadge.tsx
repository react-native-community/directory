import { type StyleProp, View, type ViewStyle } from 'react-native';

import { VerifiedIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';

type Props = {
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export default function TrustedBadge({ className, style }: Props) {
  return (
    <Tooltip
      trigger={
        <View className={className} role="button" aria-label="Trusted publisher" style={style}>
          <VerifiedIcon className="text-success h-[15px] w-4" />
        </View>
      }
      sideOffset={0}>
      Trusted publisher
    </Tooltip>
  );
}
