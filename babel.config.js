module.exports = {
  presets: [
    'next/babel',
    [
      'babel-preset-expo',
      {
        web: { useTransformReactJsxExperimental: true },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ],
};
