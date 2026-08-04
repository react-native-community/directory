import * as HtmlElements from '@expo/html-elements';
import { type TextProps } from '@expo/html-elements/build/primitives/Text';
import Link from 'next/link';
import { type ComponentType, type PropsWithChildren, type Ref, useState } from 'react';
import {
  Pressable,
  type PressableProps,
  type Role,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { type Style } from 'twrnc';

import tw from '~/util/tailwind';

export function useLayout() {
  const { width } = useWindowDimensions();
  return {
    isSmallScreen: width < 800,
    isBelowMaxWidth: width < 1200,
  };
}

const textStyles = StyleSheet.create({
  h1: tw`text-[57.25px] font-semibold`,
  h2: tw`text-[35.5px] font-semibold`,
  h3: tw`text-[26.5px] font-semibold`,
  h4: tw`text-[22px]`,
  h5: tw`text-[20px]`,
  h6: tw`text-[18px]`,
  h6section: tw`text-[16px] tracking-tight text-secondary`,
  headline: tw`text-[16px] font-medium`,
  p: tw`text-[16px]`,
  caption: tw`text-[15px] leading-[22px] tracking-normal`,
  label: tw`text-[12px] font-medium tracking-normal`,
});

type CustomTextProps = TextProps &
  PropsWithChildren<{
    id?: string;
    numberOfLines?: number;
  }>;

function renderTextComponent(
  Element: ComponentType<TextProps>,
  textStyle: StyleProp<Style> | undefined,
  { children, style, id, numberOfLines }: CustomTextProps
) {
  return (
    <Element
      id={id}
      numberOfLines={numberOfLines}
      style={[tw`font-sans my-0 font-normal text-black dark:text-white`, textStyle, style]}>
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
  style?: StyleProp<Style>;
  target?: string;
  href: string;
  hoverStyle?: StyleProp<Style>;
  containerStyle?: Style;
  role?: Role;
  ref?: Ref<HTMLAnchorElement>;
}>;

export function A({
  href,
  target,
  children,
  style,
  hoverStyle,
  containerStyle,
  role,
  ref,
  ...rest
}: AProps) {
  const [isHovered, setIsHovered] = useState(false);

  const linkStyles = tw`font-sans text-black underline decoration-pewter dark:text-white dark:decoration-palette-gray5`;
  const linkHoverStyles = tw`decoration-primary-dark`;

  if (
    (target === '_self' && !href.startsWith('#')) ||
    (target !== '_blank' && href.startsWith('/'))
  ) {
    const passedStyle = StyleSheet.flatten(style);
    return (
      <Link
        {...rest}
        ref={ref}
        href={href}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        style={{
          ...linkStyles,
          ...(passedStyle as any),
          ...(isHovered && linkHoverStyles),
          ...(isHovered && hoverStyle && StyleSheet.flatten(hoverStyle)),
        }}>
        {children}
      </Link>
    );
  }

  const targetWithFallback = target ?? '_blank';

  return (
    <span
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{ ...tw`contents`, ...containerStyle }}>
      <HtmlElements.A
        {...rest}
        ref={ref as any}
        href={href}
        numberOfLines={containerStyle ? 1 : undefined}
        target={targetWithFallback}
        rel={targetWithFallback === '_blank' ? 'noopener noreferrer' : undefined}
        style={[linkStyles, isHovered && linkHoverStyles, style, isHovered && hoverStyle]}>
        {children}
      </HtmlElements.A>
    </span>
  );
}

type HoverEffectProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  hoveredStyle?: Style;
  pressedStyle?: Style;
};

export function HoverEffect({
  children,
  style,
  hoveredStyle,
  pressedStyle,
  onPress,
  focusable = false,
  ...rest
}: HoverEffectProps) {
  return (
    <Pressable
      style={({ hovered, pressed }) => [
        tw`-outline-offset-2`,
        { transition: 'all 0.33s' },
        style,
        hovered && (hoveredStyle ?? tw`opacity-75`),
        pressed && (pressedStyle ?? tw`opacity-50`),
      ]}
      accessible={focusable}
      focusable={focusable}
      tabIndex={onPress || focusable ? 0 : -1}
      onPress={onPress}
      {...rest}>
      {children}
    </Pressable>
  );
}
