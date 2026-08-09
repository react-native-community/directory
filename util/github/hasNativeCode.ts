import { type RepositoryTreeNode } from '~/types';

const NATIVE_DIRECTORIES = new Set(['android', 'ios', 'apple', 'macos', 'windows']);

export default function hasNativeCode(rootFiles: { entries: RepositoryTreeNode[] } | null) {
  if (!rootFiles?.entries.length) {
    return false;
  }

  return rootFiles.entries.some(
    node => NATIVE_DIRECTORIES.has(node.name) || node.name.endsWith('podspec')
  );
}
