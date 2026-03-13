import { Label } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  content: {
    key?: string;
    label?: string;
  }[];
};

export const focusHintLabel = tw`font-light text-palette-gray4`;
export const focusHintKey = tw`min-w-6 rounded-[3px] bg-palette-gray5 px-1 py-[3px] text-center tracking-[0.75px] text-tertiary dark:bg-powder`;

export default function InputKeyHint({ content }: Props) {
  return content.map(entry => {
    if ('key' in entry) {
      return (
        <Label key={`key-${entry.key}`} style={focusHintKey}>
          {entry.key}
        </Label>
      );
    } else if ('label' in entry) {
      return (
        <Label key={`key-${entry.label}`} style={focusHintLabel}>
          {entry.label}
        </Label>
      );
    }
  });
}
