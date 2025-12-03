import { type ImgHTMLAttributes, useContext } from 'react';
import { StyleSheet } from 'react-native';

import { colors, darkColors } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  hideOnError?: boolean;
};

export default function Avatar({ src, alt, style, hideOnError = true, ...rest }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const avatarStyle = {
    ...styles.avatar,
    backgroundColor: isDark ? darkColors.powder : colors.gray2,
    ...style,
  };

  return (
    <img
      src={src}
      style={avatarStyle}
      alt={alt}
      onError={hideOnError ? hideAvatarOnError : undefined}
      {...rest}
    />
  );
}

function hideAvatarOnError(error: any) {
  const target = error.currentTarget;
  target.src = '';
  target.style.display = 'none';
}

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '100%',
  },
});
