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
