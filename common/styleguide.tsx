import * as HtmlElements from '@expo/html-elements';
import Link from 'next/link';
import { PropsWithChildren, PropsWithRef, useContext, useRef } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { useHover, useDimensions, useActive } from 'react-native-web-hooks';

import CustomAppearanceContext from '../context/CustomAppearanceContext';

export const layout = {
  maxWidth: 1200,
};

export const useLayout = () => {
  const {
    window: { width },
  } = useDimensions();
  return {
    isSmallScreen: width < 800,
    isBelowMaxWidth: width < layout.maxWidth,
  };
};

export const colors = {
  primary: '#61DAFB',
  primaryLight: '#c1f4ff',
  primaryDark: '#39BEE2',
  sky: '#C6EEFB',
  powder: '#EEFAFE',
  pewter: '#BEC8CB',
  gray1: '#f7f7f7',
  gray2: '#ececec',
  gray3: '#CFCFD5',
  gray4: '#82889E',
  gray5: '#505461',
  gray6: '#2A2C33',
  gray7: '#21232A',
  black: '#242424',
  white: '#ffffff',
  secondary: '#afb1af',
  warning: '#FBE679',
  warningLight: '#FEF7D6',
  warningDark: '#995e00',
  error: '#ff5555',
  success: '#4caf50',
};

export const darkColors = {
  black: '#000',
  background: '#19191f',
  subHeader: '#14141a',
  border: '#2a2e36',
  veryDark: '#111114',
  dark: '#14141a',
  powder: '#262a36',
  pewter: '#767C8E',
  secondary: '#a2a7ab',
  warningLight: '#2f2704',
  warning: '#9a810c',
};

const baseTextStyles = {
  color: colors.black,
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

type TextProps = PropsWithRef<
  PropsWithChildren<{
    style?: TextStyles;
    id?: string;
    numberOfLines?: number;
  }>
>;

const createTextComponent = (Element: any, textStyle?: TextStyles) => {
  const TextComponent = ({ children, style, id, numberOfLines }: TextProps) => {
    const { isDark } = useContext(CustomAppearanceContext);
    return (
      <Element
        id={id}
        numberOfLines={numberOfLines}
        style={[
          textStyles[Element],
          textStyle,
          { color: isDark ? colors.white : colors.black },
          style,
        ]}>
        {children}
      </Element>
    );
  };

  TextComponent.displayName = `TextComponent(${Element.displayName ?? Element.name ?? 'Unknown'})`;

  return TextComponent;
};

export const H1 = createTextComponent(HtmlElements.H1, textStyles.h1);
export const H2 = createTextComponent(HtmlElements.H2, textStyles.h2);
export const H3 = createTextComponent(HtmlElements.H3, textStyles.h3);
export const H4 = createTextComponent(HtmlElements.H4, textStyles.h4);
export const H5 = createTextComponent(HtmlElements.H5, textStyles.h5);
export const P = createTextComponent(HtmlElements.P, textStyles.p);
export const Headline = createTextComponent(HtmlElements.P, textStyles.headline);
export const Caption = createTextComponent(HtmlElements.P, textStyles.caption);
export const Label = createTextComponent(HtmlElements.P, textStyles.label);

type AProps = PropsWithChildren<{
  style?: TextStyles;
  target?: string;
  href: string;
  hoverStyle?: TextStyles;
}>;

export const A = ({ href, target = '_blank', children, style, hoverStyle, ...rest }: AProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const linkRef = useRef();
  const isHovered = useHover(linkRef);

  const linkStyles = getLinkStyles(isDark);
  const linkHoverStyles = getLinkHoverStyles(isDark);

  if (target === '_self' && !href.startsWith('#')) {
    return (
      <Link
        {...rest}
        href={href}
        style={{
          ...linkStyles,
          ...(isHovered && linkHoverStyles),
          ...(style as any),
          ...(isHovered && hoverStyle),
        }}
        ref={linkRef}>
        {children}
      </Link>
    );
  }

  return (
    <HtmlElements.A
      {...rest}
      href={href}
      target={target}
      style={[linkStyles, isHovered && linkHoverStyles, style, isHovered && hoverStyle]}
      ref={linkRef}>
      {children}
    </HtmlElements.A>
  );
};

const getLinkStyles = (isDark: boolean) => ({
  color: isDark ? colors.white : colors.black,
  backgroundColor: isDark ? darkColors.powder : colors.powder,
  textDecorationColor: isDark ? colors.gray5 : colors.pewter,
  textDecorationLine: 'underline',
  fontFamily: 'inherit',
});

const getLinkHoverStyles = (isDark: boolean) => ({
  backgroundColor: isDark ? colors.primaryDark : colors.sky,
  color: isDark ? darkColors.dark : colors.black,
  textDecorationColor: isDark ? darkColors.powder : colors.gray4,
});

export const HoverEffect = ({ children }) => {
  const ref = useRef();
  const isHovered = useHover(ref);
  const isActive = useActive(ref);

  return (
    <View
      ref={ref}
      style={[isHovered && { opacity: 0.8 }, isActive && { opacity: 0.5 }]}
      accessible={false}>
      {children}
    </View>
  );
};
