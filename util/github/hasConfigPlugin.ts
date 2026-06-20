import { type RepositoryTreeNode } from '~/types';

const CONFIG_PLUGIN_FILE_NAME = 'app.plugin.js';

export default function hasConfigPlugin(rootFiles: { entries: RepositoryTreeNode[] } | null) {
  if (!rootFiles || !rootFiles.entries.length) {
    return false;
  }

  return rootFiles.entries.some(
    node => node.name === CONFIG_PLUGIN_FILE_NAME && node.type === 'blob'
  );
}
