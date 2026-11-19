import { type PropsWithChildren } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { A, HoverEffect, P } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

type Props = PropsWithChildren & {
  href?: string;
  onPress?: () => void;
  openInNewTab?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  containerClassName?: string;
};

export function Button({
  children,
  href,
  onPress,
  className,
  style,
  containerClassName,
  openInNewTab,
  ...rest
}: Props) {
  const isLink = !!href;
  const buttonClassName = cx(
    'bg-primary-darker dark:bg-primary-dark cursor-pointer items-center justify-center rounded outline-offset-1 select-none',
    className
  );

  const content = typeof children === 'string' ? <P>{children}</P> : children;

  return (
    <HoverEffect
      className={containerClassName}
      onPress={isLink ? undefined : onPress}
      tabIndex={isLink ? -1 : 0}>
      {isLink ? (
        <A
          href={href}
          role="button"
          className="rounded font-sans no-underline"
          {...(openInNewTab ? { target: '_blank' } : {})}
          {...(href?.startsWith('#') ? { target: '_self' } : {})}
          {...rest}>
          <View focusable={false} className={buttonClassName} style={style} accessible={false}>
            {content}
          </View>
        </A>
      ) : (
        <View role="button" focusable={false} className={buttonClassName} style={style} {...rest}>
          {content}
        </View>
      )}
    </HoverEffect>
  );
}
