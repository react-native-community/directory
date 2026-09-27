import { type ImgHTMLAttributes } from 'react';

import tw from '~/util/tailwind';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  hideOnError?: boolean;
};

export default function UserAvatar({ src, alt, style, hideOnError = true, ...rest }: Props) {
  return (
    <img
      src={src}
      style={{
        ...tw`size-9 rounded-full bg-palette-gray2 dark:bg-powder`,
        ...style,
      }}
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
