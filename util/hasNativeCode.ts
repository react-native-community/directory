import { type RepositoryTreeNode } from '~/types';

const NATIVE_DIRECTORIES = ['android', 'ios', 'apple', 'macos', 'windows'];

export default function hasNativeCode(rootFiles: { entries: RepositoryTreeNode[] } | null) {
  if (!rootFiles || !rootFiles.entries.length) {
    return false;
  }

  return (
    rootFiles.entries.filter(
      node => NATIVE_DIRECTORIES.includes(node.name) || node.name.endsWith('podspec')
    ).length > 0
  );
}
