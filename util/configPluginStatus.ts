import { type LibraryType } from '~/types';

export function getConfigPluginStatus({ configPlugin, github }: LibraryType) {
  // Allow overriding the detected values
  return configPlugin ?? github.configPlugin;
}
