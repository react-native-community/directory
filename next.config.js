import { withExpo } from '@expo/next-adapter';
import BundleAnalyzer from '@next/bundle-analyzer';
import withPlugins from 'next-compose-plugins';
import withFonts from 'next-fonts';
import withImages from 'next-images';

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withPlugins([withExpo, withImages, withFonts, withBundleAnalyzer], {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: {
    enabled: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    disableStaticImages: true,
  },
  transpilePackages: [
    '@expo/html-elements',
    '@react-native-picker/picker',
    '@sentry/react',
    'react-native-safe-area-context',
    'react-native-svg',
    'react-native-web',
    'react-native-web-hooks',
    'react-native',
  ],
  experimental: {
    forceSwcTransforms: true,
    webpackBuildWorker: true,
    browserDebugInfoInTerminal: true,
    clientSegmentCache: true,
    optimizePackageImports: [
      '@expo/html-elements',
      '@react-native-picker/picker',
      '@sentry/react',
      'react-native-safe-area-context',
      'react-native-svg',
      'react-native-web',
      'react-native-web-hooks',
      'react-native',
    ],
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
