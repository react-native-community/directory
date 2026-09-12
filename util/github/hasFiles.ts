import { type RepositoryTreeNode } from '~/types';

type RootFiles = { entries: RepositoryTreeNode[] } | null;

function hasMatchingFiles(rootFiles: RootFiles, fileNames: Set<string>) {
  if (!rootFiles?.entries.length) {
    return false;
  }

  return rootFiles.entries.some(
    node => fileNames.has(node.name.toLowerCase()) && node.type === 'blob'
  );
}

const README_FILE_NAMES = new Set(['readme', 'readme.md', 'readme.mdx']);

export function hasReadmeFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, README_FILE_NAMES);
}

const CONTRIBUTING_FILE_NAMES = new Set(['contributing.md']);

export function hasContributingFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, CONTRIBUTING_FILE_NAMES);
}

const CHANGELOG_FILE_NAMES = new Set(['changelog.md']);

export function hasChangelogFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, CHANGELOG_FILE_NAMES);
}

const CC_FILE_NAMES = new Set(['code_of_conduct.md']);

export function hasCCFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, CC_FILE_NAMES);
}

const SECURITY_FILE_NAMES = new Set(['security.md']);

export function hasSecurityFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, SECURITY_FILE_NAMES);
}

export function detectPackageManager(rootFiles: RootFiles) {
  // LOCKS
  if (hasMatchingFiles(rootFiles, new Set(['bun.lock', 'bun.lockb']))) {
    return 'bun';
  } else if (hasMatchingFiles(rootFiles, new Set(['pnpm-lock.yaml', 'shrinkwrap.yaml']))) {
    return 'pnpm';
  } else if (hasMatchingFiles(rootFiles, new Set(['yarn.lock']))) {
    return 'yarn';
  } else if (hasMatchingFiles(rootFiles, new Set(['package-lock.json', 'shrinkwrap.json']))) {
    return 'npm';
  }
  // CONFIGS
  if (hasMatchingFiles(rootFiles, new Set(['bunfig.toml']))) {
    return 'bun';
  } else if (hasMatchingFiles(rootFiles, new Set(['.pnpm-workspace.yaml', '.pnpmfile.cjs']))) {
    return 'pnpm';
  } else if (hasMatchingFiles(rootFiles, new Set(['.yarnrc']))) {
    return 'yarn@1';
  } else if (hasMatchingFiles(rootFiles, new Set(['.yarnrc.yml']))) {
    return 'yarn@2+';
  }
  return undefined;
}

const OXLINT_CONFIG_FILE_NAMES = new Set([
  '.oxlintrc.json',
  '.oxlintrc.jsonc',
  'oxlint.config.mts',
  'oxlint.config.ts',
  'oxlint.config.mjs',
  'oxlint.config.js',
]);
const OXFMT_CONFIG_FILE_NAMES = new Set([
  '.oxfmtrc.json',
  '.oxfmtrc.jsonc',
  'oxfmt.config.mts',
  'oxfmt.config.ts',
  'oxfmt.config.mjs',
  'oxfmt.config.js',
]);
const ESLINT_CONFIG_FILE_NAMES = new Set([
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  'eslint.config.ts',
  'eslint.config.mjs',
  'eslint.config.cjs',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yaml',
  '.eslintrc.yml',
]);
const PRETTIER_CONFIG_FILE_NAMES = new Set([
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.json5',
  '.prettierrc.yaml',
  '.prettierrc.yml',
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.toml',
  '.prettierrc.mjs',
  'prettier.config.js',
  'prettier.config.cjs',
  'prettier.config.mjs',
]);
const BIOME_CONFIG_FILE_NAMES = new Set(['biome.json', 'biome.jsonc']);

export function detectLintStack(rootFiles: RootFiles) {
  const lintTools = [];
  if (hasMatchingFiles(rootFiles, OXLINT_CONFIG_FILE_NAMES)) {
    lintTools.push('oxlint');
  }
  if (hasMatchingFiles(rootFiles, OXFMT_CONFIG_FILE_NAMES)) {
    lintTools.push('oxfmt');
  }
  if (hasMatchingFiles(rootFiles, ESLINT_CONFIG_FILE_NAMES)) {
    lintTools.push('eslint');
  }
  if (hasMatchingFiles(rootFiles, PRETTIER_CONFIG_FILE_NAMES)) {
    lintTools.push('prettier');
  }
  if (hasMatchingFiles(rootFiles, BIOME_CONFIG_FILE_NAMES)) {
    lintTools.push('biome');
  }
  return lintTools;
}
