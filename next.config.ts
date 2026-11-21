import { withExpo } from '@expo/next-adapter';
import BundleAnalyzer from '@next/bundle-analyzer';
import { type NextConfig } from 'next';
import withPlugins from 'next-compose-plugins';
import withFonts from 'next-fonts';
import withImages from 'next-images';
import { withUniwind } from 'uniwind-plugin-next';

const PACKAGES_TO_OPTIMIZE = [
  '@expo/html-elements',
  '@react-native-picker/picker',
  '@sentry/*',
  '@shikijs/*',
  '@videojs/*',
  '@visx/*',
  'es-toolkit',
  'es-toolkit/*',
  'node-emoji',
  'react-native-safe-area-context',
  'react-native-svg',
  'react-shiki',
  'semver',
  'shiki/*',
];

const PACKAGES_TO_TRANSPILE = [...PACKAGES_TO_OPTIMIZE, 'react-native', 'react-native-web'];

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

function withUniwindPlugin(config: NextConfig) {
  function configureWebpack(
    webpackConfig: Parameters<NonNullable<NextConfig['webpack']>>[0],
    options: Parameters<NonNullable<NextConfig['webpack']>>[1]
  ) {
    const result = config.webpack?.(webpackConfig, options) ?? webpackConfig;
    result.resolve ??= {};
    result.resolve.mainFields = options.isServer
      ? ['module', 'main']
      : ['browser', 'module', 'main'];
    return result;
  }

  return withUniwind(
    {
      ...config,
      webpack: configureWebpack,
    },
    { cssEntryFile: './styles/styles.css' }
  );
}

export default withPlugins(
  [withExpo, withImages, withFonts, withBundleAnalyzer, withUniwindPlugin],
  {
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    poweredByHeader: false,
    devIndicators: false,
    reactCompiler: true,
    images: {
      disableStaticImages: true,
    },
    transpilePackages: PACKAGES_TO_TRANSPILE,
    logging: {
      browserToTerminal: true,
    },
    experimental: {
      forceSwcTransforms: true,
      webpackBuildWorker: true,
      useTypeScriptCli: true,
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
        {
          source: '/fonts/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/favicon.:ext',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/icon-:name.:ext',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
      ];
    },
  } satisfies NextConfig
);
