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
  curly: 'error',
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'no-void': ['error', { allowAsStatement: true }],
  'import/no-cycle': ['error', { maxDepth: '∞', disableScc: true }],
  'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
  'import/enforce-node-protocol-usage': ['error', 'always'],
};

const TS_COMMON_RULES = {
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-misused-promises': [
    'error',
    {
      checksVoidReturn: false,
    },
  ],
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/return-await': ['error', 'always'],
  '@typescript-eslint/no-confusing-non-null-assertion': 'error',
  '@typescript-eslint/no-extra-non-null-assertion': 'error',
  '@typescript-eslint/prefer-as-const': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/prefer-readonly': 'error',
  '@typescript-eslint/prefer-string-starts-ends-with': 'error',
  '@typescript-eslint/ban-ts-comment': [
    'error',
    {
      minimumDescriptionLength: 3,
      'ts-check': false,
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': true,
      'ts-nocheck': true,
    },
  ],
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-restricted-types': 'error',
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
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/purity': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/static-components': 'error',
    },
  },

  // Typed Bun files configuration
  {
    files: ['**/*.ts'],
    extends: [universeNodeConfig],
    rules: {
      ...COMMON_RULES,
      ...TS_COMMON_RULES,
    },
  },

  // Non-typed Bun files configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [universeNodeConfig],
    rules: {
      ...COMMON_RULES,
    },
  },
]);
