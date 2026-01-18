import * as HtmlElements from '@expo/html-elements';
import { type TextProps } from '@expo/html-elements/build/primitives/Text';
import Link from 'next/link';
import { type ComponentType, type CSSProperties, type PropsWithChildren, useState } from 'react';
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
  headline: tw`text-[16px] font-medium`,
  p: tw`text-[16px]`,
  caption: tw`text-[15px] leading-[22px]`,
  label: tw`text-[12px] font-medium`,
});

type CustomTextProps = TextProps &
  PropsWithChildren<{
    id?: string;
    numberOfLines?: number;
  }>;

export function createTextComponent(
  Element: ComponentType<TextProps>,
  textStyle?: StyleProp<Style>
) {
  function TextComponent({ children, style, id, numberOfLines }: CustomTextProps) {
    const elementStyle = Element?.displayName
      ? StyleSheet.flatten(textStyles[Element.displayName as keyof typeof textStyles])
      : undefined;

    return (
      <Element
        id={id}
        numberOfLines={numberOfLines}
        style={[
          tw`font-sans font-normal my-0 text-black dark:text-white`,
          elementStyle as StyleProp<Style>,
          textStyle,
          style,
        ]}>
        {children}
      </Element>
    );
  }

  TextComponent.displayName = `TextComponent(${Element.displayName ?? Element.name ?? 'Unknown'})`;

  return TextComponent;
}

export const H1 = createTextComponent(HtmlElements.H1, textStyles.h1);
export const H2 = createTextComponent(HtmlElements.H2, textStyles.h2);
export const H3 = createTextComponent(HtmlElements.H3, textStyles.h3);
export const H4 = createTextComponent(HtmlElements.H4, textStyles.h4);
export const H5 = createTextComponent(HtmlElements.H5, textStyles.h5);
export const H6 = createTextComponent(HtmlElements.H6, textStyles.h6);
export const P = createTextComponent(HtmlElements.P, textStyles.p);
export const Headline = createTextComponent(HtmlElements.P, textStyles.headline);
export const Caption = createTextComponent(HtmlElements.P, textStyles.caption);
export const Label = createTextComponent(HtmlElements.P, textStyles.label);

type AProps = PropsWithChildren<{
  style?: StyleProp<Style>;
  target?: string;
  href: string;
  hoverStyle?: StyleProp<Style>;
  containerStyle?: CSSProperties;
  role?: Role;
}>;

export function A({
  href,
  target,
  children,
  style,
  hoverStyle,
  containerStyle,
  role,
  ...rest
}: AProps) {
  const [isHovered, setIsHovered] = useState(false);

  const linkStyles = tw`font-sans text-black underline decoration-pewter dark:text-white dark:decoration-palette-gray5`;
  const linkHoverStyles = tw`decoration-primary-dark`;

  if ((target === '_self' && !href.startsWith('#')) || href.startsWith('/')) {
    const passedStyle = StyleSheet.flatten(style);
    return (
      <Link
        {...rest}
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

  return (
    <span
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{ ...tw`contents`, ...containerStyle }}>
      <HtmlElements.A
        {...rest}
        href={href}
        numberOfLines={containerStyle ? 1 : undefined}
        target={target ?? '_blank'}
        hrefAttrs={{ target: target ?? '_blank' }}
        style={[linkStyles, isHovered && linkHoverStyles, style, isHovered && hoverStyle]}>
        {children}
      </HtmlElements.A>
    </span>
  );
}

type HoverEffectProps = PressableProps & { style?: StyleProp<ViewStyle> };

export function HoverEffect({ children, style, onPress, ...rest }: HoverEffectProps) {
  return (
    <Pressable
      style={({ hovered, pressed }) => [
        { transition: 'opacity 0.33s' },
        hovered && tw`opacity-75`,
        pressed && tw`opacity-50`,
        style,
      ]}
      accessible={false}
      focusable={false}
      tabIndex={onPress ? 0 : -1}
      onPress={onPress}
      {...rest}>
      {children}
    </Pressable>
  );
}
