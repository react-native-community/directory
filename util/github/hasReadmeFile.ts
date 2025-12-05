import { type RepositoryTreeNode } from '~/types';

const README_FILE_NAMES = ['readme', 'readme.md', 'readme.mdx'];

export default function hasReadmeFile(rootFiles: { entries: RepositoryTreeNode[] } | null) {
  if (!rootFiles || !rootFiles.entries.length) {
    return false;
  }

  return rootFiles.entries.some(
    node => README_FILE_NAMES.includes(node.name.toLowerCase()) && node.type === 'blob'
  );
}
