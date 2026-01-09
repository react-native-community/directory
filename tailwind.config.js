import plugin from 'tailwindcss/plugin';

const palette = {
  black: 'var(--black)',
  white: 'var(--white)',

  primary: 'var(--primary)',
  'primary-dark': 'var(--primary-dark)',
  'primary-darker': 'var(--primary-darker)',
  'primary-hover': 'var(--primary-hover)',
  'primary-active-hover': 'var(--primary-active-hover)',

  secondary: 'var(--secondary)',
  tertiary: 'var(--tertiary)',
  accented: 'var(--accented)',

  powder: 'var(--powder)',
  pewter: 'var(--pewter)',

  success: 'var(--success)',
  error: 'var(--error)',
  warning: 'var(--warning)',
  'warning-light': 'var(--warning-light)',
  'warning-dark': 'var(--warning-dark)',

  'palette-gray1': 'var(--gray-1)',
  'palette-gray2': 'var(--gray-2)',
  'palette-gray3': 'var(--gray-3)',
  'palette-gray4': 'var(--gray-4)',
  'palette-gray5': 'var(--gray-5)',
  'palette-gray6': 'var(--gray-6)',
  'palette-gray7': 'var(--gray-7)',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './common/**/*.tsx',
    './components/**/*.tsx',
    './context/**/*.tsx',
    './pages/**/*.tsx',
    './scenes/**/*.tsx',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      small: '800px',
      layout: '1200px',
    },
    fontFamily: {
      sans: ['Optimistic Display', 'ui-sans-serif', 'system-ui'],
      mono: ['monospace', 'ui-monospace'],
    },
    backgroundColor: {
      transparent: 'transparent',
      current: 'currentColor',
      default: 'var(--background)',
      ...palette,

      // TODO: temporary values, replace with proper gray palette for dark mode
      dark: 'var(--dark)',
      'very-dark': 'var(--very-dark)',
    },
    borderColor: {
      transparent: 'transparent',
      current: 'currentColor',
      default: 'var(--border)',
      ...palette,

      // TODO: temporary values, replace with proper gray palette for dark mode
      dark: 'var(--dark)',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      icon: 'var(--icon)',
      hover: 'var(--hover)',
      ...palette,
    },
    gradientColorStops: {
      transparent: 'transparent',
      ...palette,
    },
    extend: {
      maxWidth: {
        layout: 1200,
        footer: 960,
      },
    },
  },
  corePlugins: {
    fontFamily: false,
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.break-words': { 'word-break': 'break-word' },
        '.wrap-anywhere': { 'overflow-wrap': 'anywhere' },
      });
    }),
  ],
};
