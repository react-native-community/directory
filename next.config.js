const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['react-native-web']);

module.exports = withPlugins(
  [withTM, [withExpo, { projectRoot: __dirname }], withImages, withFonts],
  {
    productionBrowserSourceMaps: true,
    eslint: {
      ignoreDuringBuilds: true,
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
  }
);
