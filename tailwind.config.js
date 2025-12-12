import plugin from 'tailwindcss/plugin';

const palette = {
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
    backgroundColor: {
      transparent: 'transparent',
      current: 'currentColor',
      ...palette,
    },
    borderColor: {
      transparent: 'transparent',
      current: 'currentColor',
      ...palette,
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...palette,
    },
    gradientColorStops: {
      transparent: 'transparent',
      ...palette,
    },
    extend: {},
  },
  corePlugins: {
    fontFamily: false,
  },
  plugins: [
    plugin(({ addUtilities, addVariant }) => {
      // addVariant('hocus', ['&:hover', '&:focus-visible']);
      addUtilities({
        '.break-words': { 'word-break': 'break-word' },
        '.wrap-anywhere': { 'overflow-wrap': 'anywhere' },
      });
    }),
  ],
};
