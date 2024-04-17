const { withExpo } = require('@expo/next-adapter');
const withPlugins = require('next-compose-plugins');
const withFonts = require('next-fonts');
const withImages = require('next-images');

module.exports = withPlugins([withExpo, withImages, withFonts], {
  productionBrowserSourceMaps: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    disableStaticImages: true,
  },
  transpilePackages: [
    '@expo/html-elements',
    '@react-native-picker/picker',
    'react-native-safe-area-context',
    'react-native-svg',
    'react-native-web',
    'react-native-web-hooks',
    'react-native',
  ],
  experimental: {
    forceSwcTransforms: true,
  },
  async headers() {
    return [
      {
        source: '/api/libraries',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,HEAD' },
        ],
      },
    ];
  },
});
