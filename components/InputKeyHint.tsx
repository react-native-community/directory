import { Label } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  content: {
    key?: string;
    label?: string;
  }[];
  variableTheme?: boolean;
};

export default function InputKeyHint({ content, variableTheme = false }: Props) {
  return content.map(entry => {
    if ('key' in entry) {
      return (
        <Label
          key={`key-${entry.key}`}
          style={[
            tw`font-mono min-w-6 rounded-[3px] bg-palette-gray5 px-1 py-[3px] text-center tracking-[0.25px] text-tertiary dark:bg-powder dark:text-secondary`,
            variableTheme &&
              tw`bg-palette-gray2 text-tertiary dark:bg-palette-gray7 dark:text-palette-gray4`,
          ]}>
          {entry.key}
        </Label>
      );
    } else if ('label' in entry) {
      return (
        <Label
          key={`key-${entry.label}`}
          style={[
            tw`font-light text-palette-gray4`,
            variableTheme && tw`text-tertiary dark:text-palette-gray4`,
          ]}>
          {entry.label}
        </Label>
      );
    }
  });
}
