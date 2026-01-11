import { View } from 'react-native';

type ThreeDotsProps = {
  label?: string;
};

export default function ThreeDotsLoader({ label = 'Loading' }: ThreeDotsProps) {
  return (
    <View role="status" aria-label={label} aria-live="polite" id="dots-loader">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </View>
  );
}
