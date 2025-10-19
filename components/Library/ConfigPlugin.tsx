import { type StyleProp, type TextStyle } from 'react-native';

import { A, P } from '~/common/styleguide';

export const ConfigPluginContent = ({
  configPlugin,
  linkStyles,
  paragraphStyles,
  hoverStyle,
}: {
  configPlugin?: string | boolean;
  hoverStyle?: StyleProp<TextStyle>;
  linkStyles?: StyleProp<TextStyle>;
  paragraphStyles?: StyleProp<TextStyle>;
}) => {
  const url = typeof configPlugin === 'string' ? configPlugin : undefined;
  if (url) {
    return (
      <A href={url} style={linkStyles} hoverStyle={hoverStyle}>
        Config plugin
      </A>
    );
  }
  return <P style={paragraphStyles}>Config plugin</P>;
};

export const getConfigPluginText = ({ configPlugin }: { configPlugin?: string | boolean }) => {
  if (typeof configPlugin === 'string') {
    return `Expo Config Plugin available as a separate package`;
  } else if (configPlugin) {
    return 'Expo config plugin included';
  }
};
