import { withExpo } from '@expo/next-adapter';
import BundleAnalyzer from '@next/bundle-analyzer';
import { type NextConfig } from 'next';
import withPlugins from 'next-compose-plugins';
import withFonts from 'next-fonts';
import withImages from 'next-images';

const PACKAGES_TO_OPTIMIZE = [
  '@expo/html-elements',
  '@react-native-picker/picker',
  '@sentry/*',
  'node-emoji',
  'react-native',
  'react-native-safe-area-context',
  'react-native-svg',
  'react-native-web',
  'react-shiki',
  'shiki/*',
];

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withPlugins([withExpo, withImages, withFonts, withBundleAnalyzer], {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  reactCompiler: true,
  images: {
    disableStaticImages: true,
  },
  transpilePackages: PACKAGES_TO_OPTIMIZE,
  experimental: {
    forceSwcTransforms: true,
    webpackBuildWorker: true,
    browserDebugInfoInTerminal: true,
    useLightningcss: true,
    optimizePackageImports: PACKAGES_TO_OPTIMIZE,
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
} satisfies NextConfig);
