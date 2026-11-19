import * as HtmlElements from '@expo/html-elements';
import { type TextProps } from '@expo/html-elements/primitives/Text';
import Link from 'next/link';
import { type ComponentType, type PropsWithChildren, type Ref, useState } from 'react';
import {
  Pressable,
  type PressableProps,
  type Role,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

import { cx } from '~/util/tailwind';

export function useLayout() {
  const { width } = useWindowDimensions();
  return {
    isMobileScreen: width < 400,
    isSmallScreen: width < 800,
    isBelowMaxWidth: width < 1200,
  };
}

const textStyles = {
  h1: 'text-[57.25px] font-semibold',
  h2: 'text-[35.5px] font-semibold',
  h3: 'text-[26.5px] font-semibold',
  h4: 'text-[22px]',
  h5: 'text-[20px]',
  h6: 'text-[18px]',
  h6section: 'text-secondary text-[16px] tracking-tight',
  headline: 'text-[16px] font-medium',
  p: 'text-[16px]',
  caption: 'text-[15px] leading-[22px] tracking-normal',
  label: 'text-[12px] font-medium tracking-normal',
};

type CustomTextProps = TextProps &
  PropsWithChildren<{
    id?: string;
    numberOfLines?: number;
  }>;

function renderTextComponent(
  Element: ComponentType<TextProps>,
  textStyle: string,
  { children, className, style, id, numberOfLines }: CustomTextProps
) {
  const hasFontFamilyClass = className
    ?.split(/\s+/)
    .some(name => name === 'font-sans' || name === 'font-mono');
  const resolvedTextClassName = cx(textStyle, className);
  const hasTextColorClass = resolvedTextClassName.split(/\s+/).some(className => {
    const textUtility = className.split(':').at(-1);
    return textUtility?.startsWith('text-') && twMerge('text-black', textUtility) === textUtility;
  });

  return (
    <Element
      id={id}
      numberOfLines={numberOfLines}
      className={cx(
        !hasFontFamilyClass && 'font-sans',
        'my-0! font-normal',
        !hasTextColorClass && 'text-black dark:text-white',
        resolvedTextClassName
      )}
      style={style}>
      {children}
    </Element>
  );
}

export function H1(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.H1, textStyles.h1, props);
}

export function H2(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.H2, textStyles.h2, props);
}

export function H3(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.H3, textStyles.h3, props);
}

export function H4(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.H4, textStyles.h4, props);
}

export function H5(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.H5, textStyles.h5, props);
}

export function H6(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.H6, textStyles.h6, props);
}

export function H6Section(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.H6, textStyles.h6section, props);
}

export function P(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.P, textStyles.p, props);
}

export function Headline(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.P, textStyles.headline, props);
}

export function Caption(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.P, textStyles.caption, props);
}

export function Label(props: CustomTextProps) {
  return renderTextComponent(HtmlElements.P, textStyles.label, props);
}

type AProps = PropsWithChildren<{
  className?: string;
  style?: StyleProp<TextStyle>;
  target?: string;
  href: string;
  hoverStyle?: string;
  containerStyle?: StyleProp<ViewStyle>;
  containerClassName?: string;
  role?: Role;
  tabIndex?: number;
  'aria-hidden'?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}>;

export function A({
  href,
  target,
  children,
  className,
  style,
  hoverStyle,
  containerStyle,
  containerClassName,
  role,
  ref,
  ...rest
}: AProps) {
  const [isHovered, setIsHovered] = useState(false);
  const linkClassName = cx(
    'decoration-pewter dark:decoration-palette-gray5 font-sans text-black underline dark:text-white',
    className,
    isHovered && 'decoration-primary-dark',
    isHovered && hoverStyle
  );

  if (
    (target === '_self' && !href.startsWith('#')) ||
    (target !== '_blank' && href.startsWith('/'))
  ) {
    return (
      <Link
        {...rest}
        ref={ref}
        href={href}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className={linkClassName}
        style={StyleSheet.flatten(style) as any}>
        {children}
      </Link>
    );
  }

  const targetWithFallback = target ?? '_blank';

  return (
    <View
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={cx('contents', containerClassName)}
      style={containerStyle}>
      <HtmlElements.A
        {...rest}
        ref={ref as any}
        href={href}
        numberOfLines={containerStyle || containerClassName ? 1 : undefined}
        target={targetWithFallback}
        rel={targetWithFallback === '_blank' ? 'noopener noreferrer' : undefined}
        className={linkClassName}
        style={style}>
        {children}
      </HtmlElements.A>
    </View>
  );
}

type HoverEffectProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  hoveredStyle?: string;
  pressedStyle?: string;
};

export function HoverEffect({
  children,
  style,
  hoveredStyle,
  pressedStyle,
  onPress,
  onHoverIn,
  onHoverOut,
  onPressIn,
  onPressOut,
  focusable = false,
  ...rest
}: HoverEffectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      className={cx(
        '-outline-offset-2 transition-all duration-300',
        isHovered && (hoveredStyle ?? 'opacity-75'),
        isPressed && (pressedStyle ?? 'opacity-50')
      )}
      style={style}
      accessible={focusable}
      focusable={focusable}
      tabIndex={onPress || focusable ? 0 : -1}
      onPress={onPress}
      onHoverIn={event => {
        setIsHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={event => {
        setIsHovered(false);
        onHoverOut?.(event);
      }}
      onPressIn={event => {
        setIsPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={event => {
        setIsPressed(false);
        onPressOut?.(event);
      }}
      {...rest}>
      {children}
    </Pressable>
  );
}
