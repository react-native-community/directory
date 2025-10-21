import { type StyleProp, type TextStyle } from 'react-native';

import { A, P } from '~/common/styleguide';
import { type LibraryDataEntryType } from '~/types';

type Props = {
  configPlugin?: LibraryDataEntryType['configPlugin'];
  hoverStyle?: StyleProp<TextStyle>;
  linkStyles?: StyleProp<TextStyle>;
  paragraphStyles?: StyleProp<TextStyle>;
};

export function ConfigPluginContent({
  configPlugin,
  linkStyles,
  paragraphStyles,
  hoverStyle,
}: Props) {
  const url = typeof configPlugin === 'string' ? configPlugin : undefined;
  if (url) {
    return (
      <A href={url} style={linkStyles} hoverStyle={hoverStyle}>
        Config plugin
      </A>
    );
  }
  return <P style={paragraphStyles}>Config plugin</P>;
}

export function getConfigPluginText(configPlugin: LibraryDataEntryType['configPlugin']) {
  if (typeof configPlugin === 'string') {
    return `Expo config plugin available as a separate package`;
  } else if (configPlugin) {
    return 'Expo config plugin included';
  }
}
