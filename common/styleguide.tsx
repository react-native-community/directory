import * as HtmlElements from '@expo/html-elements';
import { type TextProps } from '@expo/html-elements/build/primitives/Text';
import Link from 'next/link';
import { type ComponentType, type CSSProperties, type PropsWithChildren, useState } from 'react';
import {
  StyleSheet,
  type TextStyle,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import tw from '~/util/tailwind';

export const layout = {
  maxWidth: 1200,
};

export function useLayout() {
  const { width } = useWindowDimensions();
  return {
    isSmallScreen: width < 800,
    isBelowMaxWidth: width < layout.maxWidth,
  };
}

const baseTextStyles = {
  marginVertical: 0,
  fontWeight: '400' as const,
  fontFamily: 'inherit',
};

const textStyles = StyleSheet.create({
  h1: { ...baseTextStyles, fontSize: 57.25, fontWeight: '600' as const },
  h2: { ...baseTextStyles, fontSize: 35.5, fontWeight: '600' as const },
  h3: { ...baseTextStyles, fontSize: 26.5, fontWeight: '600' as const },
  h4: { ...baseTextStyles, fontSize: 22 },
  h5: { ...baseTextStyles, fontSize: 20 },
  h6: { ...baseTextStyles, fontSize: 18 },
  headline: { ...baseTextStyles, fontSize: 16, fontWeight: '500' as const },
  p: { ...baseTextStyles, fontSize: 16 },
  caption: { ...baseTextStyles, fontSize: 15, lineHeight: 22 },
  label: { ...baseTextStyles, fontSize: 12, fontWeight: '500' as const },
});

type TextStyles = TextStyle | TextStyle[];

type CustomTextProps = TextProps &
  PropsWithChildren<{
    id?: string;
    numberOfLines?: number;
  }>;

export function createTextComponent(Element: ComponentType<TextProps>, textStyle?: TextStyles) {
  function TextComponent({ children, style, id, numberOfLines }: CustomTextProps) {
    const elementStyle = Element?.displayName
      ? StyleSheet.flatten(textStyles[Element.displayName as keyof typeof textStyles])
      : undefined;

    return (
      <Element
        id={id}
        numberOfLines={numberOfLines}
        style={[elementStyle, textStyle, tw`text-black dark:text-white`, style]}>
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
  style?: StyleProp<TextStyle>;
  target?: string;
  href: string;
  hoverStyle?: StyleProp<TextStyle>;
  containerStyle?: CSSProperties | undefined;
}>;

export function A({ href, target, children, style, hoverStyle, containerStyle, ...rest }: AProps) {
  const [isHovered, setIsHovered] = useState(false);

  const linkStyles = tw`font-sans text-black underline decoration-pewter dark:text-white dark:decoration-palette-gray5`;
  const linkHoverStyles = tw`decoration-primary-dark`;

  if ((target === '_self' && !href.startsWith('#')) || href.startsWith('/')) {
    const passedStyle = StyleSheet.flatten(style);
    return (
      <Link
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

type HoverEffectProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export function HoverEffect({ children, style }: HoverEffectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <View
      style={[
        { transition: 'opacity 0.33s' },
        isHovered && tw`opacity-75`,
        isActive && tw`opacity-50`,
        style,
      ]}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerDown={() => setIsActive(true)}
      onPointerUp={() => setIsActive(false)}
      accessible={false}>
      {children}
    </View>
  );
}
