module.exports = {
  extends: ['next', 'universe/native', 'universe/node', 'universe/web'],
  rules: {
    '@next/next/no-img-element': 'off',
    'import/namespace': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
  },
};
