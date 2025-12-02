import { View } from 'react-native';

type ThreeDotsProps = {
  color: string;
  label?: string;
};

export function ThreeDotsLoader({ color, label = 'Loading' }: ThreeDotsProps) {
  const colorStyle = { backgroundColor: color };
  return (
    <View role="status" aria-label={label} aria-live="polite" id="dots-loader">
      <span className="dot" style={colorStyle} />
      <span className="dot" style={colorStyle} />
      <span className="dot" style={colorStyle} />
    </View>
  );
}
