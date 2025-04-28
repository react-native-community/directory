import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';
import universeNativeConfig from 'eslint-config-universe/flat/native.js';
import universeNodeConfig from 'eslint-config-universe/flat/node.js';
import universeWebConfig from 'eslint-config-universe/flat/web.js';

const COMMON_RULES = {
  'import/order': [
    'error',
    {
      groups: [['external', 'builtin'], 'internal', ['parent', 'sibling']],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
      },
      pathGroups: [
        {
          pattern: '~/**',
          group: 'internal',
        },
      ],
    },
  ],
  curly: 'warn',
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'no-void': ['warn', { allowAsStatement: true }],
  'import/no-cycle': ['error', { maxDepth: '∞' }],
};

const TS_COMMON_RULES = {
  '@typescript-eslint/explicit-function-return-type': [
    'off',
    {
      allowExpressions: true,
    },
  ],
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-misused-promises': [
    'error',
    {
      checksVoidReturn: false,
    },
  ],
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/return-await': ['error', 'always'],
  '@typescript-eslint/no-confusing-non-null-assertion': 'warn',
  '@typescript-eslint/no-extra-non-null-assertion': 'warn',
  '@typescript-eslint/prefer-as-const': 'warn',
  '@typescript-eslint/prefer-includes': 'warn',
  '@typescript-eslint/prefer-readonly': 'warn',
  '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
  '@typescript-eslint/ban-ts-comment': [
    'warn',
    {
      minimumDescriptionLength: 3,
      'ts-check': false,
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': true,
      'ts-nocheck': true,
    },
  ],
  '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
  '@typescript-eslint/no-restricted-types': 'warn',
};

export default defineConfig([
  globalIgnores([
    '**/.next',
    '**/.swc',
    '**/node_modules',
    '**/out',
    '**/public',
    'README.md',
    'next-env.d.ts',
  ]),

  // Overrides needed to make flat config rules work
  {
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // App files configuration
  {
    files: ['**/*.tsx', '**/*.d.ts'],
    extends: [universeWebConfig, universeNativeConfig],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...COMMON_RULES,
      ...TS_COMMON_RULES,
      '@next/next/no-img-element': 'off',
      'import/no-named-as-default': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/no-this-in-sfc': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css', 'mask-type'] }],
      'react/no-unescaped-entities': 'off',
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
    },
  },

  // Typed Node files configuration
  {
    files: ['**/*.ts'],
    extends: [universeNodeConfig],
    rules: {
      ...COMMON_RULES,
      ...TS_COMMON_RULES,
      'no-return-await': 'off',
    },
  },

  // Non-typed Node files configuration
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    extends: [universeNodeConfig],
    rules: {
      ...COMMON_RULES,
      'no-return-await': 'off',
    },
  },
]);
