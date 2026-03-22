import { type RepositoryTreeNode } from '~/types';

type RootFiles = { entries: RepositoryTreeNode[] } | null;

function hasMatchingFiles(rootFiles: RootFiles, fileNames: string[]) {
  if (!rootFiles || !rootFiles.entries.length) {
    return false;
  }

  return rootFiles.entries.some(
    node => fileNames.includes(node.name.toLowerCase()) && node.type === 'blob'
  );
}

const README_FILE_NAMES = ['readme', 'readme.md', 'readme.mdx'];

export function hasReadmeFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, README_FILE_NAMES);
}

const CONTRIBUTING_FILE_NAMES = ['contributing.md'];

export function hasContributingFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, CONTRIBUTING_FILE_NAMES);
}

const CHANGELOG_FILE_NAMES = ['changelog.md'];

export function hasChangelogFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, CHANGELOG_FILE_NAMES);
}

const CC_FILE_NAMES = ['code_of_conduct.md'];

export function hasCCFile(rootFiles: RootFiles) {
  return hasMatchingFiles(rootFiles, CC_FILE_NAMES);
}

export function detectPackageManager(rootFiles: RootFiles) {
  // LOCKS
  if (hasMatchingFiles(rootFiles, ['bun.lock', 'bun.lockb'])) {
    return 'bun';
  } else if (hasMatchingFiles(rootFiles, ['pnpm-lock.yaml', 'shrinkwrap.yaml'])) {
    return 'pnpm';
  } else if (hasMatchingFiles(rootFiles, ['yarn.lock'])) {
    return 'yarn';
  } else if (hasMatchingFiles(rootFiles, ['package-lock.json', 'shrinkwrap.json'])) {
    return 'npm';
  }
  // CONFIGS
  if (hasMatchingFiles(rootFiles, ['bunfig.toml'])) {
    return 'bun';
  } else if (hasMatchingFiles(rootFiles, ['.pnpm-workspace.yaml', '.pnpmfile.cjs'])) {
    return 'pnpm';
  } else if (hasMatchingFiles(rootFiles, ['.yarnrc'])) {
    return 'yarn@1';
  } else if (hasMatchingFiles(rootFiles, ['.yarnrc.yml'])) {
    return 'yarn@2+';
  }
  return undefined;
}
