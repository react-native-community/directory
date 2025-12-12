import { type StyleProp, View, type ViewStyle } from 'react-native';

import tw from '~/util/tailwind';

import { Check } from './Icons';

type Props = {
  style?: StyleProp<ViewStyle>;
  value?: boolean;
};

export default function CheckBox({ style, value }: Props) {
  return (
    <View
      style={[
        // TODO: figure out transitions i.e `transition-color`
        tw`size-[18px] items-center justify-center border-2 rounded-sm mr-2`,
        value
          ? tw`border-primary-dark bg-primary-dark`
          : tw`border-palette-gray4 bg-white dark:border-default dark:bg-dark`,
        style,
      ]}>
      {value ? <Check width={14} height={10} style={tw`text-white dark:text-black`} /> : null}
    </View>
  );
}
