import { type ImgHTMLAttributes } from 'react';

import { cx } from '~/util/tailwind';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  hideOnError?: boolean;
};

export default function UserAvatar({
  src,
  alt,
  className,
  style,
  hideOnError = true,
  ...rest
}: Props) {
  return (
    <img
      src={src}
      className={cx('bg-palette-gray2 dark:bg-powder size-9 rounded-full', className)}
      style={style}
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
